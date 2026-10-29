import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, ArrowLeft, Copy, Check, Coins, MessageCircle, AlertCircle } from 'lucide-react';
import { AccountListing, UserDigitalCard } from '../types/clash';

interface CheckoutModalProps {
  account: AccountListing | null;
  onClose: () => void;
  walletBalance: number;
  userCard: UserDigitalCard;
  adminWhatsApp?: string;
  onDeductWallet: (amount: number) => void;
  onOpenWalletTopUp: () => void;
  onCompletePurchase: (account: AccountListing) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  account,
  onClose,
  walletBalance,
  userCard,
  adminWhatsApp = '9647708924110',
  onDeductWallet,
  onOpenWalletTopUp,
  onCompletePurchase,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!account) return null;

  const priceInCoins = account.priceUSD * 100;
  const hasEnoughCoins = walletBalance >= priceInCoins;
  const remainingAfterPurchase = Math.max(0, walletBalance - priceInCoins);
  const neededCoins = Math.max(0, priceInCoins - walletBalance);

  const cleanPhone = adminWhatsApp.replace(/[^0-9]/g, '');
  const rechargeWhatsappMsg = `السلام عليكم ورحمة الله،
أود شحن رصيد عملات لإتمام شراء حساب في متجر Al-Qimma Clash:

🪪 بطاقتي التعريفية:
- رقم البطاقة: ${userCard.cardId}
- اسم العضو: ${userCard.memberName}
- رصيدي الحالي: ${walletBalance.toLocaleString()} عملة

🛒 تفاصيل الحساب المراد شراؤه:
- الحساب: ${account.title} (تاون ${account.townHallLevel})
- سعر الحساب: ${priceInCoins.toLocaleString()} عملة
- العملات المطلوبة للشحن: ${neededCoins.toLocaleString()} عملة

يرجى تزويدي بالتعليمات لإتمام الشحن الآن. شكراً!`;

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(rechargeWhatsappMsg)}`;

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail) return;
    setStep(2);
  };

  const handleProcessPayment = () => {
    if (!hasEnoughCoins) return;
    setIsProcessing(true);
    setTimeout(() => {
      onDeductWallet(priceInCoins);
      setIsProcessing(false);
      setStep(3);
      onCompletePurchase(account);
    }, 1000);
  };

  const simulatedAccountEmail = `clash.${account.playerTag.replace('#', '').toLowerCase()}@supermail.net`;
  const simulatedVerificationPin = '824-916';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#faf8f5] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-stone-900">إتمام الشراء بالعملات المعتمدة</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Breadcrumbs */}
        <div className="px-6 py-3 bg-stone-100/70 border-b border-stone-200 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-amber-800 font-bold' : 'text-stone-400'}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-white border border-current">1</span>
            <span>بيانات المشتري</span>
          </div>
          <span className="text-stone-300">→</span>
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-amber-800 font-bold' : 'text-stone-400'}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-white border border-current">2</span>
            <span>تأكيد خصم العملات</span>
          </div>
          <span className="text-stone-300">→</span>
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-emerald-700 font-bold' : 'text-stone-400'}`}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] bg-white border border-current">3</span>
            <span>استلام بيانات القرية</span>
          </div>
        </div>

        {/* Step 1: Buyer Information */}
        {step === 1 && (
          <form onSubmit={handleNextToPayment} className="p-6 space-y-5 text-right">
            <div className="p-3.5 bg-white border border-stone-200 rounded-xl flex items-center gap-4 shadow-xs">
              <img
                src={account.image}
                alt={account.title}
                className="w-16 h-16 rounded-lg object-cover border border-stone-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-amber-700 font-bold">تاون هول {account.townHallLevel} · أبطال ({account.heroes.barbarianKing}/{account.heroes.archerQueen}/{account.heroes.grandWarden})</span>
                <h4 className="text-sm font-bold text-stone-900 truncate">{account.title}</h4>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <Coins className="w-4 h-4 text-amber-600 self-center" />
                  <span className="text-base font-extrabold text-amber-900 font-mono tabular-nums">
                    {priceInCoins.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-stone-700">عملة</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  بريدك الإلكتروني (لاستلام كود Supercell ID والفاتورة):
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-amber-600 outline-none text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  رقم الهاتف للتواصل بالواتساب (اختياري لمتابعة المشرف):
                </label>
                <input
                  type="tel"
                  placeholder="0770 XXX XXXX"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-amber-600 outline-none text-left"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1.5 text-xs shadow-xs">
              <div className="flex justify-between text-stone-600">
                <span>سعر القرية:</span>
                <span className="font-mono font-bold text-stone-900">{priceInCoins.toLocaleString()} عملة</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>رسوم الوساطة والضمان:</span>
                <span className="font-bold text-emerald-700">مجاناً (0 عملة)</span>
              </div>
              <div className="flex justify-between text-stone-900 font-bold pt-1.5 border-t border-stone-100">
                <span>المطلوب خصمه من المحفظة:</span>
                <span className="font-mono text-amber-800 font-extrabold text-sm">{priceInCoins.toLocaleString()} عملة</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>متابعة لتأكيد خصم العملات</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Step 2: Coins Payment Execution */}
        {step === 2 && (
          <div className="p-6 space-y-4 text-right">
            {/* Wallet & Card Status */}
            <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 text-xs">
                <span className="text-stone-500">البطاقة التعريفية:</span>
                <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">{userCard.cardId}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600">رصيدك المتاح حالياً:</span>
                <span className="font-mono font-black text-amber-800 text-sm">{walletBalance.toLocaleString()} عملة</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-600">سعر الحساب المطلوب:</span>
                <span className="font-mono font-black text-stone-900 text-sm">{priceInCoins.toLocaleString()} عملة</span>
              </div>

              {hasEnoughCoins ? (
                <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span>المتبقي في محفظتك بعد الشراء:</span>
                  <span className="font-mono">{remainingAfterPurchase.toLocaleString()} عملة</span>
                </div>
              ) : (
                <div className="pt-2 border-t border-rose-100 flex items-center justify-between text-xs font-bold text-rose-700">
                  <span>العملات المتبقية لإتمام الشراء:</span>
                  <span className="font-mono">ينقصك {neededCoins.toLocaleString()} عملة</span>
                </div>
              )}
            </div>

            {/* Condition A: User has enough coins */}
            {hasEnoughCoins ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    رصيدك كافٍ تماماً. عند الضغط على تأكيد، سيتم خصم <strong>{priceInCoins.toLocaleString()} عملة</strong> وتسليمك بيانات حساب القرية فوراً.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 text-sm"
                >
                  <Coins className="w-4 h-4 text-stone-950" />
                  <span>{isProcessing ? 'جاري خصم العملات وتأمين الحساب...' : `تأكيد الشراء بخصم (${priceInCoins.toLocaleString()} عملة)`}</span>
                </button>
              </div>
            ) : (
              /* Condition B: User does NOT have enough coins -> WhatsApp admin contact */
              <div className="space-y-3">
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5 text-xs text-rose-900">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>رصيد محفظتك غير كافٍ لإتمام عملية الشراء</span>
                  </div>
                  <p className="leading-relaxed text-stone-600">
                    رصيدك الحالي هو <strong>{walletBalance.toLocaleString()} عملة</strong> بينما سعر القرية هو <strong>{priceInCoins.toLocaleString()} عملة</strong>. نظام الشحن يتم حصراً ومباشرة عن طريق مراسلة المشرف بالواتساب مع بطاقتك التعريفية.
                  </p>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md text-sm cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>مراسلة المشرف لشحن ({neededCoins.toLocaleString()} عملة) بالواتساب</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenWalletTopUp();
                  }}
                  className="w-full py-2.5 text-xs text-stone-600 hover:text-stone-900 font-semibold text-center cursor-pointer"
                >
                  فتح المحفظة والاطلاع على تفاصيل البطاقة
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Purchase Completed & Account Credentials */}
        {step === 3 && (
          <div className="p-6 text-center space-y-5 text-right">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900 mb-1 text-center">تم شراء الحساب وتأمين العملية بنجاح!</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed text-center">
                تم خصم <strong className="font-mono text-amber-800">{priceInCoins.toLocaleString()} عملة</strong> من محفظتك وتوثيق العملية في سجل طلباتك تحت مظلة الضمان الذهبي.
              </p>
            </div>

            {/* Supercell ID Details Card */}
            <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-3 text-xs shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="font-bold text-stone-800">بيانات Supercell ID المسلّمة:</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  تم التحقق والحجز
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg">
                <span className="text-stone-500">البريد الإلكتروني للقرية:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-stone-900" dir="ltr">{simulatedAccountEmail}</span>
                  <button
                    onClick={() => copyToClipboard(simulatedAccountEmail)}
                    className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-lg text-amber-900">
                <span className="font-medium">كود الدخول الأولي السريع:</span>
                <span className="font-mono font-black text-sm">{simulatedVerificationPin}</span>
              </div>

              <p className="text-[11px] text-stone-500 leading-normal">
                يرجى فتح لعبة كلاش أوف كلانس، واختيار تسجيل الدخول عبر Supercell ID وإدخال البريد والكود أعلاه، ثم تغيير كلمة السر وتعيين بريدك البديل.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                إغلاق وتصفح المتجر
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
