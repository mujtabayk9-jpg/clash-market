import React, { useState } from 'react';
import { X, Calculator, Sparkles, TrendingUp, ArrowLeft, Coins, MessageCircle, PlusCircle } from 'lucide-react';

interface ValuationCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminWhatsApp?: string;
  isAdminUnlocked?: boolean;
  onApplyValuationToSell: (coins: number, th: number) => void;
}

export const ValuationCalculatorModal: React.FC<ValuationCalculatorModalProps> = ({
  isOpen,
  onClose,
  adminWhatsApp = '9647708924110',
  isAdminUnlocked = false,
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
  const avgEstimateCoins = Math.round(((estimatedMinUSD + estimatedMaxUSD) / 2) * 100);

  const minCoins = estimatedMinUSD * 100;
  const maxCoins = estimatedMaxUSD * 100;

  const cleanPhone = adminWhatsApp.replace(/[^0-9]/g, '');
  const sellVillageWhatsappText = `السلام عليكم ورحمة الله،
أرغب بعرض قريتي كلاش أوف كلانس للبيع في متجر Al-Qimma Clash بعد فحصها وتثمينها:

🏰 مواصفات القرية:
- تاون هول: TH ${townHall}
- حالة الأبطال: ${isHeroesMax ? 'ماكس بالكامل' : 'عادي'}
- المعدات الملحمية: ${hasEpicEquipment ? 'متوفرة ومطورة' : 'عادية'}
- عدد المناظر (Sceneries): ${sceneriesCount}
- عدد السكنات (Skins): ${skinsCount}
- عدد الجواهر: ${gemsCount.toLocaleString()} جوهرة
- تغيير الاسم: ${freeNameChange ? 'مجاني' : 'مدفوع'}

💰 القيمة التقديرية المقترحة: ${minCoins.toLocaleString()} - ${maxCoins.toLocaleString()} عملة (متوسط: ${avgEstimateCoins.toLocaleString()} عملة)

يرجى إرشادي لخطوات الفحص والتسليم ونشرها في المتجر. شكراً لك!`;

  const sellWhatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(sellVillageWhatsappText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#faf8f5] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-700">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">حاسبة تثمين قيمة حساب كلاش (بالعملات)</h3>
              <span className="text-[11px] text-stone-500">تقييم دقيق لقيمة القرية بناءً على أسعار السوق وسيرفرات كلاش</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Town Hall Selector */}
          <div>
            <label className="block text-stone-700 font-bold mb-2">مستوى قاعة المدينة (Town Hall):</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {[17, 16, 15, 14, 13, 12, 11].map((th) => (
                <button
                  key={th}
                  type="button"
                  onClick={() => setTownHall(th)}
                  className={`py-2 px-1 rounded-xl border text-center font-mono font-bold transition-all cursor-pointer ${
                    townHall === th
                      ? 'bg-amber-600 text-white border-amber-700 shadow-xs scale-102'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-amber-300'
                  }`}
                >
                  TH {th}
                </button>
              ))}
            </div>
          </div>

          {/* Key Checkbox Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <label className="flex items-center gap-2 p-3 bg-white border border-stone-200 rounded-xl cursor-pointer hover:border-amber-300 transition-colors">
              <input
                type="checkbox"
                checked={isHeroesMax}
                onChange={(e) => setIsHeroesMax(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
              />
              <span className="font-semibold text-stone-800">أبطال ماكس للتاون المحدد</span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-white border border-stone-200 rounded-xl cursor-pointer hover:border-amber-300 transition-colors">
              <input
                type="checkbox"
                checked={hasEpicEquipment}
                onChange={(e) => setHasEpicEquipment(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
              />
              <span className="font-semibold text-stone-800">معدات ملحمية ماكس (Giant Gauntlet..)</span>
            </label>

            <label className="flex items-center gap-2 p-3 bg-white border border-stone-200 rounded-xl cursor-pointer hover:border-amber-300 transition-colors">
              <input
                type="checkbox"
                checked={freeNameChange}
                onChange={(e) => setFreeNameChange(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
              />
              <span className="font-semibold text-stone-800">تغيير الاسم مجاني (Free)</span>
            </label>
          </div>

          {/* Counts & Numbers */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-white border border-stone-200 rounded-xl text-center">
              <label className="block text-stone-500 mb-1">المناظر (Sceneries):</label>
              <input
                type="number"
                min={0}
                max={20}
                value={sceneriesCount}
                onChange={(e) => setSceneriesCount(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-center font-bold font-mono text-stone-900"
              />
            </div>

            <div className="p-3 bg-white border border-stone-200 rounded-xl text-center">
              <label className="block text-stone-500 mb-1">السكنات (Skins):</label>
              <input
                type="number"
                min={0}
                max={60}
                value={skinsCount}
                onChange={(e) => setSkinsCount(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-center font-bold font-mono text-stone-900"
              />
            </div>

            <div className="p-3 bg-white border border-stone-200 rounded-xl text-center">
              <label className="block text-stone-500 mb-1">الجواهر المتوفرة:</label>
              <input
                type="number"
                min={0}
                step={500}
                value={gemsCount}
                onChange={(e) => setGemsCount(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-1.5 text-center text-emerald-700 font-bold font-mono"
              />
            </div>
          </div>

          {/* Valuation Result Card */}
          <div className="p-5 bg-gradient-to-br from-amber-50 to-white border-2 border-amber-300 rounded-2xl space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>القيمة التقديرية العادلة للقرية في المتجر:</span>
              </span>
              <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                عملات Al-Qimma Clash
              </span>
            </div>

            <div className="flex items-baseline justify-center gap-2 py-2">
              <Coins className="w-7 h-7 text-amber-600 self-center" />
              <span className="text-3xl sm:text-4xl font-black text-amber-950 font-mono tabular-nums">
                {minCoins.toLocaleString()} - {maxCoins.toLocaleString()}
              </span>
              <span className="text-base font-bold text-stone-700">عملة</span>
            </div>

            {/* Breakdown lines */}
            <div className="pt-2.5 border-t border-amber-200/70 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>القيمة الأساسية لقاعة TH {townHall}:</span>
                <span className="font-mono font-bold text-stone-900">{(basePrice * 100).toLocaleString()} عملة</span>
              </div>
              {isHeroesMax && (
                <div className="flex justify-between text-amber-800 font-medium">
                  <span>مكافأة الأبطال الماكس:</span>
                  <span className="font-mono font-bold">+{(heroesBonus * 100).toLocaleString()} عملة</span>
                </div>
              )}
              {hasEpicEquipment && (
                <div className="flex justify-between text-cyan-800 font-medium">
                  <span>المعدات الملحمية المطورة:</span>
                  <span className="font-mono font-bold">+{(equipmentBonus * 100).toLocaleString()} عملة</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>المظاهر والمناظر والجواهر:</span>
                <span className="font-mono font-bold text-stone-900">+{((cosmeticsBonus + gemsBonus + nameBonus) * 100).toLocaleString()} عملة</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-1">
            <a
              href={sellWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm text-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>طلب عرض قريتي للبيع عبر المشرف بالواتساب ({avgEstimateCoins.toLocaleString()} عملة)</span>
            </a>

            {isAdminUnlocked && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onApplyValuationToSell(avgEstimateCoins, townHall);
                }}
                className="w-full py-3 px-4 rounded-xl font-black text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs text-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إضافة القرية مباشرة كـ مشرف للمتجر بسعر ({avgEstimateCoins.toLocaleString()} عملة)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
