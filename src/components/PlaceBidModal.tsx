import React, { useState } from 'react';
import { 
  X, 
  Gavel, 
  Coins, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  CreditCard, 
  History, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Send,
  Lock
} from 'lucide-react';
import { AuctionListing, UserDigitalCard } from '../types/clash';

interface PlaceBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  auction: AuctionListing | null;
  userCard: UserDigitalCard;
  walletBalance: number;
  onPlaceBid: (auctionId: string, bidAmount: number) => void;
  onOpenRechargeGuide: () => void;
}

export const PlaceBidModal: React.FC<PlaceBidModalProps> = ({
  isOpen,
  onClose,
  auction,
  userCard,
  walletBalance,
  onPlaceBid,
  onOpenRechargeGuide,
}) => {
  if (!isOpen || !auction) return null;

  const currentBid = auction.currentBid;
  const minIncrement = auction.minIncrement;
  const minBidAllowed = currentBid + minIncrement;

  // Selected bid amount state
  const [bidAmount, setBidAmount] = useState<number>(minBidAllowed);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const hasEnoughCoins = walletBalance >= minBidAllowed;

  const handleIncrement = (inc: number) => {
    setErrorMsg(null);
    setBidAmount((prev) => Math.max(minBidAllowed, prev + inc));
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const val = parseInt(e.target.value, 10);
    setBidAmount(isNaN(val) ? 0 : val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount < minBidAllowed) {
      setErrorMsg(`الحد الأدنى للمزايدة يجب أن يكون على الأقل ${minBidAllowed.toLocaleString()} عملة كلاش`);
      return;
    }
    if (bidAmount > walletBalance) {
      setErrorMsg(`رصيدك الحالي (${walletBalance.toLocaleString()} عملة) غير كافٍ. يرجى الشحن أولاً.`);
      return;
    }

    onPlaceBid(auction.id, bidAmount);
    onClose();
  };

  const isUserHighestBidder = 
    userCard.cardId && 
    auction.highestBidderCardId && 
    userCard.cardId.trim().toUpperCase() === auction.highestBidderCardId.trim().toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Gavel className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold">المزايدة على القرية</h2>
              <p className="text-xs text-stone-300">مزايدة علنية مباشرة باستخدام عملات كلاش</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Village Summary Strip */}
        <div className="px-6 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center gap-4">
          <img
            src={auction.account.image}
            alt={auction.account.title}
            className="w-16 h-12 object-cover rounded-lg border border-stone-300 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[11px] font-bold">
                تاون {auction.account.townHallLevel}
              </span>
              <span className="text-xs font-mono text-stone-500">{auction.account.playerTag}</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate mt-0.5">
              {auction.account.title}
            </h4>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* User Digital Card & Coin Balance Status */}
          <div className="p-3.5 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-stone-400">بطاقتك الدائمة:</div>
                <div className="font-mono font-bold text-xs text-amber-300 tracking-wider">
                  {userCard.cardId} ({userCard.memberName})
                </div>
              </div>
            </div>

            <div className="text-left">
              <div className="text-[11px] text-stone-400">رصيدك المتاح:</div>
              <div className="flex items-baseline gap-1 font-mono font-black text-amber-400 text-base">
                <span>{walletBalance.toLocaleString()}</span>
                <span className="text-xs font-sans text-stone-300">عملة</span>
              </div>
            </div>
          </div>

          {/* Insufficient Coins Warning */}
          {!hasEnoughCoins && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-rose-800">
                    رصيدك الحالي ({walletBalance.toLocaleString()} عملة) أقل من الحد الأدنى للمزايدة ({minBidAllowed.toLocaleString()} عملة)!
                  </div>
                  <p className="text-stone-600 leading-relaxed">
                    عملات التطبيق يتم شحنها حصراً بواسطة المشرف المعتمد عبر إرسال رقم بطاقتك الشخصية بالواتساب.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRechargeGuide();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <span>شحن بطاقتي التعريفية بالواتساب الآن</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          )}

          {/* Current Bid info */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-stone-100 border border-stone-200">
              <span className="text-[11px] text-stone-500 block mb-0.5">أعلى سومة حالية</span>
              <span className="font-mono font-black text-lg text-stone-900">
                {currentBid.toLocaleString()}
              </span>
              <span className="text-xs text-stone-600 block">عملة</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[11px] text-amber-800 block mb-0.5">الحد الأدنى للسومة</span>
              <span className="font-mono font-black text-lg text-amber-900">
                {minBidAllowed.toLocaleString()}
              </span>
              <span className="text-xs text-amber-700 block">عملة (+{minIncrement})</span>
            </div>
          </div>

          {/* Bidding Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                قيمة السومة الجديدة (بالعملات):
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={minBidAllowed}
                  step={minIncrement}
                  value={bidAmount || ''}
                  onChange={handleCustomChange}
                  disabled={!hasEnoughCoins}
                  className="w-full bg-white border-2 border-amber-300 rounded-xl px-4 py-2.5 text-base font-mono font-black text-stone-900 focus:outline-none focus:border-amber-500 text-left pl-16 disabled:bg-stone-100 disabled:border-stone-200"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500 font-sans pointer-events-none">
                  عملة كلاش
                </span>
              </div>
            </div>

            {/* Quick Add Presets */}
            {hasEnoughCoins && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-stone-600">زيادة سريعة فوق السومة:</div>
                <div className="grid grid-cols-4 gap-2">
                  {[250, 500, 1000, 2500].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => handleIncrement(step)}
                      className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-amber-100 border border-stone-200 hover:border-amber-300 text-stone-800 text-xs font-mono font-bold transition-colors cursor-pointer"
                    >
                      +{step}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="text-xs text-rose-600 font-semibold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Escrow Guarantee Note */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-2.5 text-[11px] text-stone-600">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong>ضمان استرداد العملات:</strong> يتم حجز قيمة السومة مؤقتاً. إذا قام عضو آخر بوضع سومة أعلى، يتم إرجاع العملات تلقائياً إلى محفظتك فوراً دون أي استقطاع.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={!hasEnoughCoins || bidAmount < minBidAllowed}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-stone-200 disabled:text-stone-400 text-stone-950 font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:cursor-not-allowed"
              >
                <Gavel className="w-4 h-4" />
                <span>تأكيد المزايدة بـ ({bidAmount.toLocaleString()} عملة)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>

          {/* Recent Bid History */}
          <div className="pt-3 border-t border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-stone-500" />
                <span>سجل المزايدات الحية ({auction.bidHistory.length})</span>
              </span>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {auction.bidHistory.length > 0 ? (
                auction.bidHistory.map((bid, index) => {
                  const isCurrent = index === 0;
                  return (
                    <div
                      key={bid.id}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        isCurrent ? 'bg-amber-50 border border-amber-200 font-bold' : 'bg-stone-50 text-stone-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-emerald-500 animate-ping' : 'bg-stone-300'}`} />
                        <span>{bid.bidderName}</span>
                        <span className="text-[10px] font-mono text-stone-400">({bid.bidderCardId})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-900">
                          {bid.amount.toLocaleString()} عملة
                        </span>
                        <span className="text-[10px] text-stone-400">{bid.timestamp}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-3 text-stone-400 text-xs">
                  لا توجد مزايدات بعد. كن أول من يفتتح المزاد!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
