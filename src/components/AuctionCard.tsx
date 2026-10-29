import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flame, 
  Coins, 
  ShieldCheck, 
  Trophy, 
  Gem, 
  Crown, 
  Gavel, 
  History, 
  ChevronLeft,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { AuctionListing, AccountListing } from '../types/clash';
import { SoldSealStamp } from './SoldSealStamp';

interface AuctionCardProps {
  auction: AuctionListing;
  currentUserCardId: string;
  onOpenBidModal: (auction: AuctionListing) => void;
  onInspectAccount: (account: AccountListing) => void;
  onInstantBuyout?: (auction: AuctionListing) => void;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({
  auction,
  currentUserCardId,
  onOpenBidModal,
  onInspectAccount,
  onInstantBuyout,
}) => {
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isEnded: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, isEnded: false });

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const end = new Date(auction.endsAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isEnded: true });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isEnded: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [auction.endsAt]);

  const isUserHighestBidder = 
    currentUserCardId && 
    auction.highestBidderCardId && 
    currentUserCardId.trim().toUpperCase() === auction.highestBidderCardId.trim().toUpperCase();

  const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 60 && !timeLeft.isEnded;

  const nextMinimumBid = auction.currentBid + auction.minIncrement;

  return (
    <div className={`relative bg-white rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden group shadow-xs hover:shadow-md ${
      isUserHighestBidder 
        ? 'border-emerald-400 ring-2 ring-emerald-500/20' 
        : isUrgent 
          ? 'border-rose-300 ring-2 ring-rose-500/10' 
          : 'border-stone-200 hover:border-amber-400/70'
    }`}>
      {/* Top Media Container */}
      <div className="relative aspect-[16/10] bg-stone-900 overflow-hidden cursor-pointer" onClick={() => onInspectAccount(auction.account)}>
        <img
          src={auction.account.image}
          alt={auction.account.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/30" />

        {/* SOLD / ENDED ROYAL SEAL STAMP: 𒀱 𒅒 𒈓 𒀰 */}
        {(timeLeft.isEnded || auction.status === 'ended') && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-2 pointer-events-none animate-in fade-in zoom-in-75 duration-300">
            <SoldSealStamp size="md" />
          </div>
        )}

        {/* Live Countdown Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-950/85 backdrop-blur-md border border-white/20 text-white shadow-lg">
          <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
          {timeLeft.isEnded ? (
            <span className="text-xs font-bold text-rose-400 font-sans">انتهى المزاد</span>
          ) : (
            <div className="flex items-center gap-1 font-mono text-xs font-black tracking-wider">
              <span>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span>:</span>
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span>:</span>
              <span className="text-amber-300">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          )}
        </div>

        {/* Town Hall & Live Status */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-black text-xs shadow-md border border-amber-400/30 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-white" />
            <span>تاون {auction.account.townHallLevel}</span>
          </span>
          <span className="px-2 py-1 rounded-lg bg-stone-900/80 backdrop-blur-md text-stone-200 text-[11px] font-mono border border-stone-700">
            {auction.account.playerTag}
          </span>
        </div>

        {/* User High Bidder Indicator */}
        {isUserHighestBidder && (
          <div className="absolute bottom-3 right-3 left-3 px-3 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-400 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg">
            <span className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-emerald-400" />
              <span>أنت صاحب أعلى سومة حالياً!</span>
            </span>
            <span className="text-[11px] font-mono bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-200">
              {auction.currentBid.toLocaleString()} عملة
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Key Stats */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 
              onClick={() => onInspectAccount(auction.account)}
              className="text-sm sm:text-base font-bold text-stone-900 hover:text-amber-800 transition-colors line-clamp-1 cursor-pointer"
            >
              {auction.account.title}
            </h3>
          </div>

          {/* Quick Village Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-stone-600">
            <span className="flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-md">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-mono font-bold text-stone-800">{auction.account.trophies.toLocaleString()}</span>
            </span>
            <span className="flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-md">
              <Gem className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono font-bold text-stone-800">{auction.account.gems.toLocaleString()}</span>
            </span>
            <span className="flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>أبطال ماكس</span>
            </span>
            <span className="bg-amber-50 text-amber-900 border border-amber-200/60 px-2 py-1 rounded-md text-[11px] font-medium mr-auto">
              {auction.totalBids} مزايدات
            </span>
          </div>

          {/* Current Highest Bid Highlight Section */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-50/70 to-stone-100 border border-amber-300/60 mb-4">
            <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
              <span className="font-medium flex items-center gap-1">
                <Gavel className="w-3.5 h-3.5 text-amber-700" />
                <span>أعلى سومة حالية:</span>
              </span>
              <span className="text-[11px] text-stone-500 font-mono">
                البدء من: {auction.startingBid.toLocaleString()} عملة
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono font-black text-2xl text-amber-900 tracking-tight">
                  {auction.currentBid.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-amber-800">عملة كلاش</span>
              </div>

              {auction.highestBidderName && (
                <div className="text-right">
                  <div className="text-[11px] text-stone-500">المزايد الأخير:</div>
                  <div className="text-xs font-bold text-stone-800 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{auction.highestBidderName}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Next Minimum Bid hint */}
            <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
              <span className="text-stone-600">الحد الأدنى للسومة التالية:</span>
              <span className="font-mono font-bold text-stone-900 bg-white/80 px-2 py-0.5 rounded border border-amber-200">
                {nextMinimumBid.toLocaleString()} عملة (+{auction.minIncrement.toLocaleString()})
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1 border-t border-stone-100">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenBidModal(auction)}
              disabled={timeLeft.isEnded}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                timeLeft.isEnded
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-950 hover:bg-stone-800 text-amber-300 hover:text-white border border-amber-400/30'
              }`}
            >
              <Gavel className="w-4 h-4 text-amber-400" />
              <span>زايد الآن</span>
            </button>

            <button
              onClick={() => onInspectAccount(auction.account)}
              className="w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <span>تفاصيل القرية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Optional Direct Buyout Option */}
          {auction.buyoutCoins && !timeLeft.isEnded && onInstantBuyout && (
            <button
              onClick={() => onInstantBuyout(auction)}
              className="w-full py-2 px-3 rounded-xl font-semibold text-xs bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-300/80 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>شراء فوري مباشر:</span>
              <span className="font-mono font-black">{auction.buyoutCoins.toLocaleString()}</span>
              <span>عملة (إنهاء المزاد فوراً)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
