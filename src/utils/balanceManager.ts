/**
 * Centralized Balance and Card Registry Manager for Al-Qimma Clash Marketplace.
 * Ensures:
 * 1. Every new client starts with 0 coins.
 * 2. Admin recharges to any Card ID (via secret code 091909) persist and update live across the app.
 * 3. Card IDs are normalized so Arabic/Persian digits, formatting, and case differences don't break lookups.
 * 4. Fast, secure, and bidirectional coin transfers between any two accounts with persistent receipts.
 */

const REGISTRY_STORAGE_KEY = 'clash_cards_balance_registry';
const KNOWN_CLIENTS_KEY = 'clash_known_clients_v2';
const WALLET_BALANCE_KEY = 'clash_wallet_balance';
const TRANSFER_LOGS_KEY = 'clash_coin_transfer_logs';

export interface KnownClient {
  cardId: string;
  memberName: string;
  balance: number;
  lastUpdated: string;
}

export interface TransferRecord {
  id: string;
  fromCardId: string;
  fromMemberName?: string;
  toCardId: string;
  toMemberName?: string;
  amount: number;
  date: string;
  note?: string;
  remainingBalance?: number;
}

export interface TransferResult {
  success: boolean;
  message: string;
  fromCardId: string;
  toCardId: string;
  fromMemberName?: string;
  toMemberName?: string;
  amount: number;
  fromBalance: number;
  toBalance: number;
  txnId: string;
  timestamp: string;
  note?: string;
}

/**
 * Converts Eastern Arabic (٠-٩) and Persian (۰-۹) numerals into standard Western Arabic ASCII digits (0-9).
 */
export function convertArabicDigits(input: string | number): string {
  if (input === null || input === undefined) return '';
  const str = String(input);
  return str
    .replace(/[٠۰]/g, '0')
    .replace(/[١۱]/g, '1')
    .replace(/[٢۲]/g, '2')
    .replace(/[٣۳]/g, '3')
    .replace(/[٤۴]/g, '4')
    .replace(/[٥۵]/g, '5')
    .replace(/[٦۶]/g, '6')
    .replace(/[٧۷]/g, '7')
    .replace(/[٨۸]/g, '8')
    .replace(/[٩۹]/g, '9');
}

/**
 * Parses user input for coin amounts, gracefully converting Arabic digits,
 * stripping non-numeric chars, and returning a positive integer.
 */
export function parseCoinAmount(input: any): number {
  if (typeof input === 'number') {
    return isNaN(input) || input < 0 ? 0 : Math.floor(input);
  }
  if (!input) return 0;
  const converted = convertArabicDigits(String(input))
    .replace(/[^0-9]/g, '');
  const parsed = parseInt(converted, 10);
  return isNaN(parsed) || parsed < 0 ? 0 : parsed;
}

/**
 * Normalizes card ID strings:
 * - Converts Arabic digits to standard digits
 * - Strips zero-width characters, hashes, and extra spaces
 * - Standardizes to uppercase format: CLC-XXXX-XXXX
 */
export function normalizeCardId(cardId: string): string {
  if (!cardId) return '';
  let cleaned = convertArabicDigits(cardId)
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width chars
    .trim()
    .toUpperCase()
    .replace(/^#+/, '')
    .replace(/\s+/g, '-');

  // If user entered without CLC prefix e.g. "8924-1102" or "89241102"
  if (/^\d{4}-\d{4}$/.test(cleaned)) {
    cleaned = `CLC-${cleaned}`;
  } else if (/^\d{8}$/.test(cleaned)) {
    cleaned = `CLC-${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  } else if (/^CLC\d{8}$/.test(cleaned)) {
    cleaned = `CLC-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }

  return cleaned;
}

/**
 * Gets the current coin balance of any card ID. Default is 0.
 */
export function getCardBalance(cardId: string): number {
  if (!cardId) return 0;
  const normalized = normalizeCardId(cardId);
  try {
    const raw = localStorage.getItem(REGISTRY_STORAGE_KEY);
    if (!raw) return 0;
    const registry = JSON.parse(raw) as Record<string, number>;
    const bal = registry[normalized];
    return typeof bal === 'number' && !isNaN(bal) ? bal : 0;
  } catch (e) {
    console.error('Error reading card balance:', e);
    return 0;
  }
}

/**
 * Sets the coin balance for a specific card ID and triggers updates.
 */
export function setCardBalance(cardId: string, newBalance: number, memberName?: string): void {
  if (!cardId) return;
  const normalized = normalizeCardId(cardId);
  const safeBal = Math.max(0, Math.floor(newBalance));

  try {
    const raw = localStorage.getItem(REGISTRY_STORAGE_KEY);
    const registry: Record<string, number> = raw ? JSON.parse(raw) : {};
    const oldBalance = registry[normalized] ?? 0;
    registry[normalized] = safeBal;
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(registry));

    // Update known clients
    updateKnownClientRecord(normalized, memberName || 'عميل كلاش', safeBal);

    // Notify all app components
    dispatchBalanceUpdate(normalized, safeBal, safeBal - oldBalance);
  } catch (e) {
    console.error('Error setting card balance:', e);
  }
}

/**
 * Adds coins to a specific card ID and returns the updated balance.
 */
export function addCoinsToCard(
  cardId: string, 
  amount: number, 
  memberName?: string
): { oldBalance: number; newBalance: number; cardId: string } {
  const normalized = normalizeCardId(cardId);
  const oldBalance = getCardBalance(normalized);
  const safeAmount = Math.max(0, Math.floor(amount));
  const newBalance = oldBalance + safeAmount;

  try {
    const raw = localStorage.getItem(REGISTRY_STORAGE_KEY);
    const registry: Record<string, number> = raw ? JSON.parse(raw) : {};
    registry[normalized] = newBalance;
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(registry));

    // Update known clients directory
    updateKnownClientRecord(normalized, memberName || 'عميل كلاش', newBalance);

    // Broadcast balance update event
    dispatchBalanceUpdate(normalized, newBalance, safeAmount);
  } catch (e) {
    console.error('Error adding coins to card:', e);
  }

  return { oldBalance, newBalance, cardId: normalized };
}

/**
 * Ensures a client is registered in the directory. Default balance is 0.
 */
export function registerClientIfNew(cardId: string, memberName: string): number {
  const normalized = normalizeCardId(cardId);
  let currentBalance = getCardBalance(normalized);

  // If first time encountering, initialize to 0
  if (currentBalance === 0) {
    try {
      const raw = localStorage.getItem(REGISTRY_STORAGE_KEY);
      const registry: Record<string, number> = raw ? JSON.parse(raw) : {};
      if (registry[normalized] === undefined) {
        registry[normalized] = 0;
        localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(registry));
      } else {
        currentBalance = registry[normalized];
      }
    } catch (e) {
      console.error(e);
    }
  }

  updateKnownClientRecord(normalized, memberName, currentBalance);
  return currentBalance;
}

/**
 * Retrieves all known client cards with their live balances.
 */
export function getKnownClients(): KnownClient[] {
  try {
    const raw = localStorage.getItem(KNOWN_CLIENTS_KEY);
    if (!raw) return [];
    const list: KnownClient[] = JSON.parse(raw);
    const registryRaw = localStorage.getItem(REGISTRY_STORAGE_KEY);
    const registry: Record<string, number> = registryRaw ? JSON.parse(registryRaw) : {};
    return list.map((client) => ({
      ...client,
      balance: registry[client.cardId] ?? client.balance ?? 0,
    }));
  } catch (e) {
    console.error('Error reading known clients:', e);
    return [];
  }
}

/**
 * Finds a specific known client by card ID.
 */
export function getKnownClientByCardId(cardId: string): KnownClient | undefined {
  const normalized = normalizeCardId(cardId);
  const clients = getKnownClients();
  return clients.find((c) => normalizeCardId(c.cardId) === normalized);
}

/**
 * Updates or appends a client to the known clients directory.
 */
function updateKnownClientRecord(cardId: string, memberName: string, balance: number): void {
  try {
    const raw = localStorage.getItem(KNOWN_CLIENTS_KEY);
    const list: KnownClient[] = raw ? JSON.parse(raw) : [];
    const index = list.findIndex((c) => normalizeCardId(c.cardId) === normalizeCardId(cardId));
    const nowStr = new Date().toLocaleDateString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    });

    const fallbackName = memberName.trim() || `عميل كلاش #${cardId.slice(-4)}`;

    if (index >= 0) {
      list[index] = {
        ...list[index],
        memberName: memberName.trim() ? memberName.trim() : list[index].memberName,
        balance,
        lastUpdated: nowStr,
      };
    } else {
      list.unshift({
        cardId,
        memberName: fallbackName,
        balance,
        lastUpdated: nowStr,
      });
    }

    localStorage.setItem(KNOWN_CLIENTS_KEY, JSON.stringify(list.slice(0, 40)));
  } catch (e) {
    console.error('Error updating known clients:', e);
  }
}

/**
 * Updates a client's stored member name in the registry.
 */
export function updateClientInfo(cardId: string, newMemberName: string): void {
  const norm = normalizeCardId(cardId);
  const bal = getCardBalance(norm);
  updateKnownClientRecord(norm, newMemberName, bal);
}

/**
 * Gets all transfer records from storage.
 */
export function getTransferLogs(): TransferRecord[] {
  try {
    const raw = localStorage.getItem(TRANSFER_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

/**
 * Gets transfer records related to a specific card (as sender or recipient).
 */
export function getTransferLogsForCard(cardId: string): TransferRecord[] {
  const normalized = normalizeCardId(cardId);
  if (!normalized) return [];
  const logs = getTransferLogs();
  return logs.filter(
    (l) =>
      normalizeCardId(l.fromCardId) === normalized ||
      normalizeCardId(l.toCardId) === normalized
  );
}

/**
 * Records a transfer log entry in persistent storage.
 */
function recordTransferLog(record: TransferRecord): void {
  try {
    const logs = getTransferLogs();
    logs.unshift(record);
    localStorage.setItem(TRANSFER_LOGS_KEY, JSON.stringify(logs.slice(0, 80)));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Transfers coins securely between two card IDs:
 * - Checks sender balance.
 * - Deducts from sender and credits recipient atomically.
 * - Registers recipient if new.
 * - Dispatches real-time UI balance events.
 * - Saves complete receipt log.
 */
export function transferCoins(
  fromCardId: string,
  toCardId: string,
  amount: number | string,
  note?: string
): TransferResult {
  const normFrom = normalizeCardId(fromCardId);
  const normTo = normalizeCardId(toCardId);
  const safeAmount = parseCoinAmount(amount);

  const nowStr = new Date().toLocaleDateString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (!normFrom) {
    return {
      success: false,
      message: 'رقم بطاقة الحساب المحوّل منه غير صحيح أو فارغ.',
      fromCardId: normFrom,
      toCardId: normTo,
      amount: safeAmount,
      fromBalance: 0,
      toBalance: 0,
      txnId: '',
      timestamp: nowStr,
    };
  }

  if (!normTo) {
    return {
      success: false,
      message: 'يرجى كتابة رقم بطاقة المستلم بشكل صحيح (مثال: CLC-1234-5678).',
      fromCardId: normFrom,
      toCardId: normTo,
      amount: safeAmount,
      fromBalance: getCardBalance(normFrom),
      toBalance: 0,
      txnId: '',
      timestamp: nowStr,
    };
  }

  if (normFrom === normTo) {
    return {
      success: false,
      message: 'لا يمكن تحويل العملات لنفس رقم البطاقة الشخصية!',
      fromCardId: normFrom,
      toCardId: normTo,
      amount: safeAmount,
      fromBalance: getCardBalance(normFrom),
      toBalance: getCardBalance(normTo),
      txnId: '',
      timestamp: nowStr,
    };
  }

  if (safeAmount <= 0) {
    return {
      success: false,
      message: 'يرجى إدخال كمية عملات صحيحة أكبر من صفر للتحويل.',
      fromCardId: normFrom,
      toCardId: normTo,
      amount: safeAmount,
      fromBalance: getCardBalance(normFrom),
      toBalance: getCardBalance(normTo),
      txnId: '',
      timestamp: nowStr,
    };
  }

  const fromBal = getCardBalance(normFrom);
  if (fromBal < safeAmount) {
    return {
      success: false,
      message: `رصيد الحساب المحوّل منه (${fromBal.toLocaleString()} عملة) غير كافٍ لتحويل ${safeAmount.toLocaleString()} عملة.`,
      fromCardId: normFrom,
      toCardId: normTo,
      amount: safeAmount,
      fromBalance: fromBal,
      toBalance: getCardBalance(normTo),
      txnId: '',
      timestamp: nowStr,
    };
  }

  try {
    const raw = localStorage.getItem(REGISTRY_STORAGE_KEY);
    const registry: Record<string, number> = raw ? JSON.parse(raw) : {};

    const newFromBal = Math.max(0, fromBal - safeAmount);
    const oldToBal = registry[normTo] ?? getCardBalance(normTo);
    const newToBal = oldToBal + safeAmount;

    registry[normFrom] = newFromBal;
    registry[normTo] = newToBal;

    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(registry));

    // Resolve member names
    const fromClient = getKnownClientByCardId(normFrom);
    const toClient = getKnownClientByCardId(normTo);

    const fromName = fromClient?.memberName || `المرسل (${normFrom})`;
    const toName = toClient?.memberName || `المستلم (${normTo})`;

    // Update known clients directory for both
    updateKnownClientRecord(normFrom, fromName, newFromBal);
    updateKnownClientRecord(normTo, toName, newToBal);

    // Broadcast both balance updates
    dispatchBalanceUpdate(normFrom, newFromBal, -safeAmount);
    dispatchBalanceUpdate(normTo, newToBal, safeAmount);

    const txnId = `TRF-${Math.floor(100000 + Math.random() * 900000)}`;

    const record: TransferRecord = {
      id: txnId,
      fromCardId: normFrom,
      fromMemberName: fromName,
      toCardId: normTo,
      toMemberName: toName,
      amount: safeAmount,
      date: nowStr,
      note: note || 'تحويل مباشر بين الحسابات',
      remainingBalance: newFromBal,
    };

    recordTransferLog(record);

    return {
      success: true,
      message: `تم تحويل ${safeAmount.toLocaleString()} عملة بنجاح إلى (${normTo})!`,
      fromCardId: normFrom,
      toCardId: normTo,
      fromMemberName: fromName,
      toMemberName: toName,
      amount: safeAmount,
      fromBalance: newFromBal,
      toBalance: newToBal,
      txnId,
      timestamp: nowStr,
      note: note || 'تحويل مباشر بين الحسابات',
    };
  } catch (e: any) {
    console.error('Transfer failed:', e);
    return {
      success: false,
      message: 'حدث خطأ غير متوقع أثناء معالجة التحويل. يرجى المحاولة ثانية.',
      fromCardId: normFrom,
      toCardId: normTo,
      amount: safeAmount,
      fromBalance: getCardBalance(normFrom),
      toBalance: getCardBalance(normTo),
      txnId: '',
      timestamp: nowStr,
    };
  }
}

/**
 * Creates and registers a new test card in the directory.
 */
export function createNewCardAccount(customName?: string): { cardId: string; memberName: string } {
  const rand1 = Math.floor(1000 + Math.random() * 9000);
  const rand2 = Math.floor(1000 + Math.random() * 9000);
  const newCardId = `CLC-${rand1}-${rand2}`;
  const name = customName?.trim() || `المحارب_${rand1}`;

  // Register in registry with 0 coins
  registerClientIfNew(newCardId, name);
  return { cardId: newCardId, memberName: name };
}

/**
 * Dispatches custom browser event so any open view/tab updates instantly.
 */
export function dispatchBalanceUpdate(cardId: string, newBalance: number, amountAdded: number): void {
  try {
    const event = new CustomEvent('clash_balance_change', {
      detail: { cardId, newBalance, amountAdded },
    });
    window.dispatchEvent(event);

    // Also update legacy storage key if it's the current user's card
    const currentUserCardRaw = localStorage.getItem('clash_user_id_card');
    if (currentUserCardRaw) {
      const userCard = JSON.parse(currentUserCardRaw);
      if (normalizeCardId(userCard.cardId) === normalizeCardId(cardId)) {
        localStorage.setItem(WALLET_BALANCE_KEY, newBalance.toString());
      }
    }
  } catch (e) {
    console.error('Error dispatching balance update:', e);
  }
}
