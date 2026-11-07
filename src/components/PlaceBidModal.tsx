import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, CreditCard, Gavel, History, Lock, X } from 'lucide-react';
import { AuctionListing, UserDigitalCard } from '../types/clash';
import { normalizeCardId } from '../utils/balanceManager';

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
  const [bidAmount, setBidAmount] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentBid = auction?.currentBid ?? 0;
  const minIncrement = Math.max(1, auction?.minIncrement ?? 1);
  const minBidAllowed = currentBid + minIncrement;
  const isUserHighestBidder = Boolean(
    auction?.highestBidderCardId &&
      normalizeCardId(auction.highestBidderCardId) === normalizeCardId(userCard.cardId),
  );
  // The current leader only needs enough coins for the additional amount.
  const minimumAmountDue = isUserHighestBidder ? minIncrement : minBidAllowed;
  const maxBidAllowed = isUserHighestBidder ? currentBid + walletBalance : walletBalance;
  const isAuctionOpen = Boolean(
    auction && auction.status === 'active' && Date.parse(auction.endsAt) > Date.now(),
  );
  const hasEnoughCoins = walletBalance >= minimumAmountDue;

  useEffect(() => {
    setBidAmount(auction ? auction.currentBid + Math.max(1, auction.minIncrement) : 0);
    setErrorMsg(null);
  }, [auction?.id, auction?.currentBid, auction?.minIncrement]);

  if (!isOpen || !auction) return null;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg(null);

    if (!isAuctionOpen) {
      setErrorMsg('انتهى هذا المزاد أو لم يعد متاحاً للمزايدة.');
      return;
    }
    if (!Number.isSafeInteger(bidAmount) || bidAmount < minBidAllowed) {
      setErrorMsg(`الحد الأدنى للسومة هو ${minBidAllowed.toLocaleString()} عملة.`);
      return;
    }
    const amountDue = isUserHighestBidder ? bidAmount - currentBid : bidAmount;
    if (amountDue <= 0 || amountDue > walletBalance) {
      setErrorMsg(`رصيدك غير كافٍ. تحتاج إلى ${Math.max(0, amountDue).toLocaleString()} عملة لهذه السومة.`);
      return;
    }

    onPlaceBid(auction.id, bidAmount);
    onClose();
  };

  const setSuggestedBid = (increase: number) => {
    setBidAmount(Math.min(maxBidAllowed, Math.max(minBidAllowed, currentBid + increase)));
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-stone-950/75 p-4 backdrop-blur-xs" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-bid-title"
        className="my-6 w-full max-w-xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between bg-stone-900 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <Gavel className="h-5 w-5 text-amber-400" />
            <div>
              <h2 id="place-bid-title" className="font-bold">المزايدة على القرية</h2>
              <p className="text-xs text-stone-300">{auction.account.title}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="إغلاق" className="rounded-lg p-2 text-stone-300 hover:bg-stone-800 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-5 p-6">
          <div className="flex items-center justify-between gap-4 rounded-xl bg-stone-50 p-4">
            <div>
              <p className="text-xs text-stone-500">أعلى سومة حالية</p>
              <p className="font-mono text-xl font-black">{currentBid.toLocaleString()} <span className="text-xs">عملة</span></p>
            </div>
            <div className="text-left">
              <p className="text-xs text-stone-500">رصيد البطاقة</p>
              <p className="flex items-center justify-end gap-1 font-mono font-bold"><CreditCard className="h-4 w-4 text-amber-600" />{walletBalance.toLocaleString()}</p>
            </div>
          </div>

          {!isAuctionOpen && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">انتهى المزاد أو لم يعد متاحاً للمزايدة.</div>
          )}

          {isUserHighestBidder && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              أنت صاحب أعلى سومة حالياً؛ يُحسب المبلغ المطلوب على أساس الزيادة الجديدة فقط.
            </p>
          )}

          {!hasEnoughCoins && isAuctionOpen && (
            <div className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
              <p className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> رصيدك لا يكفي للحد الأدنى للمزايدة.</p>
              <button
                type="button"
                onClick={() => { onClose(); onOpenRechargeGuide(); }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-bold text-white hover:bg-emerald-700"
              >
                عرض معلومات الشحن <ArrowRight className="h-4 w-4 rotate-180" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="bid-amount" className="mb-1.5 block text-sm font-bold">قيمة السومة الجديدة</label>
              <input
                id="bid-amount"
                type="number"
                inputMode="numeric"
                min={minBidAllowed}
                max={maxBidAllowed}
                step={1}
                value={bidAmount || ''}
                onChange={(event) => { setBidAmount(Number(event.target.value)); setErrorMsg(null); }}
                disabled={!isAuctionOpen || !hasEnoughCoins}
                className="w-full rounded-xl border-2 border-amber-300 px-4 py-3 font-mono text-lg font-bold focus:border-amber-500 focus:outline-none disabled:bg-stone-100"
              />
              <p className="mt-1 text-xs text-stone-500">الحد الأدنى {minBidAllowed.toLocaleString()} — الزيادة الدنيا {minIncrement.toLocaleString()} عملة</p>
            </div>

            {isAuctionOpen && hasEnoughCoins && (
              <div className="flex flex-wrap gap-2">
                {[250, 500, 1000].map((increase) => (
                  <button key={increase} type="button" onClick={() => setSuggestedBid(increase)} className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-bold hover:bg-amber-50">
                    +{increase.toLocaleString()}
                  </button>
                ))}
              </div>
            )}

            {errorMsg && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{errorMsg}</p>}

            <div className="flex items-start gap-2 rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs leading-relaxed text-stone-600">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <p><strong>تنبيه:</strong> هذا الموقع حالياً نموذج تجريبي يعتمد على تخزين المتصفح؛ المزايدات والأرصدة ليست معاملات مالية حقيقية أو محمية بخدمة خلفية.</p>
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={!isAuctionOpen || !hasEnoughCoins || bidAmount < minBidAllowed || bidAmount > maxBidAllowed} className="flex-1 rounded-xl bg-amber-400 px-4 py-3 font-black text-stone-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400">
                تأكيد المزايدة ({bidAmount.toLocaleString()} عملة)
              </button>
              <button type="button" onClick={onClose} className="rounded-xl bg-stone-100 px-4 py-3 text-sm font-bold text-stone-700 hover:bg-stone-200">إلغاء</button>
            </div>
          </form>

          <div className="border-t border-stone-200 pt-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold"><History className="h-4 w-4 text-stone-500" /> سجل المزايدات ({auction.bidHistory.length})</h3>
            {auction.bidHistory.length ? (
              <ul className="max-h-36 space-y-2 overflow-y-auto">
                {auction.bidHistory.map((bid, index) => (
                  <li key={bid.id} className="flex items-center justify-between gap-3 rounded-lg bg-stone-50 p-2 text-xs">
                    <span className="truncate">{bid.bidderName} <span className="text-stone-400">{bid.timestamp}</span></span>
                    <strong className={index === 0 ? 'shrink-0 text-amber-800' : 'shrink-0 text-stone-700'}>{bid.amount.toLocaleString()} عملة</strong>
                  </li>
                ))}
              </ul>
            ) : <p className="text-center text-xs text-stone-500">لا توجد مزايدات بعد.</p>}
          </div>
        </div>
      </section>
    </div>
  );
};
