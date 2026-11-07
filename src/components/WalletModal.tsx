import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Copy, 
  Check, 
  MessageCircle, 
  AlertCircle, 
  Lock,
  ArrowLeftRight,
  Send,
  History,
  Share2,
  ArrowUpRight,
  ArrowDownLeft,
  UserCheck
} from 'lucide-react';
import { UserDigitalCard } from '../types/clash';
import { 
  transferCoins, 
  TransferResult, 
  TransferRecord,
  getKnownClients, 
  KnownClient,
  normalizeCardId,
  getCardBalance,
  getKnownClientByCardId,
  getTransferLogsForCard,
  parseCoinAmount,
  convertArabicDigits
} from '../utils/balanceManager';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  userCard: UserDigitalCard;
  adminWhatsApp?: string;
  onOpenIdCardModal?: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  walletBalance,
  userCard,
  adminWhatsApp = '9647708924110',
  onOpenIdCardModal,
}) => {
  const [activeTab, setActiveTab] = useState<'recharge' | 'transfer' | 'history'>('recharge');
  const [selectedCoins, setSelectedCoins] = useState<number>(5000);
  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedTxnId, setCopiedTxnId] = useState(false);

  // Transfer state
  const [recipientCardId, setRecipientCardId] = useState('');
  const [transferAmount, setTransferAmount] = useState<string>('1000');
  const [transferNote, setTransferNote] = useState('');
  const [transferResult, setTransferResult] = useState<TransferResult | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [knownClients, setKnownClients] = useState<KnownClient[]>([]);
  const [myTransferLogs, setMyTransferLogs] = useState<TransferRecord[]>([]);

  useEffect(() => {
    if (isOpen) {
      setKnownClients(getKnownClients());
      setMyTransferLogs(getTransferLogsForCard(userCard.cardId));
    }
  }, [isOpen, userCard.cardId, walletBalance]);

  const cleanPhone = adminWhatsApp.replace(/[^0-9]/g, '');

  const whatsappMessage = `السلام عليكم ورحمة الله،
أود شحن رصيد عملات لحسابي في متجر Al-Qimma Clash.

🪪 بيانات بطاقتي التعريفية:
- رقم البطاقة: ${userCard.cardId}
- اسم العضو: ${userCard.memberName}
- كود الأمان: ${userCard.securityCode}
- رصيدي الحالي: ${walletBalance.toLocaleString()} عملة

🎯 باقة العملات المطلوبة: ${selectedCoins.toLocaleString()} عملة
يرجى إرشادي لطريقة السداد وشحن العملات لحسابي. شكراً لك!`;

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  const copyCard = () => {
    navigator.clipboard.writeText(userCard.cardId);
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2000);
  };

  const copyTxn = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedTxnId(true);
    setTimeout(() => setCopiedTxnId(false), 2000);
  };

  const COIN_TIERS: { coins: number; label: string; desc: string; popular?: boolean }[] = [
    { coins: 1000, label: '1,000 عملة', desc: 'مناسبة لحسابات التاون المتوسطة' },
    { coins: 2500, label: '2,500 عملة', desc: 'باقة ممتازة لتاون 14 و15', popular: true },
    { coins: 5000, label: '5,000 عملة', desc: 'باقة شائعة لتاون 16' },
    { coins: 10000, label: '10,000 عملة', desc: 'باقة ممتازة لحسابات الأساطير' },
    { coins: 20000, label: '20,000 عملة', desc: 'باقة كبار الشخصيات والكلانات' },
  ];

  const parsedTransferAmount = parseCoinAmount(transferAmount);
  const normRecipient = normalizeCardId(recipientCardId);
  const recipientClient = useMemo(() => {
    if (!normRecipient) return undefined;
    return getKnownClientByCardId(normRecipient);
  }, [normRecipient, knownClients]);

  const recipientLiveBalance = normRecipient ? getCardBalance(normRecipient) : 0;
  const remainingAfterTransfer = Math.max(0, walletBalance - parsedTransferAmount);
  const canSubmitTransfer = 
    Boolean(normRecipient) && 
    normRecipient !== normalizeCardId(userCard.cardId) && 
    parsedTransferAmount > 0 && 
    walletBalance >= parsedTransferAmount;

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);

    if (!normRecipient) {
      setTransferError('يرجى كتابة رقم بطاقة المستلم بشكل صحيح (مثال: CLC-1234-5678)');
      return;
    }

    if (normRecipient === normalizeCardId(userCard.cardId)) {
      setTransferError('لا يمكن التحويل لنفس بطاقتك الشخصية!');
      return;
    }

    if (parsedTransferAmount <= 0) {
      setTransferError('يرجى إدخال عدد عملات صحيح أكبر من صفر للتحويل.');
      return;
    }

    if (walletBalance < parsedTransferAmount) {
      setTransferError(`رصيدك الحالي (${walletBalance.toLocaleString()} عملة) غير كافٍ لتحويل ${parsedTransferAmount.toLocaleString()} عملة.`);
      return;
    }

    const res = transferCoins(
      userCard.cardId,
      normRecipient,
      parsedTransferAmount,
      transferNote.trim() || `تحويل مباشر من ${userCard.memberName}`
    );

    if (res.success) {
      setTransferResult(res);
      setKnownClients(getKnownClients());
      setMyTransferLogs(getTransferLogsForCard(userCard.cardId));
    } else {
      setTransferError(res.message);
    }
  };

  const getShareReceiptWhatsappUrl = (res: TransferResult) => {
    const text = `🧾 إشعار تحويل عملات رسمي من متجر Al-Qimma Clash
───────────────────
⚡ تم تحويل ${res.amount.toLocaleString()} عملة بنجاح!
👤 من: ${res.fromMemberName || userCard.memberName} (${res.fromCardId})
🎯 إلى: ${res.toMemberName || res.toCardId} (${res.toCardId})
📋 رقم السند: ${res.txnId}
📅 التاريخ: ${res.timestamp}
📝 ملاحظة: ${res.note || 'تحويل مباشر'}
───────────────────
المتجر الرسمي المعتمد: Al-Qimma Clash`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#faf8f5] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 shadow-xs">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">محفظة العملات المعتمدة (Al-Qimma Clash)</h3>
              <span className="text-[11px] text-stone-500">الرصيد المتاح لشراء القرى، المزايدات، والتحويل المباشر</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 border-b border-stone-200 bg-stone-100/70 px-4 pt-2 text-center text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => { setActiveTab('recharge'); setTransferResult(null); setTransferError(null); }}
            className={`py-2.5 font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'recharge'
                ? 'border-amber-600 text-stone-950 bg-white rounded-t-xl font-black shadow-xs'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-600" />
            <span>طلب شحن</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('transfer'); setTransferResult(null); setTransferError(null); }}
            className={`py-2.5 font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'transfer'
                ? 'border-amber-600 text-stone-950 bg-white rounded-t-xl font-black shadow-xs'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4 text-amber-700" />
            <span>تحويل عملات</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('history'); setMyTransferLogs(getTransferLogsForCard(userCard.cardId)); }}
            className={`py-2.5 font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-amber-600 text-stone-950 bg-white rounded-t-xl font-black shadow-xs'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <History className="w-4 h-4 text-amber-700" />
            <span>السجل ({myTransferLogs.length})</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-right">
          {/* Current Balance Banner */}
          <div className="p-5 bg-gradient-to-br from-amber-500/10 via-amber-50/60 to-orange-500/10 border border-amber-300/80 rounded-2xl text-center space-y-1 shadow-xs">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              رصيدك الحالي المتاح:
            </span>
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-7 h-7 text-amber-600" />
              <span className="text-4xl sm:text-5xl font-black text-amber-950 font-mono tabular-nums">
                {walletBalance.toLocaleString()}
              </span>
              <span className="text-base font-bold text-stone-800">عملة</span>
            </div>
            <p className="text-xs text-stone-600">
              رقم بطاقتك: <strong className="font-mono text-stone-900 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300">{userCard.cardId}</strong> ({userCard.memberName})
            </p>
          </div>

          {activeTab === 'recharge' && (
            /* Recharge Tab */
            <>
              {/* User Digital Card Quick Reference */}
              <div className="p-4 bg-stone-900 text-amber-300 rounded-xl border border-amber-400/30 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block mb-0.5">بطاقتك التعريفية الدائمة للشحن:</span>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span className="font-mono text-base font-black tracking-widest text-white">
                      {userCard.cardId}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyCard}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCard ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ رقم البطاقة</span>
                    </>
                  )}
                </button>
              </div>

              {/* Strict Admin Recharge Notice */}
              <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-xl space-y-2 text-xs text-amber-950">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>الشحن الآمن والمباشر عبر إدارة المتجر</span>
                </div>
                <p className="leading-relaxed text-stone-700">
                  للحفاظ على أمان أموالك وحساباتك، يتم الشحن حصراً من قِبل إدارة المتجر بإيداع العملات مباشرة إلى رقم بطاقتك الدائمة فور التواصل معنا عبر الواتساب.
                </p>
              </div>

              {/* Select Coin Package */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2">
                  اختر كمية العملات التي ترغب بشحنها:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {COIN_TIERS.map((tier) => (
                    <button
                      key={tier.coins}
                      type="button"
                      onClick={() => setSelectedCoins(tier.coins)}
                      className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                        selectedCoins === tier.coins
                          ? 'bg-amber-100/90 border-amber-500 ring-1 ring-amber-400 shadow-xs'
                          : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-stone-900 font-mono text-sm">{tier.label}</span>
                        {tier.popular && (
                          <span className="text-[10px] bg-amber-500 text-stone-950 font-black px-1.5 py-0.5 rounded">
                            الأكثر طلباً
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500 block">{tier.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct WhatsApp Call-to-Action */}
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600 font-medium">رقم المشرف المسؤول على الواتساب:</span>
                  <span className="font-mono font-bold text-emerald-800" dir="ltr">+{cleanPhone}</span>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/30 text-sm cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>طلب شحن ({selectedCoins.toLocaleString()} عملة) عبر الواتساب</span>
                </a>
              </div>
            </>
          )}

          {activeTab === 'transfer' && (
            /* Transfer Tab */
            transferResult ? (
              <div className="text-center py-4 animate-in fade-in duration-300 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-stone-900">تم تحويل العملات بنجاح!</h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    تم إيداع العملات فورياً في بطاقة المستلم وخصمها من محفظتك.
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-300 rounded-2xl max-w-md mx-auto text-xs space-y-2.5 text-right shadow-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                    <span className="text-stone-600 font-medium">المبلغ المحول:</span>
                    <span className="font-mono font-black text-emerald-800 text-lg">
                      {transferResult.amount.toLocaleString()} عملة
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">إلى الحساب:</span>
                    <div className="text-left font-mono font-bold text-stone-900">
                      <span>{transferResult.toCardId}</span>
                      {transferResult.toMemberName && (
                        <span className="text-[10px] text-stone-500 mr-1.5 font-sans">
                          ({transferResult.toMemberName})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">رصيدك المتبقي:</span>
                    <span className="font-mono font-bold text-amber-900">
                      {transferResult.fromBalance.toLocaleString()} عملة
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-emerald-200 text-[11px] text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <span>رقم السند:</span>
                      <strong className="font-mono text-stone-900">{transferResult.txnId}</strong>
                      <button
                        type="button"
                        onClick={() => copyTxn(transferResult.txnId)}
                        className="text-stone-400 hover:text-stone-800 cursor-pointer p-0.5"
                        title="نسخ رقم السند"
                      >
                        {copiedTxnId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <span>{transferResult.timestamp}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  <a
                    href={getShareReceiptWhatsappUrl(transferResult)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>مشاركة الإيصال عبر الواتساب</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setTransferResult(null);
                      setTransferError(null);
                      setTransferAmount('1000');
                      setRecipientCardId('');
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs cursor-pointer shadow-xs transition-colors"
                  >
                    إجراء تحويل آخر
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExecuteTransfer} className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>تحويل العملات الفوري:</strong> اكتب أو اختر رقم بطاقة المستلم وسيتم تحويل العملات مباشرة وتحديث رصيد كلا الحسابين فوراً.
                  </p>
                </div>

                {/* Recipient Input */}
                <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800">
                      1. رقم بطاقة المستلم (Card ID):
                    </label>
                    {recipientClient && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        <span>{recipientClient.memberName}</span>
                      </span>
                    )}
                  </div>

                  {/* Fast selection from known cards */}
                  {knownClients.filter(c => normalizeCardId(c.cardId) !== normalizeCardId(userCard.cardId)).length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[11px] text-stone-500">اختر بسرعة من بطاقات العملاء:</span>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-stone-50 rounded-lg border border-stone-100">
                        {knownClients
                          .filter((c) => normalizeCardId(c.cardId) !== normalizeCardId(userCard.cardId))
                          .map((client) => (
                            <button
                              key={client.cardId}
                              type="button"
                              onClick={() => setRecipientCardId(client.cardId)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono cursor-pointer border transition-colors flex items-center gap-1 ${
                                normRecipient === normalizeCardId(client.cardId)
                                  ? 'bg-amber-500 text-stone-950 border-amber-600 font-bold shadow-xs'
                                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              <span>{client.cardId}</span>
                              <span className="text-[10px] opacity-75">({client.memberName})</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  <input
                    type="text"
                    required
                    placeholder="مثال: CLC-8924-1102"
                    value={recipientCardId}
                    onChange={(e) => setRecipientCardId(convertArabicDigits(e.target.value).toUpperCase())}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-stone-900 outline-none focus:border-amber-500 text-left"
                    dir="ltr"
                  />

                  {normRecipient && (
                    <div className="text-[11px] text-stone-600 flex items-center justify-between pt-1 border-t border-stone-100">
                      <span>رصيد المستلم الحالي:</span>
                      <span className="font-mono font-bold text-stone-900">
                        {recipientLiveBalance.toLocaleString()} عملة
                      </span>
                    </div>
                  )}
                </div>

                {/* Amount to send */}
                <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800">
                      2. كمية العملات المراد إرسالها:
                    </label>
                    <span className="text-xs font-mono font-black text-amber-800">
                      {parsedTransferAmount.toLocaleString()} عملة
                    </span>
                  </div>

                  {/* Quick percentage buttons */}
                  {walletBalance > 0 && (
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: '25%', value: Math.floor(walletBalance * 0.25) },
                        { label: '50%', value: Math.floor(walletBalance * 0.5) },
                        { label: '75%', value: Math.floor(walletBalance * 0.75) },
                        { label: 'الكل (100%)', value: walletBalance },
                      ].map((btn) => (
                        <button
                          key={btn.label}
                          type="button"
                          onClick={() => setTransferAmount(btn.value.toString())}
                          className="py-1 px-1.5 rounded-lg text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 cursor-pointer transition-colors text-center"
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Preset amounts */}
                  <div className="flex flex-wrap gap-1.5">
                    {[500, 1000, 2500, 5000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setTransferAmount(preset.toString())}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer border ${
                          parsedTransferAmount === preset
                            ? 'bg-amber-500 text-stone-950 border-amber-600'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200'
                        }`}
                      >
                        +{preset.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="أدخل عدد العملات (مثال: 1500)..."
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(convertArabicDigits(e.target.value))}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-stone-900 outline-none focus:border-amber-500 text-left"
                    dir="ltr"
                  />

                  {/* Remaining balance preview */}
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                    <span>رصيدك المتبقي بعد التحويل:</span>
                    <span className={`font-mono font-bold ${walletBalance < parsedTransferAmount ? 'text-rose-600' : 'text-amber-800'}`}>
                      {remainingAfterTransfer.toLocaleString()} عملة
                    </span>
                  </div>
                </div>

                {/* Optional Note */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    ملاحظة السند (اختياري):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: دفعة لشراء قرية كلاش أوف كلانس"
                    value={transferNote}
                    onChange={(e) => setTransferNote(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 outline-none focus:border-amber-500"
                  />
                </div>

                {transferError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 font-semibold flex items-center gap-1.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{transferError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmitTransfer}
                  className="w-full py-3.5 px-4 rounded-xl font-black text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 text-sm"
                >
                  <Send className="w-4 h-4 text-stone-950" />
                  <span>تأكيد إرسال ({parsedTransferAmount.toLocaleString()} عملة) للمستلم فوراً</span>
                </button>
              </form>
            )
          )}

          {activeTab === 'history' && (
            /* History Tab */
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-xs font-bold text-stone-800">
                  سجل سندات وتحويلات بطاقتك ({myTransferLogs.length})
                </span>
                <span className="text-[11px] text-stone-500 font-mono">
                  {userCard.cardId}
                </span>
              </div>

              {myTransferLogs.length === 0 ? (
                <div className="text-center py-8 bg-white border border-dashed border-stone-300 rounded-2xl p-6 text-stone-500 text-xs">
                  <History className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                  <p className="font-bold text-stone-700">لا توجد عمليات تحويل سابقة لهذه البطاقة</p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    عند إرسال أو استلام أي عملات ستظهر السندات وتفاصيل المعاملات هنا فوراً.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {myTransferLogs.map((log) => {
                    const isOutgoing = normalizeCardId(log.fromCardId) === normalizeCardId(userCard.cardId);
                    return (
                      <div
                        key={log.id}
                        className="p-3 bg-white border border-stone-200 rounded-xl text-xs space-y-1.5 shadow-xs hover:border-amber-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {isOutgoing ? (
                              <span className="p-1 rounded bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center gap-0.5">
                                <ArrowUpRight className="w-3 h-3" />
                                <span>صادر</span>
                              </span>
                            ) : (
                              <span className="p-1 rounded bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center gap-0.5">
                                <ArrowDownLeft className="w-3 h-3" />
                                <span>وارد</span>
                              </span>
                            )}
                            <span className="font-mono font-bold text-stone-900 text-xs">
                              {log.id}
                            </span>
                          </div>
                          <span className={`font-mono font-black text-xs ${isOutgoing ? 'text-rose-700' : 'text-emerald-700'}`}>
                            {isOutgoing ? '-' : '+'}{log.amount.toLocaleString()} عملة
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-stone-500">
                          <span>
                            {isOutgoing ? `إلى: ${log.toCardId}` : `من: ${log.fromCardId}`}
                          </span>
                          <span>{log.date}</span>
                        </div>

                        {log.note && (
                          <div className="text-[11px] text-stone-600 bg-stone-50 p-1.5 rounded border border-stone-100">
                            {log.note}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Quick link to view permanent ID passport */}
          {onOpenIdCardModal && (
            <div className="text-center pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenIdCardModal();
                }}
                className="text-xs text-amber-800 hover:text-amber-900 font-bold underline cursor-pointer inline-flex items-center gap-1"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>عرض بطاقتي التعريفية وتبديل الحسابات</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
