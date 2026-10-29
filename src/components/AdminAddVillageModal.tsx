import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Image as ImageIcon, 
  Coins, 
  Star,
  Swords,
  Crown
} from 'lucide-react';
import { AccountListing, HeroStats, AuctionListing } from '../types/clash';
import { TH17_IMAGE, TH16_IMAGE, TH15_IMAGE, HERO_IMAGE } from '../data/mockAccounts';
import { Gavel } from 'lucide-react';

interface AdminAddVillageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: AccountListing) => void;
  onAddAuction?: (auction: AuctionListing) => void;
}

// Preset max hero levels per town hall
const TH_HERO_PRESETS: Record<number, HeroStats> = {
  17: { barbarianKing: 95, archerQueen: 95, grandWarden: 70, royalChampion: 45, minionPrince: 35 },
  16: { barbarianKing: 90, archerQueen: 90, grandWarden: 65, royalChampion: 40, minionPrince: 20 },
  15: { barbarianKing: 85, archerQueen: 85, grandWarden: 60, royalChampion: 35 },
  14: { barbarianKing: 80, archerQueen: 80, grandWarden: 55, royalChampion: 30 },
  13: { barbarianKing: 75, archerQueen: 75, grandWarden: 50, royalChampion: 25 },
  12: { barbarianKing: 65, archerQueen: 65, grandWarden: 40, royalChampion: 0 },
  11: { barbarianKing: 50, archerQueen: 50, grandWarden: 20, royalChampion: 0 },
};

export const AdminAddVillageModal: React.FC<AdminAddVillageModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
  onAddAuction,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Listing Type: Direct Sale vs Live Public Auction
  const [listingType, setListingType] = useState<'direct' | 'auction'>('direct');

  // Auction specific parameters
  const [startingBid, setStartingBid] = useState<number>(6000);
  const [minIncrement, setMinIncrement] = useState<number>(250);
  const [durationHours, setDurationHours] = useState<number>(24);
  const [buyoutCoins, setBuyoutCoins] = useState<number>(10000);

  // Form State
  const [townHallLevel, setTownHallLevel] = useState<number>(16);
  const [title, setTitle] = useState('تاون هول 16 ماكس بالكامل - أبطال ومعدات أسطورية');
  const [priceInCoins, setPriceInCoins] = useState<number>(9500);
  const [playerTag, setPlayerTag] = useState('#2PY98LQ');
  const [description, setDescription] = useState('قرية كلاش أوف كلانس ممتازة جاهزة للتسليم الفوري مع بريد جيميل مخصص وحماية وساطة كاملة.');
  
  // Hero stats
  const [heroes, setHeroes] = useState<HeroStats>(TH_HERO_PRESETS[16]);
  const [isMaxHeroes, setIsMaxHeroes] = useState(true);

  // Images List: Array of data URLs or image paths
  const [images, setImages] = useState<string[]>([TH16_IMAGE]);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Additional details
  const [gems, setGems] = useState<number>(4500);
  const [trophies, setTrophies] = useState<number>(5200);
  const [nameChangeStatus, setNameChangeStatus] = useState<'مجاني (Free)' | '500 جوهرة' | '1000 جوهرة' | 'غير متاح حالياً'>('مجاني (Free)');
  const [sellerName, setSellerName] = useState('إدارة سوق كلاش المعتمد');

  if (!isOpen) return null;

  // When Town Hall changes, update defaults
  const handleTHChange = (th: number) => {
    setTownHallLevel(th);
    const presetHeroes = TH_HERO_PRESETS[th] || TH_HERO_PRESETS[16];
    setHeroes(presetHeroes);
    setTitle(`تاون هول ${th} ماكس بالكامل - أبطال ومعدات أسطورية`);

    // Assign appropriate default theme image if current image is one of presets
    if (th === 17) setImages((prev) => [TH17_IMAGE, ...prev.filter((i) => i !== TH17_IMAGE && i !== TH16_IMAGE && i !== TH15_IMAGE)]);
    else if (th === 16) setImages((prev) => [TH16_IMAGE, ...prev.filter((i) => i !== TH17_IMAGE && i !== TH16_IMAGE && i !== TH15_IMAGE)]);
    else setImages((prev) => [TH15_IMAGE, ...prev.filter((i) => i !== TH17_IMAGE && i !== TH16_IMAGE && i !== TH15_IMAGE)]);
  };

  // Max heroes in one click
  const handleSetMaxHeroes = () => {
    const preset = TH_HERO_PRESETS[townHallLevel] || TH_HERO_PRESETS[16];
    setHeroes(preset);
    setIsMaxHeroes(true);
  };

  // Handle multi-image file selection from device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImagePromises: Promise<string>[] = [];

    Array.from(files).forEach((file) => {
      const promise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            resolve(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
      newImagePromises.push(promise);
    });

    Promise.all(newImagePromises).then((results) => {
      setImages((prev) => [...results, ...prev]);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    });
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [imageUrlInput.trim(), ...prev]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      alert('يجب أن تحتوي القرية على صورة واحدة على الأقل');
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const mainImage = images[0] || TH16_IMAGE;
    const secondaryImages = images.slice(1);

    const newVillage: AccountListing = {
      id: `coc-admin-${Date.now()}`,
      title: title.trim() || `قرية تاون هول ${townHallLevel} ممتازة`,
      description: description.trim() || `قرية تاون ${townHallLevel} معروضة للبيع المباشر بالعملات مع تسليم بريد Supercell ID فوري وضمان وساطة 100%.`,
      townHallLevel,
      builderHallLevel: 10,
      playerTag: playerTag.startsWith('#') ? playerTag.trim() : `#${playerTag.trim()}`,
      xpLevel: 210 + townHallLevel * 2,
      priceUSD: Math.round(priceInCoins / 100), // Internal parity: 100 coins = 1 USD
      trophies,
      highestTrophies: trophies + 350,
      gems,
      warStars: 1450,
      clanCapitalHall: 10,
      nameChangeStatus,
      supercellIdStatus: 'بريد جيميل مخصص بالكامل',
      linkedPhone: false,
      image: mainImage,
      secondaryImages: secondaryImages.length > 0 ? secondaryImages : undefined,
      heroes,
      maxHeroes: isMaxHeroes,
      isFeatured: true,
      isVerifiedSeller: true,
      sellerName: sellerName.trim() || 'إدارة المتجر الرسمية',
      sellerRating: 5.0,
      sellerSalesCount: 88,
      equipmentHighlights: ['القفاز العملاق المطور ليفل ماكس', 'السهم الجليدي', 'درع البطلة', 'كرة اللهب الملحمية'],
      skinsCount: 18,
      sceneriesCount: 4,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'available',
    };

    if (listingType === 'auction') {
      const newAuction: AuctionListing = {
        id: `auc-${Date.now()}`,
        account: newVillage,
        startingBid,
        currentBid: startingBid,
        minIncrement,
        endsAt: new Date(Date.now() + durationHours * 3600 * 1000).toISOString(),
        totalBids: 0,
        bidHistory: [],
        status: 'active',
        buyoutCoins: buyoutCoins > 0 ? buyoutCoins : undefined,
      };
      if (onAddAuction) {
        onAddAuction(newAuction);
      }
    } else {
      onAddAccount(newVillage);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#faf8f5] border border-amber-400/80 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col text-stone-900 animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-amber-500/30 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>إضافة قرية كلاش أوف كلانس للبيع</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black">
                  خاص بالمشرف
                </span>
              </h3>
              <p className="text-[11px] text-amber-200/80">
                إضافة الحساب مباشرة للمتجر بالصور وعملات الشراء لتمكين العملاء من تصفحه وشرائه
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-right">
          
          {/* Step 0: Choose Listing Type */}
          <div className="p-3.5 bg-stone-100 rounded-2xl border border-stone-200">
            <label className="block text-xs font-bold text-stone-800 mb-2">
              طريقة نشر القرية في المتجر:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setListingType('direct')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  listingType === 'direct'
                    ? 'bg-white border-amber-500 text-stone-900 shadow-xs ring-2 ring-amber-500/20'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-200/50'
                }`}
              >
                <Coins className="w-4 h-4 text-amber-600" />
                <span>شراء فوري مباشر</span>
              </button>

              <button
                type="button"
                onClick={() => setListingType('auction')}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  listingType === 'auction'
                    ? 'bg-stone-950 border-amber-400 text-amber-300 shadow-xs ring-2 ring-amber-500/20'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-200/50'
                }`}
              >
                <Gavel className="w-4 h-4 text-amber-400" />
                <span>طرح في المزاد العلني</span>
              </button>
            </div>
          </div>

          {/* Step 1: Select Town Hall */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              1. اختر مستوى التاون هول (Town Hall):
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {[17, 16, 15, 14, 13, 12, 11].map((th) => (
                <button
                  key={th}
                  type="button"
                  onClick={() => handleTHChange(th)}
                  className={`py-2 px-1 text-center rounded-xl border transition-all cursor-pointer font-bold ${
                    townHallLevel === th
                      ? 'border-amber-500 bg-amber-500 text-stone-950 shadow-xs scale-102'
                      : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="text-[10px] opacity-75">تاون</div>
                  <div className="text-base font-black font-mono">{th}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Village Images & Multi-Photo Upload */}
          <div className="p-4 bg-white border border-stone-200 rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-stone-800 block">
                  2. صور القرية المعروضة ({images.length} صورة مضافة):
                </label>
                <span className="text-[11px] text-stone-500">
                  يمكنك رفع صور من هاتفك/جهازك أو اختيار من الصور الجاهزة
                </span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'جاري التحميل...' : '📸 ارفع صور من جهازك'}</span>
              </button>
            </div>

            {/* Uploaded Images Gallery Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
              {images.map((imgUrl, idx) => (
                <div 
                  key={idx}
                  className={`relative group rounded-xl overflow-hidden border-2 aspect-[4/3] bg-stone-100 shadow-xs ${
                    idx === 0 ? 'border-amber-500 ring-2 ring-amber-400/40' : 'border-stone-200'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`قرية صورة ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay Badges & Actions */}
                  <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 p-1">
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        className="px-2 py-1 rounded bg-amber-400 text-stone-950 text-[10px] font-bold shadow-xs cursor-pointer hover:bg-amber-300"
                        title="جعلها الصورة الرئيسية للغلاف"
                      >
                        غلاف
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1 rounded bg-rose-600 text-white text-[10px] shadow-xs cursor-pointer hover:bg-rose-700"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {idx === 0 && (
                    <span className="absolute top-1 right-1 bg-amber-500 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                      الغلاف الرئيسي
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Quick built-in presets if needed */}
            <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500 flex-wrap">
              <span className="text-[11px] font-medium text-stone-600 shrink-0">إضافة صورة مظهر كلاش جاهزة:</span>
              <button
                type="button"
                onClick={() => setImages((prev) => [...prev, TH17_IMAGE])}
                className="px-2 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] cursor-pointer"
              >
                + تاون 17
              </button>
              <button
                type="button"
                onClick={() => setImages((prev) => [...prev, TH16_IMAGE])}
                className="px-2 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] cursor-pointer"
              >
                + تاون 16
              </button>
              <button
                type="button"
                onClick={() => setImages((prev) => [...prev, TH15_IMAGE])}
                className="px-2 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] cursor-pointer"
              >
                + تاون 15
              </button>
            </div>
          </div>

          {/* Step 3: Title and Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                عنوان القرية المعروضة:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: تاون 16 ماكس كامل مع 6 عمال"
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-amber-500"
              />
            </div>

            {/* Direct Sale Pricing vs Auction Pricing */}
            {listingType === 'direct' ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-800">
                    سعر القرية بالعملات:
                  </label>
                  <span className="text-xs font-mono font-bold text-amber-800">
                    {priceInCoins.toLocaleString()} عملة
                  </span>
                </div>
                <div className="relative">
                  <Coins className="w-4 h-4 text-amber-600 absolute right-3 top-2.5" />
                  <input
                    type="number"
                    required
                    min={100}
                    step={100}
                    value={priceInCoins}
                    onChange={(e) => setPriceInCoins(Math.max(100, Number(e.target.value)))}
                    className="w-full bg-white border border-stone-300 rounded-xl pr-9 pl-3 py-2 text-xs font-mono font-bold text-stone-900 outline-none focus:border-amber-500"
                  />
                </div>
                {/* Quick price adjusters */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  {[3000, 5000, 8000, 12000, 18000].map((presetPrice) => (
                    <button
                      key={presetPrice}
                      type="button"
                      onClick={() => setPriceInCoins(presetPrice)}
                      className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-mono cursor-pointer"
                    >
                      {presetPrice.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Auction Pricing Block */
              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-300/80 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 pb-1 border-b border-amber-200">
                  <Gavel className="w-4 h-4 text-amber-600" />
                  <span>إعدادات المزاد العلني:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-800 mb-1">
                      السعر الافتتاحي للمزاد (بالعملات):
                    </label>
                    <input
                      type="number"
                      required
                      min={500}
                      step={250}
                      value={startingBid}
                      onChange={(e) => setStartingBid(Math.max(500, Number(e.target.value)))}
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-amber-900 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-800 mb-1">
                      الحد الأدنى للزيادة بكل سومة:
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      step={50}
                      value={minIncrement}
                      onChange={(e) => setMinIncrement(Math.max(100, Number(e.target.value)))}
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-stone-800 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-800 mb-1">
                      مدة المزاد:
                    </label>
                    <select
                      value={durationHours}
                      onChange={(e) => setDurationHours(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-800 outline-none cursor-pointer"
                    >
                      <option value={6}>6 ساعات</option>
                      <option value={12}>12 ساعة</option>
                      <option value={24}>24 ساعة (يوم كامل)</option>
                      <option value={48}>48 ساعة (يومان)</option>
                      <option value={72}>3 أيام</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-800 mb-1">
                      سعر الشراء الفوري الاختياري (Buyout):
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={buyoutCoins}
                      onChange={(e) => setBuyoutCoins(Number(e.target.value))}
                      placeholder="اختياري - لإنهاء المزاد فوراً"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-stone-800 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 4: Heroes Quick Setup */}
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                <Swords className="w-3.5 h-3.5 text-amber-600" />
                مستويات الأبطال:
              </span>
              <button
                type="button"
                onClick={handleSetMaxHeroes}
                className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold cursor-pointer transition-colors"
              >
                ⚡ ماكس لتاون {townHallLevel} بضغطة واحدة
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-stone-200">
                <span className="text-[10px] text-stone-500 block">الملك البربري</span>
                <input
                  type="number"
                  min={0}
                  max={95}
                  value={heroes.barbarianKing}
                  onChange={(e) => setHeroes({ ...heroes, barbarianKing: Number(e.target.value) })}
                  className="w-full text-center font-mono font-bold text-stone-900 mt-1 outline-none"
                />
              </div>
              <div className="bg-white p-2 rounded-lg border border-stone-200">
                <span className="text-[10px] text-stone-500 block">ملكة الرماة</span>
                <input
                  type="number"
                  min={0}
                  max={95}
                  value={heroes.archerQueen}
                  onChange={(e) => setHeroes({ ...heroes, archerQueen: Number(e.target.value) })}
                  className="w-full text-center font-mono font-bold text-stone-900 mt-1 outline-none"
                />
              </div>
              <div className="bg-white p-2 rounded-lg border border-stone-200">
                <span className="text-[10px] text-stone-500 block">الآمر الكبير</span>
                <input
                  type="number"
                  min={0}
                  max={70}
                  value={heroes.grandWarden}
                  onChange={(e) => setHeroes({ ...heroes, grandWarden: Number(e.target.value) })}
                  className="w-full text-center font-mono font-bold text-cyan-700 mt-1 outline-none"
                />
              </div>
              <div className="bg-white p-2 rounded-lg border border-stone-200">
                <span className="text-[10px] text-stone-500 block">البطلة الملكية</span>
                <input
                  type="number"
                  min={0}
                  max={45}
                  value={heroes.royalChampion}
                  onChange={(e) => setHeroes({ ...heroes, royalChampion: Number(e.target.value) })}
                  className="w-full text-center font-mono font-bold text-purple-700 mt-1 outline-none"
                />
              </div>
              <div className="bg-white p-2 rounded-lg border border-stone-200">
                <span className="text-[10px] text-stone-500 block">أمير المينيون</span>
                <input
                  type="number"
                  min={0}
                  max={35}
                  value={heroes.minionPrince || 0}
                  onChange={(e) => setHeroes({ ...heroes, minionPrince: Number(e.target.value) })}
                  className="w-full text-center font-mono font-bold text-amber-700 mt-1 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 5: Essential Game Data */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">تاغ القرية:</label>
              <input
                type="text"
                value={playerTag}
                onChange={(e) => setPlayerTag(e.target.value)}
                placeholder="#2PY98LQ"
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-mono text-stone-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">الكؤوس:</label>
              <input
                type="number"
                value={trophies}
                onChange={(e) => setTrophies(Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-mono text-stone-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">الجواهر:</label>
              <input
                type="number"
                value={gems}
                onChange={(e) => setGems(Number(e.target.value))}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-mono text-emerald-700 font-bold outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">تغيير الاسم:</label>
              <select
                value={nameChangeStatus}
                onChange={(e) => setNameChangeStatus(e.target.value as any)}
                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 text-stone-900 outline-none"
              >
                <option value="مجاني (Free)">مجاني (Free)</option>
                <option value="500 جوهرة">500 جوهرة</option>
                <option value="1000 جوهرة">1000 جوهرة</option>
                <option value="غير متاح حالياً">غير متاح حالياً</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">
              تفاصيل وملاحظات القرية للمشتري:
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل إضافية مثل السكنات، المعدات المطورة، حالة القرية الليلية..."
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl font-black text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm"
            >
              {listingType === 'auction' ? (
                <>
                  <Gavel className="w-4 h-4 text-stone-950" />
                  <span>طرح القرية في المزاد العلني فوراً ({images.length} صورة مرفقة)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-stone-950" />
                  <span>نشر القرية فوراً في سوق كلاش للبيع المباشر ({images.length} صورة مرفقة)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
