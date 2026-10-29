import React, { useState } from 'react';
import { X, Calculator, Sparkles, TrendingUp, ArrowLeft, Coins } from 'lucide-react';

interface ValuationCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyValuationToSell: (priceUSD: number, th: number) => void;
}

export const ValuationCalculatorModal: React.FC<ValuationCalculatorModalProps> = ({
  isOpen,
  onClose,
  onApplyValuationToSell,
}) => {
  const [townHall, setTownHall] = useState<number>(16);
  const [isHeroesMax, setIsHeroesMax] = useState<boolean>(true);
  const [sceneriesCount, setSceneriesCount] = useState<number>(3);
  const [skinsCount, setSkinsCount] = useState<number>(15);
  const [gemsCount, setGemsCount] = useState<number>(4000);
  const [freeNameChange, setFreeNameChange] = useState<boolean>(true);
  const [hasEpicEquipment, setHasEpicEquipment] = useState<boolean>(true);

  if (!isOpen) return null;

  const basePriceByTH: Record<number, number> = {
    17: 120,
    16: 80,
    15: 55,
    14: 35,
    13: 25,
    12: 15,
    11: 10,
  };

  const basePrice = basePriceByTH[townHall] || 50;
  const heroesBonus = isHeroesMax ? Math.round(basePrice * 0.35) : 0;
  const cosmeticsBonus = Math.min(45, sceneriesCount * 5 + Math.floor(skinsCount * 1.2));
  const gemsBonus = Math.min(30, Math.floor(gemsCount / 600));
  const nameBonus = freeNameChange ? 5 : 0;
  const equipmentBonus = hasEpicEquipment ? 18 : 0;

  const estimatedMinUSD = Math.round(basePrice + heroesBonus * 0.8 + cosmeticsBonus * 0.7 + gemsBonus * 0.6 + equipmentBonus);
  const estimatedMaxUSD = Math.round(estimatedMinUSD * 1.25);
  const avgEstimateUSD = Math.round((estimatedMinUSD + estimatedMaxUSD) / 2);

  const minCoins = estimatedMinUSD * 100;
  const maxCoins = estimatedMaxUSD * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#faf8f5] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-stone-900">حاسبة تثمين قيمة حساب كلاش (بالعملات)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-right">
          <p className="text-xs text-stone-600 leading-relaxed">
            تعتمد هذه الحاسبة على متوسط أسعار التداول الحقيقية في سوق الحسابات لتحديد القيمة العادلة بالعملات وفقاً لمستوى التاون، الأبطال، المظاهر، والمعدات.
          </p>

          {/* Input Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">مستوى قاعة المدينة (Town Hall):</label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-xs">
                {[17, 16, 15, 14, 13, 12, 11].map((th) => (
                  <button
                    key={th}
                    type="button"
                    onClick={() => setTownHall(th)}
                    className={`py-2 rounded-lg font-bold border transition-colors cursor-pointer ${
                      townHall === th
                        ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-xs'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    TH {th}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 p-3 bg-white border border-stone-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHeroesMax}
                  onChange={(e) => setIsHeroesMax(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold text-stone-800">الأبطال ماكس بالكامل للتاون</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-white border border-stone-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasEpicEquipment}
                  onChange={(e) => setHasEpicEquipment(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold text-stone-800">معدات ملحمية مطورة (ليفل 21+)</span>
              </label>

              <label className="flex items-center gap-2 p-3 bg-white border border-stone-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={freeNameChange}
                  onChange={(e) => setFreeNameChange(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold text-stone-800">تغيير الاسم مجاني متوفر</span>
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div>
                <label className="block text-stone-600 mb-1">المظاهر (Skins):</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={skinsCount}
                  onChange={(e) => setSkinsCount(Number(e.target.value))}
                  className="w-full bg-white border border-stone-200 rounded-lg p-2 text-center text-stone-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">المناظر (Sceneries):</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={sceneriesCount}
                  onChange={(e) => setSceneriesCount(Number(e.target.value))}
                  className="w-full bg-white border border-stone-200 rounded-lg p-2 text-center text-stone-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">الجواهر المتوفرة:</label>
                <input
                  type="number"
                  min={0}
                  step={500}
                  value={gemsCount}
                  onChange={(e) => setGemsCount(Number(e.target.value))}
                  className="w-full bg-white border border-stone-200 rounded-lg p-2 text-center text-emerald-700 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Valuation Result Card */}
          <div className="p-5 bg-white border border-amber-300 rounded-2xl space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>القيمة التقديرية العادلة في السوق:</span>
              </span>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">عملات التطبيق</span>
            </div>

            <div className="flex items-baseline justify-center gap-2 py-1">
              <Coins className="w-6 h-6 text-amber-600 self-center" />
              <span className="text-3xl sm:text-4xl font-black text-amber-950 font-mono tabular-nums">
                {minCoins.toLocaleString()} - {maxCoins.toLocaleString()}
              </span>
              <span className="text-base font-bold text-stone-700">عملة</span>
            </div>

            {/* Breakdown lines */}
            <div className="pt-2.5 border-t border-stone-100 space-y-1.5 text-xs text-stone-500">
              <div className="flex justify-between">
                <span>القيمة الأساسية لقاعة TH {townHall}:</span>
                <span className="font-mono text-stone-800">{(basePrice * 100).toLocaleString()} عملة</span>
              </div>
              {isHeroesMax && (
                <div className="flex justify-between text-amber-800 font-medium">
                  <span>مكافأة الأبطال الماكس:</span>
                  <span className="font-mono">+{(heroesBonus * 100).toLocaleString()} عملة</span>
                </div>
              )}
              {hasEpicEquipment && (
                <div className="flex justify-between text-cyan-800 font-medium">
                  <span>المعدات الملحمية المطورة:</span>
                  <span className="font-mono">+{(equipmentBonus * 100).toLocaleString()} عملة</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>المظاهر والمناظر والجواهر:</span>
                <span className="font-mono text-stone-800">+{((cosmeticsBonus + gemsBonus + nameBonus) * 100).toLocaleString()} عملة</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl font-bold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>تصفح قرى معروضة للشراء بنفس المستوى والقيمة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
