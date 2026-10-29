import React, { useState, useEffect } from 'react';
import { X, Shield, QrCode, Copy, Check, MessageCircle, User, Award, Settings, Coins, RefreshCw, Plus, ArrowLeftRight, UserCheck } from 'lucide-react';
import { UserDigitalCard } from '../types/clash';
import { getKnownClients, createNewCardAccount, normalizeCardId, getCardBalance, KnownClient } from '../utils/balanceManager';

interface DigitalIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCard: UserDigitalCard;
  walletBalance: number;
  adminWhatsApp: string;
  onUpdateAdminWhatsApp: (newNumber: string) => void;
  onSwitchCard?: (newCard: UserDigitalCard) => void;
}

export const DigitalIdCardModal: React.FC<DigitalIdCardModalProps> = ({
  isOpen,
  onClose,
  userCard,
  walletBalance,
  adminWhatsApp,
  onUpdateAdminWhatsApp,
  onSwitchCard,
}) => {
  const [copiedData, setCopiedData] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customPhone, setCustomPhone] = useState(adminWhatsApp);
  const [selectedPackForWhatsapp, setSelectedPackForWhatsapp] = useState<number>(2500);
  const [showSwitchAccounts, setShowSwitchAccounts] = useState(false);
  const [manualCardIdInput, setManualCardIdInput] = useState('');
  const [knownClientsList, setKnownClientsList] = useState<KnownClient[]>([]);

  useEffect(() => {
    if (isOpen) {
      setKnownClientsList(getKnownClients());
    }
  }, [isOpen, walletBalance]);

  if (!isOpen) return null;

  const handleCreateNewTestAccount = () => {
    const newAccount = createNewCardAccount();
    const fullCard: UserDigitalCard = {
      cardId: newAccount.cardId,
      memberName: newAccount.memberName,
      memberTier: 'عضوية موثقة دائمة',
      joinedDate: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      securityCode: Math.floor(1000 + Math.random() * 9000).toString(),
      avatarSeed: Math.floor(Math.random() * 100),
      qrCodeMock: `CLC-PASS-${newAccount.cardId}`,
    };
    if (onSwitchCard) {
      onSwitchCard(fullCard);
    }
    setKnownClientsList(getKnownClients());
  };

  const handleSwitchToClient = (client: KnownClient) => {
    const fullCard: UserDigitalCard = {
      cardId: client.cardId,
      memberName: client.memberName,
      memberTier: 'عضوية موثقة دائمة',
      joinedDate: client.lastUpdated || new Date().toLocaleDateString('ar-EG'),
      securityCode: Math.floor(1000 + Math.random() * 9000).toString(),
      avatarSeed: Math.floor(Math.random() * 100),
      qrCodeMock: `CLC-PASS-${client.cardId}`,
    };
    if (onSwitchCard) {
      onSwitchCard(fullCard);
    }
  };

  const handleManualCardSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    const norm = normalizeCardId(manualCardIdInput);
    if (!norm) return;
    const existing = knownClientsList.find((c) => normalizeCardId(c.cardId) === norm);
    const fullCard: UserDigitalCard = {
      cardId: norm,
      memberName: existing?.memberName || 'عميل كلاش',
      memberTier: 'عضوية موثقة دائمة',
      joinedDate: new Date().toLocaleDateString('ar-EG'),
      securityCode: Math.floor(1000 + Math.random() * 9000).toString(),
      avatarSeed: Math.floor(Math.random() * 100),
      qrCodeMock: `CLC-PASS-${norm}`,
    };
    if (onSwitchCard) {
      onSwitchCard(fullCard);
    }
    setManualCardIdInput('');
  };

  // Format the direct WhatsApp message
  const whatsappMessage = `السلام عليكم ورحمة الله،
أود شحن رصيد عملات في متجر Al-Qimma Clash.

🪪 بيانات بطاقتي التعريفية الدائمة:
- رقم البطاقة: ${userCard.cardId}
- اسم العضو: ${userCard.memberName}
- فئة العضوية: ${userCard.memberTier}
- كود الأمان: ${userCard.securityCode}
- رصيدي الحالي: ${walletBalance.toLocaleString()} عملة

🎯 باقة العملات المطلوبة للشحن: ${selectedPackForWhatsapp.toLocaleString()} عملة
يرجى شحن العملات لحساب بطاقتي بعد التحقق. شكراً لك!`;

  // WhatsApp clean link (remove +, spaces, dashes)
  const cleanPhone = adminWhatsApp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  const copyCardInfo = () => {
    const text = `بطاقة عضوية متجر Al-Qimma Clash:
رقم الهوية: ${userCard.cardId}
الاسم: ${userCard.memberName}
الرصيد: ${walletBalance.toLocaleString()} عملة
كود الأمان: ${userCard.securityCode}`;
    navigator.clipboard.writeText(text);
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2000);
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhone.trim()) return;
    onUpdateAdminWhatsApp(customPhone.trim());
    setShowSettings(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#faf8f5] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-700">
              <Shield className="w-5 h-5 fill-amber-500/20" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">بطاقتك التعريفية الدائمة (Clash Passport)</h3>
              <span className="text-[11px] text-stone-500">تم إنشاؤها تلقائياً لك وتبقى معك مدى الحياة للشحن والتوثيق</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              title="تعديل رقم واتساب المشرف"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WhatsApp Admin Phone Config Drawer */}
        {showSettings && (
          <form onSubmit={handleSavePhone} className="p-4 bg-amber-50 border-b border-amber-200 text-xs space-y-2">
            <label className="block font-bold text-stone-800">
              تعديل رقم هاتف المشرف على الواتساب (المستلم لطلبات الشحن):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="مثال: 9647708924110"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 font-mono text-stone-900 outline-none"
                dir="ltr"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg cursor-pointer"
              >
                حفظ
              </button>
            </div>
          </form>
        )}

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-right">
          {/* THE LIFELONG DIGITAL PASSPORT CARD */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 p-6 text-white border-2 border-amber-400/50 shadow-xl">
            {/* Soft decorative golden glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-amber-600/10 rounded-full blur-xl -ml-10 -mb-10 pointer-events-none" />

            {/* Top Row: Brand & Tier Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <Shield className="w-4 h-4 fill-amber-400/30" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-wide text-white font-serif">Al-Qimma Clash</h4>
                  <span className="text-[10px] text-amber-300 font-mono">متجر القمة · بطاقة العضوية الدائمة المعتمدة</span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
                {userCard.memberTier}
              </span>
            </div>

            {/* Middle Row: User Details */}
            <div className="grid grid-cols-2 gap-4 relative z-10 my-4 text-xs">
              <div>
                <span className="text-[10px] text-stone-400 block mb-0.5">اسم العضو:</span>
                <span className="font-bold text-white text-base tracking-wide flex items-center gap-1">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>{userCard.memberName}</span>
                </span>
              </div>

              <div className="text-left">
                <span className="text-[10px] text-stone-400 block mb-0.5">رصيد العملات المتاح:</span>
                <span className="font-black text-amber-400 text-lg font-mono tabular-nums flex items-baseline justify-end gap-1">
                  <Coins className="w-4 h-4 self-center text-amber-400" />
                  <span>{walletBalance.toLocaleString()}</span>
                  <span className="text-xs text-amber-300">عملة</span>
                </span>
              </div>
            </div>

            {/* Bottom Row: Permanent ID Number & Barcode */}
            <div className="pt-4 border-t border-stone-800/80 relative z-10 flex items-end justify-between">
              <div>
                <span className="text-[10px] text-stone-400 block mb-1">رقم الهوية الدائم (Permanent Member ID):</span>
                <span className="font-mono text-lg font-black tracking-widest text-amber-200 select-all">
                  {userCard.cardId}
                </span>
                <span className="text-[10px] text-stone-400 block mt-1 font-mono">
                  تاريخ الإنشاء: {userCard.joinedDate} · كود الأمان: {userCard.securityCode}
                </span>
              </div>

              {/* QR Stamp */}
              <div className="p-1.5 bg-white rounded-lg text-stone-950 shrink-0">
                <QrCode className="w-10 h-10 text-stone-900" />
              </div>
            </div>
          </div>

          {/* Action: Copy Card Data */}
          <div className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-800">رقم هويتك:</span>
              <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {userCard.cardId}
              </span>
            </div>
            <button
              onClick={copyCardInfo}
              className="text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copiedData ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ بيانات الهوية</span>
                </>
              )}
            </button>
          </div>

          {/* WHATSAPP RECHARGE MODULE */}
          <div className="p-5 bg-gradient-to-br from-emerald-50 via-white to-amber-50 border border-emerald-300 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">شحن رصيد العملات عبر الواتساب مع المشرف</h4>
                <span className="text-[11px] text-stone-500">
                  الشحن يتم حصراً ومباشرة من خلال المشرف، يتم إرسال بطاقتك التعريفية لشحن رصيدك
                </span>
              </div>
            </div>

            {/* Select recharge pack in coins */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">اختر باقة العملات التي تريد شحنها:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[1000, 2500, 5000, 10000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSelectedPackForWhatsapp(amount)}
                    className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedPackForWhatsapp === amount
                        ? 'bg-emerald-600 text-white font-bold border-emerald-700 shadow-xs'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span className="block font-mono font-black">{amount.toLocaleString()}</span>
                    <span className="text-[10px] block opacity-90">عملة</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-white/80 border border-emerald-200 rounded-xl text-xs space-y-1 text-stone-600">
              <div className="flex items-center justify-between text-[11px]">
                <span>رقم المشرف المسؤول على الواتساب:</span>
                <span className="font-mono font-bold text-emerald-800" dir="ltr">+{cleanPhone}</span>
              </div>
              <p className="text-[11px] text-stone-500">
                عند الضغط على الزر، سيتم فتح الواتساب تلقائياً مع رقم بطاقتك التعريفية <strong>({userCard.cardId})</strong> ليقوم المشرف بشحن العملات إلى محفظتك فوراً.
              </p>
            </div>

            {/* Primary WhatsApp Action Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition-all flex items-center justify-center gap-2.5 shadow-md shadow-emerald-600/20 text-sm cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>مراسلة المشرف بالواتساب وإرسال بطاقتي للشحن ({selectedPackForWhatsapp.toLocaleString()} عملة)</span>
            </a>
          </div>

          {/* MULTI-ACCOUNT SWITCHING & TRANSFER TESTING MODULE */}
          <div className="p-4 bg-stone-100/80 border border-stone-200 rounded-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-stone-200 text-stone-700">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-stone-900">التبديل بين الحسابات وتجربة التحويل</h5>
                  <span className="text-[10px] text-stone-500">يتيح لك التبديل بين بطاقات العملاء على نفس الجهاز للتأكد من وصول العملات المحولة</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSwitchAccounts(!showSwitchAccounts)}
                className="text-xs font-bold text-amber-800 hover:text-amber-900 underline cursor-pointer"
              >
                {showSwitchAccounts ? 'إخفاء' : 'عرض الحسابات'}
              </button>
            </div>

            {showSwitchAccounts && (
              <div className="pt-2 border-t border-stone-200 space-y-3">
                {/* Create New Test Account Button */}
                <button
                  type="button"
                  onClick={handleCreateNewTestAccount}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4 text-amber-700" />
                  <span>إنشاء بطاقة إضافية جديدة للتجربة والتحويل (تبدأ برصيد 0 عملة)</span>
                </button>

                {/* List of registered accounts */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  <span className="block text-[11px] font-bold text-stone-600">الحسابات المسجلة لديك:</span>
                  {knownClientsList.map((client) => {
                    const isCurrent = normalizeCardId(client.cardId) === normalizeCardId(userCard.cardId);
                    return (
                      <div
                        key={client.cardId}
                        className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                          isCurrent
                            ? 'bg-amber-50/80 border-amber-300 text-stone-900'
                            : 'bg-white border-stone-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-amber-500' : 'bg-stone-300'}`} />
                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-xs">{client.cardId}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">الحالي</span>
                              )}
                            </div>
                            <span className="text-[10px] text-stone-500 truncate block">{client.memberName}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono font-black text-amber-800 text-xs">
                            {getCardBalance(client.cardId).toLocaleString()} عملة
                          </span>
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleSwitchToClient(client)}
                              className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>تبديل</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Manual switch input */}
                <form onSubmit={handleManualCardSwitch} className="pt-2 border-t border-stone-200 flex gap-2">
                  <input
                    type="text"
                    placeholder="أو اكتب رقم بطاقة أخرى للتبديل إليها (مثال: CLC-1234-5678)"
                    value={manualCardIdInput}
                    onChange={(e) => setManualCardIdInput(e.target.value)}
                    className="flex-1 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none"
                    dir="ltr"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-lg text-xs cursor-pointer"
                  >
                    دخول بالبطاقة
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
