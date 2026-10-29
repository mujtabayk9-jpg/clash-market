import React from 'react';
import { Search, ShieldCheck, CheckCircle2, Zap, ArrowLeft, Coins } from 'lucide-react';
import heroImg from '../assets/images/hero_clash_marketplace_1792906935926.jpg';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTHFilter: number | null;
  setSelectedTHFilter: (th: number | null) => void;
  onExploreClick: () => void;
  onOpenCalculator: () => void;
  onOpenWallet: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTHFilter,
  setSelectedTHFilter,
  onExploreClick,
  onOpenCalculator,
  onOpenWallet,
}) => {
  return (
    <div className="relative overflow-hidden border-b border-stone-200 bg-[#f4f0e8]">
      {/* Background Hero Image with Soft Off-White Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="قلعة كلاش أوف كلانس الأسطورية"
          className="w-full h-full object-cover object-center opacity-15 select-none pointer-events-none filter saturate-75"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f4f0e8] via-[#f4f0e8]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14 text-center">
        {/* Subtle kicker text */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-800 mb-4 tracking-wider">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>منظومة Al-Qimma Clash المعتمدة لوساطة وتداول حسابات كلاش أوف كلانس</span>
        </div>

        {/* Display Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight max-w-3xl mx-auto mb-5">
          متجر <span className="text-amber-800 font-serif">Al-Qimma Clash</span> الرسمي بضمان وساطة 100%
        </h1>

        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          تصفح قريتك القادمة من تاون 13 إلى 17 مع تسليم فوري لحساب Supercell ID، وادفع مباشرة بواسطة <span className="font-bold text-amber-800 underline decoration-amber-400">عملات التطبيق</span> المعتمدة وبطاقتك التعريفية الدائمة.
        </p>

        {/* Search Bar + Quick Shortcuts */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center bg-white border border-stone-300 rounded-xl p-2 shadow-sm focus-within:border-amber-600 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
            <Search className="w-5 h-5 text-stone-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="ابحث برقم التاون هول، كؤوس الأساطير، أو تاغ القرية #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onExploreClick();
                }
              }}
              className="w-full bg-transparent px-3 py-2 text-sm text-stone-900 placeholder-stone-400 outline-none text-right"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2.5 py-1 text-xs text-stone-400 hover:text-stone-800 cursor-pointer ml-1"
              >
                مسح
              </button>
            )}
            <button
              onClick={onExploreClick}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shrink-0 cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <span>بحث</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Town Hall Fast Selectors */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-stone-500 font-medium">الوصول السريع:</span>
            {[17, 16, 15, 14, 13].map((th) => (
              <button
                key={th}
                onClick={() => setSelectedTHFilter(selectedTHFilter === th ? null : th)}
                className={`px-3 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                  selectedTHFilter === th
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-300'
                }`}
              >
                تاون {th}
              </button>
            ))}
            <button
              onClick={onOpenCalculator}
              className="px-3 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-medium transition-colors cursor-pointer"
            >
              حاسبة التثمين
            </button>
            <button
              onClick={onOpenWallet}
              className="px-3 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>شحن كلاش كوين</span>
            </button>
          </div>
        </div>

        {/* Proof metrics row adjacent to claim */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-4 border-t border-stone-300/80 text-stone-600 text-xs sm:text-sm">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>+12,840 عملية تسليم ناجحة</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>حجز المبلغ بحساب وساطة آمن</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-amber-600 shrink-0" />
            <span>تسليم فوري مع بريد كامل</span>
          </div>
        </div>
      </div>
    </div>
  );
};
