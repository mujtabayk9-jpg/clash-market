import React, { useState, useMemo } from 'react';
import { 
  Gavel, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Filter, 
  Search, 
  Coins, 
  Trophy, 
  ArrowLeft,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { AuctionListing, AccountListing } from '../types/clash';
import { AuctionCard } from './AuctionCard';

interface AuctionsViewProps {
  auctions: AuctionListing[];
  currentUserCardId: string;
  walletBalance: number;
  isAdminUnlocked?: boolean;
  onOpenBidModal: (auction: AuctionListing) => void;
  onInspectAccount: (account: AccountListing) => void;
  onInstantBuyout?: (auction: AuctionListing) => void;
  onOpenAdminAddVillage?: () => void;
  onOpenIdCardModal: () => void;
}

export const AuctionsView: React.FC<AuctionsViewProps> = ({
  auctions,
  currentUserCardId,
  walletBalance,
  isAdminUnlocked = false,
  onOpenBidModal,
  onInspectAccount,
  onInstantBuyout,
  onOpenAdminAddVillage,
  onOpenIdCardModal,
}) => {
  const [selectedTH, setSelectedTH] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'endingSoon' | 'highestBid' | 'mostBids'>('endingSoon');

  const filteredAuctions = useMemo(() => {
    return auctions.filter((auc) => {
      if (selectedTH !== null && auc.account.townHallLevel !== selectedTH) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = auc.account.title.toLowerCase().includes(q);
        const matchesTag = auc.account.playerTag.toLowerCase().includes(q);
        const matchesTH = `تاون ${auc.account.townHallLevel}`.includes(q);
        if (!matchesTitle && !matchesTag && !matchesTH) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'endingSoon') {
        return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
      }
      if (sortBy === 'highestBid') {
        return b.currentBid - a.currentBid;
      }
      if (sortBy === 'mostBids') {
        return b.totalBids - a.totalBids;
      }
      return 0;
    });
  }, [auctions, selectedTH, searchQuery, sortBy]);

  const totalActiveAuctions = auctions.filter((a) => a.status === 'active').length;
  const totalBidsAcrossAll = auctions.reduce((acc, a) => acc + a.totalBids, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Auctions Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-white p-6 sm:p-10 border border-amber-500/20 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>مزادات كلاش الحية والمباشرة</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3 leading-tight">
            المزاد العلني لحسابات وقرى كلاش أوف كلانس
          </h1>

          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6">
            تنافس بأمان على أقوى حسابات التاون هول والأبطال الماكس بالعملات. تضمن منصة وساطة سوق كلاش استرداد عملاتك تلقائياً فوراً إذا قام عضو آخر بوضع سومة أعلى، مع نقل بريد Supercell ID المباشر للفائز فور نهاية العداد.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-800">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-stone-400">المزادات الجارية:</div>
              <div className="text-base font-black text-amber-300 font-mono mt-0.5">
                {totalActiveAuctions} مزاد
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-stone-400">إجمالي المزايدات:</div>
              <div className="text-base font-black text-white font-mono mt-0.5">
                {totalBidsAcrossAll} سومة
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-stone-400">رصيدك الحالي:</div>
              <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
                {walletBalance.toLocaleString()} عملة
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[11px] text-stone-400">طريقة الشحن:</div>
              <button 
                onClick={onOpenIdCardModal}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 mt-1 cursor-pointer"
              >
                <span>المشرف المعتمد</span>
                <span>←</span>
              </button>
            </div>
          </div>

          {/* Admin shortcut if unlocked */}
          {isAdminUnlocked && onOpenAdminAddVillage && (
            <div className="mt-5 pt-4 border-t border-amber-500/30 flex items-center justify-between">
              <span className="text-xs text-amber-300 font-bold">
                ⚡ وضع المشرف نشط: يمكنك طرح قرية جديدة في المزاد الآن
              </span>
              <button
                onClick={onOpenAdminAddVillage}
                className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>طرح قرية في المزاد</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Controls Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        {/* Town Hall quick tags */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-600 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>التاون:</span>
          </span>
          <button
            onClick={() => setSelectedTH(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              selectedTH === null
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            الكل ({auctions.length})
          </button>
          {[17, 16, 15, 14].map((th) => (
            <button
              key={th}
              onClick={() => setSelectedTH(th)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedTH === th
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              تاون {th}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو التاغ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-xl pr-9 pl-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-amber-400 shadow-xs"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 outline-none cursor-pointer shadow-xs"
          >
            <option value="endingSoon">الأقرب للانتهاء</option>
            <option value="highestBid">الأعلى سوماً</option>
            <option value="mostBids">الأكثر تنافساً</option>
          </select>
        </div>
      </div>

      {/* Auctions Grid */}
      {filteredAuctions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              currentUserCardId={currentUserCardId}
              onOpenBidModal={onOpenBidModal}
              onInspectAccount={onInspectAccount}
              onInstantBuyout={onInstantBuyout}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-stone-300 rounded-2xl p-8 bg-white">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3">
            <Gavel className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900 mb-1">لا توجد مزادات مطابقة للبحث</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            جرب إعادة تعيين الفلتر لعرض جميع المزادات الحية في كلاش أوف كلانس.
          </p>
          <button
            onClick={() => {
              setSelectedTH(null);
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-xs text-white font-medium cursor-pointer transition-colors"
          >
            عرض جميع المزادات
          </button>
        </div>
      )}

      {/* How Auctions Work FAQ Guide */}
      <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          <span>كيف تعمل مزادات كلاش أوف كلانس؟</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
            <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-black">1</span>
              <span>المزايدة بعملات كلاش</span>
            </div>
            <p>
              يتم وضع السومات باستخدام رصيد عملاتك المشحون عن طريق المشرف المعتمد. عند المزايدة يتم حجز قيمة السومة مؤقتاً في نظام الوساطة.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
            <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-black">2</span>
              <span>استرداد فوري إذا تم تخطيك</span>
            </div>
            <p>
              إذا جاء أي عضو آخر ووضع سومة أعلى، تعود عملاتك تلقائياً وبشكل فوري 100% إلى بطاقتك لتتمكن من المزايدة مجدداً بحرية تامة.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
            <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-black">3</span>
              <span>تسليم القرية للفائز</span>
            </div>
            <p>
              بمجرد انتهاء العداد الزمني، يعتبر صاحب أعلى سومة هو الفائز وتتواصل معه إدارة المتجر لنقل بريد Supercell ID وتأمين الحساب فوراً.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
