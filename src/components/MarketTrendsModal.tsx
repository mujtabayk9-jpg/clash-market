import React from 'react';
import { X, TrendingUp, Sparkles } from 'lucide-react';
import { MarketTrendsView } from './MarketTrendsView';

interface MarketTrendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTownHallFilter?: (th: number) => void;
  onOpenCalculator?: () => void;
}

export const MarketTrendsModal: React.FC<MarketTrendsModalProps> = ({
  isOpen,
  onClose,
  onSelectTownHallFilter,
  onOpenCalculator,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/65 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#f8f6f2] border border-stone-200 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[94vh] flex flex-col text-right">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-700 shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">مؤشر ورسوم أسعار حسابات كلاش (Recharts)</h3>
              <span className="text-[11px] text-stone-500">تحليلات وتطور الأسعار خلال الشهر الماضي لمساعدتك في اتخاذ قرار الشراء</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto">
          <MarketTrendsView
            onSelectTownHallFilter={(th) => {
              onClose();
              if (onSelectTownHallFilter) onSelectTownHallFilter(th);
            }}
            onOpenCalculator={() => {
              onClose();
              if (onOpenCalculator) onOpenCalculator();
            }}
          />
        </div>
      </div>
    </div>
  );
};
