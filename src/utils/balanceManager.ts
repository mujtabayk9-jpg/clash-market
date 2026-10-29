/**
 * Centralized Balance and Card Registry Manager for Clash Marketplace.
 * Ensures:
 * 1. Every new client starts with 0 coins.
 * 2. Admin recharges to any Card ID (via 091909) persist and update live across the app.
 * 3. Card IDs are normalized so formatting/case differences don't break lookups.
 */

const REGISTRY_STORAGE_KEY = 'clash_cards_balance_registry';
const KNOWN_CLIENTS_KEY = 'clash_known_clients_v2';
const WALLET_BALANCE_KEY = 'clash_wallet_balance';

export interface KnownClient {
  cardId: string;
  memberName: string;
  balance: number;
  lastUpdated: string;
}

/**
 * Normalizes card ID string: uppercase, trimmed, standardized hyphens.
 */
export function normalizeCardId(cardId: string): string {
  if (!cardId) return '';
  return cardId.trim().toUpperCase().replace(/\s+/g, '-');
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
    registry[normalized] = safeBal;
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(registry));

    // Update known clients
    updateKnownClientRecord(normalized, memberName || 'عميل كلاش', safeBal);

    // Notify all app components
    dispatchBalanceUpdate(normalized, safeBal, 0);
  } catch (e) {
    console.error('Error setting card balance:', e);
  }
}

/**
 * Adds coins to a specific card ID and returns the new balance.
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

  // If first time encountering, set to 0
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
 * Retrieves all known client cards for easy administrative selection.
 */
export function getKnownClients(): KnownClient[] {
  try {
    const raw = localStorage.getItem(KNOWN_CLIENTS_KEY);
    if (!raw) return [];
    const list: KnownClient[] = JSON.parse(raw);
    // Refresh with current registry balances
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
 * Updates or appends a client to the known clients list.
 */
function updateKnownClientRecord(cardId: string, memberName: string, balance: number): void {
  try {
    const raw = localStorage.getItem(KNOWN_CLIENTS_KEY);
    const list: KnownClient[] = raw ? JSON.parse(raw) : [];
    const index = list.findIndex((c) => c.cardId === cardId);
    const nowStr = new Date().toLocaleDateString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    });

    if (index >= 0) {
      list[index] = {
        ...list[index],
        memberName: memberName || list[index].memberName,
        balance,
        lastUpdated: nowStr,
      };
    } else {
      list.unshift({
        cardId,
        memberName,
        balance,
        lastUpdated: nowStr,
      });
    }

    localStorage.setItem(KNOWN_CLIENTS_KEY, JSON.stringify(list.slice(0, 30)));
  } catch (e) {
    console.error('Error updating known clients:', e);
  }
}

export interface TransferRecord {
  id: string;
  fromCardId: string;
  toCardId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface TransferResult {
  success: boolean;
  message: string;
  fromCardId: string;
  toCardId: string;
  amount: number;
  fromBalance: number;
  toBalance: number;
  txnId: string;
  timestamp: string;
}

const TRANSFER_LOGS_KEY = 'clash_coin_transfer_logs';

export function getTransferLogs(): TransferRecord[] {
  try {
    const raw = localStorage.getItem(TRANSFER_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

function recordTransferLog(record: TransferRecord): void {
  try {
    const logs = getTransferLogs();
    logs.unshift(record);
    localStorage.setItem(TRANSFER_LOGS_KEY, JSON.stringify(logs.slice(0, 50)));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Transfers coins securely from one card ID to another card ID.
 * Updates balances, registry, and triggers live UI events for both accounts.
 */
export function transferCoins(
  fromCardId: string,
  toCardId: string,
  amount: number,
  note?: string
): TransferResult {
  const normFrom = normalizeCardId(fromCardId);
  const normTo = normalizeCardId(toCardId);
  const safeAmount = Math.max(0, Math.floor(amount));

  if (!normFrom || !normTo) {
    return {
      success: false,
      message: 'يرجى كتابة رقم البطاقة المحوّل منها ورقم بطاقة المستلم بشكل صحيح.',
      fromCardId: normFrom,
      toCardId: normTo,
      amount: safeAmount,
      fromBalance: getCardBalance(normFrom),
      toBalance: getCardBalance(normTo),
      txnId: '',
      timestamp: new Date().toLocaleTimeString('ar-EG'),
    };
  }

  if (normFrom === normTo) {
    return {
      success: false,
      message: 'لا يمكن تحويل العملات لنفس رقم البطاقة!',
      fromCardId: normFrom,
      toCardId: normTo,
      amount: safeAmount,
      fromBalance: getCardBalance(normFrom),
      toBalance: getCardBalance(normTo),
      txnId: '',
      timestamp: new Date().toLocaleTimeString('ar-EG'),
    };
  }

  if (safeAmount <= 0) {
    return {
      success: false,
      message: 'يرجى إدخال عدد عملات صحيح أكبر من صفر للتحويل.',
      fromCardId: normFrom,
      toCardId: normTo,
      amount: safeAmount,
      fromBalance: getCardBalance(normFrom),
      toBalance: getCardBalance(normTo),
      txnId: '',
      timestamp: new Date().toLocaleTimeString('ar-EG'),
    };
  }

  const fromBal = getCardBalance(normFrom);
  if (fromBal < safeAmount) {
    return {
      success: false,
      message: `رصيد الحساب المحول منه (${fromBal.toLocaleString()} عملة) غير كافٍ لتحويل ${safeAmount.toLocaleString()} عملة.`,
      fromCardId: normFrom,
      toCardId: normTo,
      amount: safeAmount,
      fromBalance: fromBal,
      toBalance: getCardBalance(normTo),
      txnId: '',
      timestamp: new Date().toLocaleTimeString('ar-EG'),
    };
  }

  try {
    const raw = localStorage.getItem(REGISTRY_STORAGE_KEY);
    const registry: Record<string, number> = raw ? JSON.parse(raw) : {};

    const newFromBal = fromBal - safeAmount;
    const oldToBal = registry[normTo] ?? 0;
    const newToBal = oldToBal + safeAmount;

    registry[normFrom] = newFromBal;
    registry[normTo] = newToBal;

    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(registry));

    // Update known clients directory for both
    updateKnownClientRecord(normFrom, '', newFromBal);
    updateKnownClientRecord(normTo, '', newToBal);

    // Broadcast both balance updates
    dispatchBalanceUpdate(normFrom, newFromBal, -safeAmount);
    dispatchBalanceUpdate(normTo, newToBal, safeAmount);

    const txnId = `TRF-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowStr = new Date().toLocaleDateString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    });

    // Record in persistent transfer log
    recordTransferLog({
      id: txnId,
      fromCardId: normFrom,
      toCardId: normTo,
      amount: safeAmount,
      date: nowStr,
      note: note || 'تحويل مباشر بين الحسابات',
    });

    return {
      success: true,
      message: `تم تحويل ${safeAmount.toLocaleString()} عملة بنجاح من (${normFrom}) إلى (${normTo})!`,
      fromCardId: normFrom,
      toCardId: normTo,
      amount: safeAmount,
      fromBalance: newFromBal,
      toBalance: newToBal,
      txnId,
      timestamp: nowStr,
    };
  } catch (e: any) {
    console.error('Transfer failed:', e);
    return {
      success: false,
      message: 'حدث خطأ في النظام أثناء معالجة التحويل. يرجى المحاولة مجدداً.',
      fromCardId: normFrom,
      toCardId: normTo,
      amount: safeAmount,
      fromBalance: getCardBalance(normFrom),
      toBalance: getCardBalance(normTo),
      txnId: '',
      timestamp: new Date().toLocaleTimeString('ar-EG'),
    };
  }
}

/**
 * Creates and registers a new card in the directory.
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
function dispatchBalanceUpdate(cardId: string, newBalance: number, amountAdded: number): void {
  try {
    const event = new CustomEvent('clash_balance_change', {
      detail: { cardId, newBalance, amountAdded },
    });
    window.dispatchEvent(event);

    // Also update legacy storage key if it's the current user's card
    const currentUserCardRaw = localStorage.getItem('clash_user_id_card');
    if (currentUserCardRaw) {
      const userCard = JSON.parse(currentUserCardRaw);
      if (normalizeCardId(userCard.cardId) === cardId) {
        localStorage.setItem(WALLET_BALANCE_KEY, newBalance.toString());
      }
    }
  } catch (e) {
    console.error('Error dispatching balance update:', e);
  }
}


