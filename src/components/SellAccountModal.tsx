import React, { useState } from 'react';
import { X, Shield, Plus, CheckCircle2, Coins } from 'lucide-react';
import { AccountListing } from '../types/clash';
import { TH17_IMAGE, TH16_IMAGE, TH15_IMAGE } from '../data/mockAccounts';

interface SellAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: AccountListing) => void;
}

export const SellAccountModal: React.FC<SellAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [playerTag, setPlayerTag] = useState('#');
  const [townHallLevel, setTownHallLevel] = useState<number>(16);
  const [builderHallLevel, setBuilderHallLevel] = useState<number>(10);
  const [priceUSD, setPriceUSD] = useState<number>(95);
  const [trophies, setTrophies] = useState<number>(5100);
  const [gems, setGems] = useState<number>(4500);
  const [warStars, setWarStars] = useState<number>(1600);
  const [xpLevel, setXpLevel] = useState<number>(220);
  const [kingLevel, setKingLevel] = useState<number>(85);
  const [queenLevel, setQueenLevel] = useState<number>(85);
  const [wardenLevel, setWardenLevel] = useState<number>(60);
  const [rcLevel, setRcLevel] = useState<number>(35);
  const [minionPrinceLevel, setMinionPrinceLevel] = useState<number>(20);
  const [nameChangeStatus, setNameChangeStatus] = useState<'مجاني (Free)' | '500 جوهرة' | '1000 جوهرة' | 'غير متاح حالياً'>('مجاني (Free)');
  const [sellerName, setSellerName] = useState('');
  const [selectedVillageImage, setSelectedVillageImage] = useState<string>('/src/assets/images/village_th16_nature_1792906938192.jpg');
  const [customImageURL, setCustomImageURL] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newListing: AccountListing = {
      id: `coc-user-${Date.now()}`,
      title: title || `تاون هول ${townHallLevel} للبيع - أبطال (${kingLevel}/${queenLevel}/${wardenLevel})`,
      description: description || `قرية تاون هول ${townHallLevel} ممتازة للبيع عبر سوق كلاش مع تسليم فوري وتغيير اسم ${nameChangeStatus}.`,
      townHallLevel,
      builderHallLevel,
      playerTag: playerTag.startsWith('#') ? playerTag : `#${playerTag}`,
      xpLevel,
      priceUSD: Number(priceUSD) || 50,
      trophies: Number(trophies) || 4000,
      highestTrophies: (Number(trophies) || 4000) + 300,
      gems: Number(gems) || 1000,
      warStars: Number(warStars) || 800,
      clanCapitalHall: 9,
      nameChangeStatus,
      supercellIdStatus: 'بريد جيميل مخصص بالكامل',
      linkedPhone: false,
      image: customImageURL || selectedVillageImage,
      heroes: {
        barbarianKing: kingLevel,
        archerQueen: queenLevel,
        grandWarden: wardenLevel,
        royalChampion: rcLevel,
        minionPrince: minionPrinceLevel,
      },
      maxHeroes: kingLevel >= 90 && queenLevel >= 90,
      isFeatured: false,
      isVerifiedSeller: true,
      sellerName: sellerName || 'بائع معتمد',
      sellerRating: 5.0,
      sellerSalesCount: 1,
      equipmentHighlights: ['القفاز العملاق المطور', 'السهم الجليدي', 'درع البطلة'],
      skinsCount: 12,
      sceneriesCount: 3,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'available',
    };

    onAddAccount(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#faf8f5] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-stone-900">إضافة حساب كلاش أوف كلانس للبيع</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-right">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
            <Shield className="w-4 h-4 shrink-0 text-amber-600" />
            <span>سيتم عرض حسابك فوراً للمشترين ويمكن شراؤه مباشرة بعملات التطبيق المعتمدة.</span>
          </div>

          {/* Basic Info */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">عنوان الإعلان:</label>
              <input
                type="text"
                required
                placeholder="مثال: تاون هول 16 شبه ماكس - 4 أبطال ليفل عالي مع 6 عمال"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-amber-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-stone-600 mb-1">التاون هول (TH):</label>
                <select
                  value={townHallLevel}
                  onChange={(e) => setTownHallLevel(Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-mono"
                >
                  <option value={17}>تاون 17</option>
                  <option value={16}>تاون 16</option>
                  <option value={15}>تاون 15</option>
                  <option value={14}>تاون 14</option>
                  <option value={13}>تاون 13</option>
                  <option value={12}>تاون 12</option>
                  <option value={11}>تاون 11</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 mb-1">القرية الليلية (BH):</label>
                <select
                  value={builderHallLevel}
                  onChange={(e) => setBuilderHallLevel(Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-mono"
                >
                  <option value={10}>مستوى 10</option>
                  <option value={9}>مستوى 9</option>
                  <option value={8}>مستوى 8</option>
                  <option value={7}>مستوى 7</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 mb-1">تاغ اللاعب (#):</label>
                <input
                  type="text"
                  required
                  placeholder="#8YPQ..."
                  value={playerTag}
                  onChange={(e) => setPlayerTag(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">السعر المطلوب (بالعملات):</label>
                <input
                  type="number"
                  required
                  min={500}
                  step={100}
                  value={priceUSD * 100}
                  onChange={(e) => setPriceUSD(Math.round(Number(e.target.value) / 100))}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-amber-700 font-mono font-bold"
                />
                <span className="text-[10px] text-stone-500 font-mono block mt-0.5">
                  {(priceUSD * 100).toLocaleString()} عملة
                </span>
              </div>
            </div>
          </div>

          {/* Heroes Levels */}
          <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-stone-800">مستويات الأبطال في قريتك:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
              <div>
                <label className="block text-stone-500 mb-1">الملك (King):</label>
                <input
                  type="number"
                  min={0}
                  max={95}
                  value={kingLevel}
                  onChange={(e) => setKingLevel(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-center text-amber-800 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-stone-500 mb-1">الملكة (Queen):</label>
                <input
                  type="number"
                  min={0}
                  max={95}
                  value={queenLevel}
                  onChange={(e) => setQueenLevel(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-center text-amber-800 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-stone-500 mb-1">الآمر (Warden):</label>
                <input
                  type="number"
                  min={0}
                  max={70}
                  value={wardenLevel}
                  onChange={(e) => setWardenLevel(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-center text-cyan-800 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-stone-500 mb-1">البطلة (Champion):</label>
                <input
                  type="number"
                  min={0}
                  max={45}
                  value={rcLevel}
                  onChange={(e) => setRcLevel(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-center text-purple-800 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-stone-500 mb-1">المينيون (Prince):</label>
                <input
                  type="number"
                  min={0}
                  max={35}
                  value={minionPrinceLevel}
                  onChange={(e) => setMinionPrinceLevel(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-center text-emerald-800 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-stone-600 mb-1">الكؤوس:</label>
              <input
                type="number"
                value={trophies}
                onChange={(e) => setTrophies(Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1">الجواهر:</label>
              <input
                type="number"
                value={gems}
                onChange={(e) => setGems(Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-emerald-700 font-mono"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1">نجوم الحرب:</label>
              <input
                type="number"
                value={warStars}
                onChange={(e) => setWarStars(Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1">تغيير الاسم:</label>
              <select
                value={nameChangeStatus}
                onChange={(e) => setNameChangeStatus(e.target.value as any)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
              >
                <option value="مجاني (Free)">مجاني (Free)</option>
                <option value="500 جوهرة">500 جوهرة</option>
                <option value="1000 جوهرة">1000 جوهرة</option>
                <option value="غير متاح حالياً">غير متاح حالياً</option>
              </select>
            </div>
          </div>

          {/* Village Image Picker */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">اختر صورة مظهر القرية:</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { url: TH17_IMAGE, label: 'تاون 17 كهربائي ذهبي' },
                { url: TH16_IMAGE, label: 'تاون 16 الغابة الخضراء' },
                { url: TH15_IMAGE, label: 'تاون 15 المونوليث البنفسجي' },
              ].map((img) => (
                <div
                  key={img.url}
                  onClick={() => setSelectedVillageImage(img.url)}
                  className={`cursor-pointer rounded-xl overflow-hidden border p-1 transition-all ${
                    selectedVillageImage === img.url
                      ? 'border-amber-500 ring-2 ring-amber-400/30 bg-amber-50'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-20 object-cover rounded-lg" />
                  <span className="block text-[11px] text-center text-stone-700 mt-1 truncate">{img.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Seller Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">اسمك المستعار كبائع:</label>
              <input
                type="text"
                required
                placeholder="مثال: كلاش_الزعيم"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-amber-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">وصف إضافي وملاحظات:</label>
              <input
                type="text"
                placeholder="سكنات الأبطال، معدات إضافية، بريد نظيف..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:border-amber-600 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-bold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>نشر الحساب في المتجر الآن</span>
          </button>
        </form>
      </div>
    </div>
  );
};
