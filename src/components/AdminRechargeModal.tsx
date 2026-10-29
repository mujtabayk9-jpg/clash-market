import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  History, 
  User, 
  Plus, 
  Trash2, 
  Check, 
  CreditCard,
  Search,
  Users,
  Store,
  ArrowRight,
  ArrowLeftRight,
  Send,
  AlertCircle
} from 'lucide-react';
import { UserDigitalCard, AdminRechargeTransaction } from '../types/clash';
import { 
  getCardBalance, 
  addCoinsToCard, 
  getKnownClients, 
  normalizeCardId,
  KnownClient,
  transferCoins,
  TransferResult,
  getTransferLogs,
  TransferRecord
} from '../utils/balanceManager';

interface AdminRechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserCard: UserDigitalCard;
  currentBalance: number;
  onAddCoinsToCurrentAccount: (amount: number, note?: string) => void;
  onOpenAddVillageModal?: () => void;
}

export const AdminRechargeModal: React.FC<AdminRechargeModalProps> = ({
  isOpen,
  onClose,
  currentUserCard,
  currentBalance,
  onAddCoinsToCurrentAccount,
  onOpenAddVillageModal,
}) => {
  // Target choice: 'current' or 'custom_card'
  const [targetType, setTargetType] = useState<'current' | 'custom_card'>('current');
  const [customCardId, setCustomCardId] = useState('');
  const [customMemberName, setCustomMemberName] = useState('');
  
  // Coin amount selection
  const [selectedPreset, setSelectedPreset] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  // Payment info & notes
  const [paymentMethod, setPaymentMethod] = useState<'direct_admin' | 'manual_order' | 'bonus'>('direct_admin');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Status & Logs
  const [isSuccess, setIsSuccess] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{ amount: number; target: string; newBalance: number; cardId: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'charge' | 'transfer' | 'history'>('charge');

  // Transfer Between Accounts state
  const [transferSourceType, setTransferSourceType] = useState<'current' | 'custom'>('current');
  const [transferCustomSourceId, setTransferCustomSourceId] = useState('');
  const [transferDestId, setTransferDestId] = useState('');
  const [transferDestName, setTransferDestName] = useState('');
  const [transferPreset, setTransferPreset] = useState<number>(1000);
  const [transferCustomAmount, setTransferCustomAmount] = useState<string>('');
  const [transferNote, setTransferNote] = useState('');
  const [transferSuccess, setTransferSuccess] = useState<TransferResult | null>(null);
  const [transferError, setTransferError] = useState<string | null>(null);

  // Known clients list for fast selection
  const [knownClients, setKnownClients] = useState<KnownClient[]>([]);

  useEffect(() => {
    if (isOpen) {
      setKnownClients(getKnownClients());
    }
  }, [isOpen]);

  // Admin transactions log stored in localStorage
  const [transactions, setTransactions] = useState<AdminRechargeTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('clash_admin_recharge_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('clash_admin_recharge_logs', JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  if (!isOpen) return null;

  const resolvedAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedPreset;

  // Active target calculations
  const isCurrent = targetType === 'current';
  const effectiveTargetCardId = isCurrent 
    ? currentUserCard.cardId 
    : (normalizeCardId(customCardId) || '');
  
  const isTargetingActiveUser = normalizeCardId(effectiveTargetCardId) === normalizeCardId(currentUserCard.cardId);

  // Live balance check of whatever card is currently typed or selected
  const activeCardLiveBalance = effectiveTargetCardId 
    ? (isTargetingActiveUser ? currentBalance : getCardBalance(effectiveTargetCardId))
    : 0;

  const predictedNewBalance = activeCardLiveBalance + resolvedAmount;

  const handleSelectKnownClient = (client: KnownClient) => {
    setTargetType('custom_card');
    setCustomCardId(client.cardId);
    setCustomMemberName(client.memberName);
  };

  const handleExecuteRecharge = () => {
    if (resolvedAmount <= 0) return;
    if (!effectiveTargetCardId) {
      alert('يرجى تحديد أو كتابة رقم البطاقة التعريفية للعميل');
      return;
    }

    const targetCard = effectiveTargetCardId;
    const targetName = isCurrent 
      ? currentUserCard.memberName 
      : (customMemberName.trim() || 'عميل كلاش');

    let methodLabel = 'شحن مباشر من المشرف';
    if (paymentMethod === 'manual_order') methodLabel = 'طلب واتساب معتمد';
    if (paymentMethod === 'bonus') methodLabel = 'مكافأة / ترقية';

    // 1. Central registry update
    const result = addCoinsToCard(targetCard, resolvedAmount, targetName);

    // 2. If it targets the active current user, also update live state directly
    if (isTargetingActiveUser) {
      onAddCoinsToCurrentAccount(resolvedAmount, `شحن إداري معتمد (${methodLabel})`);
    }

    // 3. Append to transactions log
    const newTxn: AdminRechargeTransaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      targetCardId: targetCard,
      targetMemberName: targetName,
      coinsAdded: resolvedAmount,
      paymentMethod: `${methodLabel} ${customerPhone ? `(${customerPhone})` : ''}`,
      notes: notes.trim() || 'تم الشحن عبر بوابة المشرف المعتمدة',
      date: new Date().toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
      adminCode: '091909'
    };

    setTransactions((prev) => [newTxn, ...prev]);

    setSuccessDetails({
      amount: resolvedAmount,
      target: `${targetName}`,
      cardId: targetCard,
      newBalance: result.newBalance,
    });
    setIsSuccess(true);
    setKnownClients(getKnownClients());
  };

  const resolvedTransferAmount = transferCustomAmount ? parseInt(transferCustomAmount, 10) || 0 : transferPreset;

  const effectiveSourceCardId = transferSourceType === 'current'
    ? currentUserCard.cardId
    : (normalizeCardId(transferCustomSourceId) || '');

  const effectiveDestCardId = normalizeCardId(transferDestId) || '';

  const sourceCardLiveBalance = effectiveSourceCardId
    ? (normalizeCardId(effectiveSourceCardId) === normalizeCardId(currentUserCard.cardId) ? currentBalance : getCardBalance(effectiveSourceCardId))
    : 0;

  const destCardLiveBalance = effectiveDestCardId ? getCardBalance(effectiveDestCardId) : 0;

  const handleExecuteTransfer = () => {
    setTransferError(null);

    if (!effectiveSourceCardId) {
      setTransferError('يرجى تحديد أو كتابة رقم بطاقة الحساب المحوّل منه');
      return;
    }

    if (!effectiveDestCardId) {
      setTransferError('يرجى تحديد أو كتابة رقم بطاقة الحساب المستلم');
      return;
    }

    if (effectiveSourceCardId === effectiveDestCardId) {
      setTransferError('لا يمكن التحويل لنفس رقم البطاقة');
      return;
    }

    if (resolvedTransferAmount <= 0) {
      setTransferError('يرجى إدخال عدد عملات صحيح للتحويل');
      return;
    }

    if (sourceCardLiveBalance < resolvedTransferAmount) {
      setTransferError(`رصيد الحساب المحول منه (${sourceCardLiveBalance.toLocaleString()} عملة) غير كافٍ لتحويل ${resolvedTransferAmount.toLocaleString()} عملة`);
      return;
    }

    const result = transferCoins(
      effectiveSourceCardId,
      effectiveDestCardId,
      resolvedTransferAmount,
      transferNote.trim() || 'تحويل إداري معتمد بين الحسابات'
    );

    if (result.success) {
      setTransferSuccess(result);
      setKnownClients(getKnownClients());
    } else {
      setTransferError(result.message);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('هل تريد مسح سجل العمليات الإدارية؟')) {
      setTransactions([]);
      try {
        localStorage.removeItem('clash_admin_recharge_logs');
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-2xl bg-[#faf8f5] border border-amber-400/90 rounded-2xl shadow-2xl overflow-hidden text-stone-900 animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Top Master Admin Bar */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white px-5 py-4 border-b border-amber-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
              <ShieldAlert className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white font-serif">لوحة إدارة Al-Qimma Clash</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-stone-950">
                  صلاحية المشرف العام
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                إدارة متجر القمة كلاش · الشحن المباشر لبطاقات العملاء والتحويل وإضافة القرى
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs & Village Button */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-stone-100/80 px-4 pt-2">
          <div className="flex">
            <button
              onClick={() => { setActiveTab('charge'); setIsSuccess(false); }}
              className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'charge'
                  ? 'border-amber-600 text-stone-900 bg-white rounded-t-lg font-black'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-600" />
              <span>شحن رصيد للعميل</span>
            </button>
            <button
              onClick={() => { setActiveTab('transfer'); setTransferSuccess(null); setTransferError(null); }}
              className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'transfer'
                  ? 'border-amber-600 text-stone-900 bg-white rounded-t-lg font-black'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 text-amber-700" />
              <span>تحويل بين حسابين</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'border-amber-600 text-stone-900 bg-white rounded-t-lg font-black'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <History className="w-4 h-4 text-stone-500" />
              <span>سجل العمليات ({transactions.length})</span>
            </button>
          </div>

          {/* Quick Village Publisher Trigger for Admin */}
          {onOpenAddVillageModal && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAddVillageModal();
              }}
              className="mb-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-transform active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-stone-950" />
              <span>إضافة قرية للبيع</span>
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'charge' ? (
            isSuccess && successDetails ? (
              <div className="text-center py-6 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-bold text-stone-900 mb-2">تم تسليم العملات لحساب العميل بنجاح!</h4>
                <p className="text-sm text-stone-600 max-w-md mx-auto mb-5">
                  تم إضافة <span className="font-bold text-amber-800 font-mono text-base">+{successDetails.amount.toLocaleString()} عملة</span> فوراً لبطاقة العميل:
                  <br />
                  <strong className="text-stone-950 text-base">{successDetails.target}</strong>
                  <span className="block font-mono text-xs text-stone-500 mt-1">{successDetails.cardId}</span>
                </p>

                <div className="bg-amber-50 border border-amber-300/80 rounded-xl p-4 max-w-sm mx-auto mb-6 text-right shadow-xs">
                  <div className="flex justify-between items-center text-xs text-stone-600 pb-2 border-b border-amber-200">
                    <span>رصيد العميل الإجمالي الجديد:</span>
                    <span className="font-black font-mono text-stone-900 text-base">{successDetails.newBalance.toLocaleString()} عملة</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-stone-600 pt-2">
                    <span>حالة الاستقبال:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> متاح الآن للشراء الفوري بالمتجر
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setCustomAmount('');
                      setNotes('');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-sm transition-colors"
                  >
                    شحن بطاقة أخرى
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm cursor-pointer shadow-xs transition-colors"
                  >
                    إغلاق والعودة للمتجر
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Step 1: Select Target Card */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-stone-800">
                      1. تحديد البطاقة التعريفية للعميل المستفيد:
                    </label>
                    <span className="text-[11px] text-stone-500">
                      كل عميل يملك كود بطاقة فريد وخالد
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Active User Card Button */}
                    <button
                      type="button"
                      onClick={() => setTargetType('current')}
                      className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col gap-1 ${
                        targetType === 'current'
                          ? 'border-amber-500 bg-amber-500/15 shadow-xs ring-2 ring-amber-400/50'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-amber-700" />
                          حسابي الحالي المفتوح (تجربة سريعة)
                        </span>
                        {targetType === 'current' && <Check className="w-4 h-4 text-amber-700" />}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-stone-600 font-mono mt-1">
                        <span className="font-bold">{currentUserCard.cardId}</span>
                        <span className="text-amber-800 font-black">{currentBalance.toLocaleString()} عملة</span>
                      </div>
                    </button>

                    {/* Custom Client Card Button */}
                    <button
                      type="button"
                      onClick={() => setTargetType('custom_card')}
                      className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col gap-1 ${
                        targetType === 'custom_card'
                          ? 'border-amber-500 bg-amber-500/15 shadow-xs ring-2 ring-amber-400/50'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-stone-700" />
                          شحن بطاقة عميل بالرقم
                        </span>
                        {targetType === 'custom_card' && <Check className="w-4 h-4 text-amber-700" />}
                      </div>
                      <span className="text-[11px] text-stone-500">
                        كتابة أو لصق رقم بطاقة العميل المرسل بالواتساب
                      </span>
                    </button>
                  </div>

                  {/* Custom Card ID Input Fields with Live Balance Inspector */}
                  {targetType === 'custom_card' && (
                    <div className="mt-3 p-4 bg-white border border-stone-200 rounded-xl space-y-3 animate-in fade-in duration-150">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-stone-700">
                            اكتب أو الصق رقم بطاقة العميل:
                          </label>
                          {customCardId && (
                            <span className="text-[10px] text-stone-500 font-mono">
                              معاينة: {normalizeCardId(customCardId)}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="مثال: CLC-8924-4110"
                            value={customCardId}
                            onChange={(e) => setCustomCardId(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-stone-900 outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          اسم صاحب البطاقة (اختياري للتوثيق):
                        </label>
                        <input
                          type="text"
                          placeholder="اسم العميل المستلم"
                          value={customMemberName}
                          onChange={(e) => setCustomMemberName(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Known Registered Clients Quick Selector */}
                      {knownClients.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold text-stone-500 block mb-1.5 flex items-center gap-1">
                            <Users className="w-3 h-3 text-amber-600" />
                            بطاقات العملاء المسجلة في التطبيق (اضغط للاختيار السريع):
                          </span>
                          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                            {knownClients.map((client) => (
                              <button
                                key={client.cardId}
                                type="button"
                                onClick={() => handleSelectKnownClient(client)}
                                className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-colors cursor-pointer flex items-center gap-1.5 ${
                                  normalizeCardId(customCardId) === client.cardId
                                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-600'
                                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                                }`}
                              >
                                <span>{client.memberName}</span>
                                <span className="opacity-75">({client.cardId})</span>
                                <span className="text-amber-800 font-bold">[{client.balance.toLocaleString()} عملة]</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Live Card Balance Banner */}
                  {effectiveTargetCardId && (
                    <div className="mt-3 p-3 bg-amber-50/90 border border-amber-300 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-stone-500 block text-[10px]">البطاقة المستهدفة:</span>
                        <span className="font-mono font-bold text-stone-900">{effectiveTargetCardId}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-stone-500 block text-[10px]">الرصيد الحالي:</span>
                          <span className="font-mono font-bold text-stone-800">{activeCardLiveBalance.toLocaleString()} عملة</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-amber-600 rotate-180" />
                        <div className="text-right">
                          <span className="text-stone-500 block text-[10px]">الرصيد بعد الشحن:</span>
                          <span className="font-mono font-black text-emerald-700 text-sm">
                            {predictedNewBalance.toLocaleString()} عملة
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2: Coin Amount */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-stone-800">
                      2. كمية العملات المراد إرسالها للعميل:
                    </label>
                    <span className="text-xs font-black text-amber-800 font-mono">
                      الإجمالي: +{resolvedAmount.toLocaleString()} عملة
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2.5">
                    {[
                      { coins: 500, label: '500 عملة' },
                      { coins: 1000, label: '1,000 عملة' },
                      { coins: 2500, label: '2,500 عملة' },
                      { coins: 5000, label: '5,000 عملة' },
                      { coins: 10000, label: '10,000 عملة' },
                    ].map((pack) => (
                      <button
                        key={pack.coins}
                        type="button"
                        onClick={() => {
                          setSelectedPreset(pack.coins);
                          setCustomAmount('');
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          !customAmount && selectedPreset === pack.coins
                            ? 'border-amber-500 bg-amber-500 text-stone-950 font-bold shadow-xs'
                            : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="text-xs font-black font-mono">+{pack.coins.toLocaleString()}</div>
                        <div className="text-[10px] opacity-80 mt-0.5">{pack.label}</div>
                      </button>
                    ))}
                  </div>

                  {/* Custom manual amount */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 shrink-0">أو اكتب كمية مخصصة:</span>
                    <input
                      type="number"
                      placeholder="مثال: 15000 عملة"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-mono outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Step 3: Reference Info */}
                <div className="p-3.5 bg-stone-100/70 border border-stone-200 rounded-xl space-y-2.5">
                  <label className="block text-xs font-bold text-stone-700">
                    3. مرجع الشحن:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'direct_admin', label: 'شحن مباشر من المشرف' },
                      { id: 'manual_order', label: 'طلب واتساب معتمد' },
                      { id: 'bonus', label: 'مكافأة / ترقية' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          paymentMethod === m.id
                            ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="رقم هاتف العميل (اختياري للتوثيق)"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 outline-none focus:border-amber-500"
                      dir="ltr"
                    />
                    <input
                      type="text"
                      placeholder="ملاحظات الشحن (اختياري)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Confirm Action Button */}
                <button
                  type="button"
                  onClick={handleExecuteRecharge}
                  disabled={resolvedAmount <= 0 || !effectiveTargetCardId}
                  className="w-full py-3.5 px-4 rounded-xl font-black text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 text-sm"
                >
                  <Coins className="w-4 h-4 text-stone-950" />
                  <span>تأكيد شحن (+{resolvedAmount.toLocaleString()} عملة) لبطاقة العميل فوراً</span>
                </button>
              </div>
            )
          ) : activeTab === 'transfer' ? (
            /* Transfer Between Accounts Tab */
            transferSuccess ? (
              <div className="text-center py-6 animate-in fade-in duration-300 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-stone-900">تم تحويل العملات بنجاح!</h4>
                  <p className="text-xs text-stone-500 mt-1">
                    تم خصم العملات من حساب المرسل وإضافتها فورياً لحساب المستلم في السجل العام.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-md mx-auto text-xs space-y-2.5 text-right">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
                    <span className="text-stone-600">المبلغ المحول:</span>
                    <span className="font-mono font-black text-emerald-800 text-base">
                      {transferSuccess.amount.toLocaleString()} عملة
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">من حساب:</span>
                    <span className="font-mono font-bold text-stone-900">
                      {transferSuccess.fromCardId} (المتبقي: {transferSuccess.fromBalance.toLocaleString()})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">إلى حساب:</span>
                    <span className="font-mono font-bold text-stone-900">
                      {transferSuccess.toCardId} (الجديد: {transferSuccess.toBalance.toLocaleString()})
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60 text-[11px] text-stone-500">
                    <span>رقم السند: {transferSuccess.txnId}</span>
                    <span>{transferSuccess.timestamp}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTransferSuccess(null);
                    setTransferError(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  إجراء تحويل آخر
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-200 text-right">
                {/* Info Alert */}
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>تحويل العملات المباشر:</strong> يمكنك تحويل أي كمية من العملات من أي بطاقة تملك رصيداً إلى بطاقة أخرى فورياً وتحديث المحافظ على الفور.
                  </p>
                </div>

                {/* Source Account (من حساب) */}
                <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-stone-500" />
                      <span>1. الحساب المحوّل منه (المرسل):</span>
                    </span>
                    <span className="text-xs font-bold font-mono text-emerald-700">
                      الرصيد المتاح: {sourceCardLiveBalance.toLocaleString()} عملة
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setTransferSourceType('current')}
                      className={`p-2 rounded-lg border text-right transition-colors cursor-pointer ${
                        transferSourceType === 'current'
                          ? 'border-amber-500 bg-amber-50/80 font-bold text-amber-950'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="text-[10px] text-stone-500">حسابي الحالي:</div>
                      <div className="font-mono text-xs">{currentUserCard.cardId}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTransferSourceType('custom')}
                      className={`p-2 rounded-lg border text-right transition-colors cursor-pointer ${
                        transferSourceType === 'custom'
                          ? 'border-amber-500 bg-amber-50/80 font-bold text-amber-950'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="text-[10px] text-stone-500">حساب بطاقة أخرى:</div>
                      <div className="text-xs">تحديد أو كتابة رقم بطاقة</div>
                    </button>
                  </div>

                  {transferSourceType === 'custom' && (
                    <div className="pt-1">
                      <input
                        type="text"
                        placeholder="اكتب رقم بطاقة المرسل (مثال: CLC-1234-5678)"
                        value={transferCustomSourceId}
                        onChange={(e) => setTransferCustomSourceId(e.target.value.toUpperCase())}
                        className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-stone-900 outline-none focus:border-amber-500 text-left"
                      />
                    </div>
                  )}
                </div>

                {/* Destination Account (إلى حساب) */}
                <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-amber-600" />
                      <span>2. الحساب المحوّل إليه (المستلم):</span>
                    </span>
                    {effectiveDestCardId && (
                      <span className="text-xs font-mono text-stone-500">
                        رصيده الحالي: {destCardLiveBalance.toLocaleString()} عملة
                      </span>
                    )}
                  </div>

                  {/* Fast selection from known clients */}
                  {knownClients.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[11px] text-stone-500">اختر من بطاقات العملاء المسجلة:</span>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-stone-50 rounded-lg border border-stone-100">
                        {knownClients
                          .filter((c) => c.cardId !== effectiveSourceCardId)
                          .map((client) => (
                            <button
                              key={client.cardId}
                              type="button"
                              onClick={() => {
                                setTransferDestId(client.cardId);
                                setTransferDestName(client.memberName);
                              }}
                              className={`px-2 py-1 rounded text-[11px] font-mono cursor-pointer border transition-colors ${
                                effectiveDestCardId === client.cardId
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

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      أو اكتب رقم بطاقة المستلم يدوياً:
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: CLC-8924-1102"
                      value={transferDestId}
                      onChange={(e) => setTransferDestId(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-stone-900 outline-none focus:border-amber-500 text-left"
                    />
                  </div>
                </div>

                {/* Amount To Transfer */}
                <div className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800">
                      3. عدد العملات المراد تحويلها:
                    </span>
                    <span className="text-xs font-mono font-black text-amber-800">
                      {resolvedTransferAmount.toLocaleString()} عملة
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[500, 1000, 2500, 5000, 10000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setTransferPreset(preset);
                          setTransferCustomAmount('');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer border ${
                          resolvedTransferAmount === preset && !transferCustomAmount
                            ? 'bg-amber-500 text-stone-950 border-amber-600'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200'
                        }`}
                      >
                        {preset.toLocaleString()}
                      </button>
                    ))}
                    {sourceCardLiveBalance > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setTransferCustomAmount(sourceCardLiveBalance.toString());
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                      >
                        كامل الرصيد ({sourceCardLiveBalance.toLocaleString()})
                      </button>
                    )}
                  </div>

                  <input
                    type="number"
                    min={1}
                    max={sourceCardLiveBalance}
                    placeholder="أو اكتب عدد عملات مخصص..."
                    value={transferCustomAmount}
                    onChange={(e) => setTransferCustomAmount(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-stone-900 outline-none focus:border-amber-500 text-left"
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    ملاحظة السند (اختياري):
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: تحويل عملات لشراء قرية تاون 16"
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

                {/* Submit Transfer Button */}
                <button
                  type="button"
                  onClick={handleExecuteTransfer}
                  disabled={resolvedTransferAmount <= 0 || !effectiveSourceCardId || !effectiveDestCardId || sourceCardLiveBalance < resolvedTransferAmount}
                  className="w-full py-3.5 px-4 rounded-xl font-black text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 text-sm"
                >
                  <ArrowLeftRight className="w-4 h-4 text-stone-950" />
                  <span>تأكيد تحويل ({resolvedTransferAmount.toLocaleString()} عملة) بين الحسابين فوراً</span>
                </button>
              </div>
            )
          ) : (
            /* History Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-xs font-bold text-stone-700">
                  سجل الشحن الإداري وعمليات التحويل ({transactions.length + getTransferLogs().length} عملية)
                </span>
                {transactions.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>مسح السجل</span>
                  </button>
                )}
              </div>

              {/* Transfer Logs */}
              {getTransferLogs().length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-amber-600" />
                    <span>سجل التحويلات بين الحسابات ({getTransferLogs().length}):</span>
                  </div>
                  {getTransferLogs().map((trf) => (
                    <div
                      key={trf.id}
                      className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs space-y-1 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span className="font-bold text-stone-800">{trf.fromCardId}</span>
                          <span className="text-stone-400">←</span>
                          <span className="font-bold text-amber-900">{trf.toCardId}</span>
                        </div>
                        <span className="font-black font-mono text-amber-900 text-sm">
                          {trf.amount.toLocaleString()} عملة
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-amber-200/50">
                        <span>{trf.note || 'تحويل مباشر'} · سند: {trf.id}</span>
                        <span className="font-mono">{trf.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Direct Recharges Log */}
              {transactions.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-emerald-600" />
                    <span>عمليات الشحن الإداري:</span>
                  </div>
                  {transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="p-3 bg-white border border-stone-200 rounded-xl text-xs space-y-1.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{txn.targetMemberName}</span>
                          <span className="font-mono text-[10px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-600 font-bold">
                            {txn.targetCardId}
                          </span>
                        </div>
                        <span className="font-black font-mono text-emerald-700 text-sm">
                          +{txn.coinsAdded.toLocaleString()} عملة
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                        <span>{txn.paymentMethod} · {txn.notes}</span>
                        <span className="font-mono">{txn.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {transactions.length === 0 && getTransferLogs().length === 0 && (
                <div className="text-center py-8 text-stone-400 text-xs">
                  لا توجد عمليات سابقة مسجلة.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
