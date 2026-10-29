import React, { useState, useEffect } from 'react';
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
  Send
} from 'lucide-react';
import { UserDigitalCard } from '../types/clash';
import { 
  transferCoins, 
  TransferResult, 
  getKnownClients, 
  KnownClient,
  normalizeCardId,
  getCardBalance
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
  const [activeTab, setActiveTab] = useState<'recharge' | 'transfer'>('recharge');
  const [selectedCoins, setSelectedCoins] = useState<number>(5000);
  const [copiedCard, setCopiedCard] = useState(false);

  // Transfer state
  const [recipientCardId, setRecipientCardId] = useState('');
  const [transferAmount, setTransferAmount] = useState<string>('1000');
  const [transferNote, setTransferNote] = useState('');
  const [transferResult, setTransferResult] = useState<TransferResult | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [knownClients, setKnownClients] = useState<KnownClient[]>([]);

  useEffect(() => {
    if (isOpen) {
      setKnownClients(getKnownClients());
    }
  }, [isOpen]);

  if (!isOpen) return null;

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

  const COIN_TIERS: { coins: number; label: string; desc: string; popular?: boolean }[] = [
    { coins: 1000, label: '1,000 عملة', desc: 'مناسبة لحسابات التاون المتوسطة' },
    { coins: 2500, label: '2,500 عملة', desc: 'باقة ممتازة لتاون 14 و15', popular: true },
    { coins: 5000, label: '5,000 عملة', desc: 'باقة شائعة لتاون 16' },
    { coins: 10000, label: '10,000 عملة', desc: 'باقة ممتازة لحسابات الأساطير' },
    { coins: 20000, label: '20,000 عملة', desc: 'باقة كبار الشخصيات والكلانات' },
  ];

  const parsedTransferAmount = parseInt(transferAmount, 10) || 0;
  const normRecipient = normalizeCardId(recipientCardId);
  const recipientLiveBalance = normRecipient ? getCardBalance(normRecipient) : 0;

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);

    if (!normRecipient) {
      setTransferError('يرجى كتابة رقم بطاقة المستلم (مثال: CLC-1234-5678)');
      return;
    }

    if (normRecipient === normalizeCardId(userCard.cardId)) {
      setTransferError('لا يمكن التحويل لنفس بطاقتك الشخصية!');
      return;
    }

    if (parsedTransferAmount <= 0) {
      setTransferError('يرجى إدخال عدد عملات صحيح للتحويل.');
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
      transferNote.trim() || `تحويل من ${userCard.memberName}`
    );

    if (res.success) {
      setTransferResult(res);
      setKnownClients(getKnownClients());
    } else {
      setTransferError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#faf8f5] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-700">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">محفظة العملات الخاصة بالتطبيق</h3>
              <span className="text-[11px] text-stone-500">الرصيد المعتمد لشراء الحسابات وتحويل العملات</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 px-6 pt-2">
          <button
            type="button"
            onClick={() => { setActiveTab('recharge'); setTransferResult(null); setTransferError(null); }}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'recharge'
                ? 'border-amber-600 text-stone-900 bg-white rounded-t-lg font-black'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-600" />
            <span>طلب شحن رصيد</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('transfer'); setTransferResult(null); setTransferError(null); }}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'transfer'
                ? 'border-amber-600 text-stone-900 bg-white rounded-t-lg font-black'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4 text-amber-700" />
            <span>تحويل عملات لحساب آخر</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-right">
          {/* Current Balance Banner */}
          <div className="p-5 bg-gradient-to-br from-amber-500/10 via-amber-50/60 to-orange-500/10 border border-amber-300/80 rounded-2xl text-center space-y-1 shadow-xs">
            <span className="text-xs font-semibold text-stone-600 block">رصيد محفظتك الحالي:</span>
            <div className="flex items-baseline justify-center gap-2 py-1">
              <Coins className="w-6 h-6 text-amber-600 self-center" />
              <span className="text-4xl sm:text-5xl font-black text-amber-900 font-mono tabular-nums">
                {walletBalance.toLocaleString()}
              </span>
              <span className="text-base font-bold text-stone-800">عملة</span>
            </div>
            <p className="text-xs text-stone-500">
              بطاقتك: <strong className="font-mono text-stone-900">{userCard.cardId}</strong> ({userCard.memberName})
            </p>
          </div>

          {activeTab === 'recharge' ? (
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
                  <span>نظام الشحن حصري عبر إدارة الموقع</span>
                </div>
                <p className="leading-relaxed text-stone-700">
                  للحفاظ على أمان المعاملات، يتم الشحن حصراً ومباشرةً من قِبل إدارة الموقع بإضافة العملات إلى بطاقتك التعريفية فور التواصل عبر الواتساب.
                </p>
              </div>

              {/* Select Coin Package for WhatsApp message */}
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
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>إرسال طلب الشحن المباشر إلى المشرف عبر الواتساب</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  عند الضغط، سيتم فتح الواتساب تلقائياً مع رقم بطاقتك التعريفية <strong className="font-mono text-stone-900">({userCard.cardId})</strong> وكمية العملات المختارة ليقوم المشرف بشحن حسابك فوراً.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm text-sm cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>مراسلة المشرف بالواتساب لشحن ({selectedCoins.toLocaleString()} عملة)</span>
                </a>
              </div>
            </>
          ) : (
            /* Transfer Tab */
            transferResult ? (
              <div className="text-center py-6 animate-in fade-in duration-300 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-stone-900">تم تحويل العملات بنجاح!</h4>
                  <p className="text-xs text-stone-500 mt-1">
                    تم إرسال العملات فوراً إلى الحساب المطلوب وخصمها من محفظتك.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-md mx-auto text-xs space-y-2.5 text-right">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
                    <span className="text-stone-600">المبلغ المحول:</span>
                    <span className="font-mono font-black text-emerald-800 text-base">
                      {transferResult.amount.toLocaleString()} عملة
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">إلى الحساب:</span>
                    <span className="font-mono font-bold text-stone-900">
                      {transferResult.toCardId}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">رصيدك المتبقي:</span>
                    <span className="font-mono font-bold text-amber-900">
                      {transferResult.fromBalance.toLocaleString()} عملة
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60 text-[11px] text-stone-500">
                    <span>رقم السند: {transferResult.txnId}</span>
                    <span>{transferResult.timestamp}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTransferResult(null);
                    setTransferError(null);
                    setTransferAmount('1000');
                    setRecipientCardId('');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  إجراء تحويل آخر
                </button>
              </div>
            ) : (
              <form onSubmit={handleExecuteTransfer} className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    يمكنك تحويل العملات من رصيد محفظتك إلى أي حساب آخر مسجل برقم البطاقة التعريفية مباشرة وفورياً.
                  </p>
                </div>

                {/* Recipient Input */}
                <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-2 shadow-xs">
                  <label className="block text-xs font-bold text-stone-800">
                    1. رقم بطاقة المستلم:
                  </label>

                  {/* Fast selection from known cards */}
                  {knownClients.filter(c => c.cardId !== userCard.cardId).length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[11px] text-stone-500">البطاقات المتاحة:</span>
                      <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto p-1 bg-stone-50 rounded-lg border border-stone-100">
                        {knownClients
                          .filter((c) => c.cardId !== userCard.cardId)
                          .map((client) => (
                            <button
                              key={client.cardId}
                              type="button"
                              onClick={() => setRecipientCardId(client.cardId)}
                              className={`px-2 py-1 rounded text-[11px] font-mono cursor-pointer border transition-colors ${
                                normRecipient === client.cardId
                                  ? 'bg-amber-500 text-stone-950 border-amber-600 font-bold'
                                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              <span>{client.cardId}</span>
                              <span className="text-[9px] opacity-75 mr-1">({client.memberName})</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  <input
                    type="text"
                    required
                    placeholder="اكتب رقم بطاقة المستلم (مثال: CLC-8924-1102)"
                    value={recipientCardId}
                    onChange={(e) => setRecipientCardId(e.target.value.toUpperCase())}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-stone-900 outline-none focus:border-amber-500 text-left"
                  />
                  {normRecipient && (
                    <div className="text-[11px] text-stone-500 flex items-center justify-between">
                      <span>رصيد المستلم الحالي:</span>
                      <span className="font-mono font-bold text-stone-800">{recipientLiveBalance.toLocaleString()} عملة</span>
                    </div>
                  )}
                </div>

                {/* Amount to send */}
                <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-800">
                      2. عدد العملات المراد إرسالها:
                    </label>
                    <span className="text-xs font-mono font-black text-amber-800">
                      {parsedTransferAmount.toLocaleString()} عملة
                    </span>
                  </div>

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
                        {preset.toLocaleString()}
                      </button>
                    ))}
                    {walletBalance > 0 && (
                      <button
                        type="button"
                        onClick={() => setTransferAmount(walletBalance.toString())}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                      >
                        كامل رصيدي ({walletBalance.toLocaleString()})
                      </button>
                    )}
                  </div>

                  <input
                    type="number"
                    min={1}
                    max={walletBalance}
                    required
                    placeholder="أدخل كمية العملات..."
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-stone-900 outline-none focus:border-amber-500 text-left"
                  />
                </div>

                {/* Optional Note */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    ملاحظة السند (اختياري):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: دفعة لحساب كلاش"
                    value={transferNote}
                    onChange={(e) => setTransferNote(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 outline-none focus:border-amber-500"
                  />
                </div>

                {transferError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 font-semibold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{transferError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={walletBalance < parsedTransferAmount || parsedTransferAmount <= 0 || !normRecipient}
                  className="w-full py-3.5 px-4 rounded-xl font-black text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 text-sm"
                >
                  <Send className="w-4 h-4 text-stone-950" />
                  <span>تأكيد تحويل ({parsedTransferAmount.toLocaleString()} عملة) للمستلم</span>
                </button>
              </form>
            )
          )}

          {/* Quick link to view permanent ID passport */}
          {onOpenIdCardModal && (
            <div className="text-center pt-1 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenIdCardModal();
                }}
                className="text-xs text-amber-800 hover:text-amber-900 font-bold underline cursor-pointer inline-flex items-center gap-1"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>عرض بطاقتي التعريفية وتفاصيل الحساب</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

