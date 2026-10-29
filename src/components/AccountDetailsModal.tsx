import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Gem, 
  Trophy, 
  Star, 
  Swords, 
  MessageSquare, 
  ShoppingCart, 
  CheckCircle2, 
  Coins,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Images,
  Check
} from 'lucide-react';
import { AccountListing } from '../types/clash';
import { SoldSealStamp } from './SoldSealStamp';

interface AccountDetailsModalProps {
  account: AccountListing | null;
  onClose: () => void;
  onBuy: (account: AccountListing) => void;
  onOpenChat: (account: AccountListing) => void;
  onToggleSold?: (id: string) => void;
}

export const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({
  account,
  onClose,
  onBuy,
  onOpenChat,
  onToggleSold,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  if (!account) return null;

  const priceInCoins = account.priceUSD * 100;
  const allImages = [account.image, ...(account.secondaryImages || [])].filter(Boolean);
  const currentImage = allImages[selectedImageIndex] || account.image;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
        <div 
          className="relative w-full max-w-4xl bg-[#faf8f5] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col"
          dir="rtl"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 text-xs font-black bg-amber-500 text-stone-950 rounded-md shadow-xs">
                تاون هول {account.townHallLevel}
              </span>
              <span className="text-xs font-mono text-stone-500">تاغ القرية: {account.playerTag}</span>
              {allImages.length > 1 && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full">
                  <Images className="w-3 h-3 text-amber-600" />
                  <span>{allImages.length} صور متوفرة</span>
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-right">
            {/* Top Split: Image Gallery & Primary Buying Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Village Multi-Image Gallery */}
              <div className="lg:col-span-7 space-y-2.5">
                {/* Main Viewport */}
                <div 
                  onClick={() => setIsLightboxOpen(true)}
                  className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-950 aspect-[4/3] group cursor-pointer shadow-xs select-none"
                >
                  <img
                    src={currentImage}
                    alt={`${account.title} - صورة ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/hero_clash_marketplace_1792906935926.jpg';
                    }}
                  />
                  
                  {/* Subtle Gradient & Badges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />

                  {/* SOLD ROYAL SEAL STAMP OVERLAY: 𒀱 𒅒 𒈓 𒀰 */}
                  {account.status === 'sold' && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center p-4 pointer-events-none animate-in fade-in zoom-in-75 duration-300">
                      <SoldSealStamp size="lg" />
                    </div>
                  )}

                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-md text-[11px] text-emerald-800 font-bold flex items-center gap-1.5 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>فحص مطابق لسيرفر كلاش الرسمي</span>
                  </div>

                  {/* Zoom indicator */}
                  <div className="absolute top-2.5 left-2.5 p-1.5 rounded-lg bg-stone-900/70 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  {/* Navigation Arrows for Multiple Images */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900/90 transition-colors shadow-md cursor-pointer"
                        title="الصورة السابقة"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-stone-900/60 text-white hover:bg-stone-900/90 transition-colors shadow-md cursor-pointer"
                        title="الصورة التالية"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-stone-900/80 text-amber-300 text-[11px] font-mono font-bold">
                        {selectedImageIndex + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails Strip */}
                {allImages.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative rounded-xl overflow-hidden border-2 w-16 h-12 shrink-0 cursor-pointer transition-all ${
                          selectedImageIndex === idx
                            ? 'border-amber-500 ring-2 ring-amber-400/40 scale-105'
                            : 'border-stone-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-0 inset-x-0 bg-stone-900/80 text-amber-300 text-[8px] text-center font-bold">
                            الغلاف
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Buying & Pricing Module */}
              <div className="lg:col-span-5 p-5 bg-white border border-stone-200 rounded-2xl space-y-4 shadow-xs">
                {account.status === 'sold' ? (
                  <div className="p-3.5 bg-red-50 border border-red-300 rounded-xl space-y-1.5 text-right shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-900">حالة الحساب في المتجر:</span>
                      <span className="font-serif text-base font-extrabold text-amber-800">𒀱 𒅒 𒈓 𒀰</span>
                    </div>
                    <div className="text-red-700 font-extrabold text-base flex items-center gap-1.5">
                      <span>تم بيع الحساب رسمياً بالختم الملكي</span>
                    </div>
                    <span className="text-xs text-stone-500 block">
                      قيمة الصفقة: <strong className="font-mono text-stone-800">{priceInCoins.toLocaleString()} عملة</strong>
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs text-stone-500">السعر الإجمالي للقرية:</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <Coins className="w-5 h-5 text-amber-600 self-center" />
                      <span className="text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
                        {priceInCoins.toLocaleString()}
                      </span>
                      <span className="text-sm font-bold text-stone-700">عملة</span>
                    </div>
                    <div className="mt-1 text-xs text-amber-800 font-medium">
                      <span>يتم الشراء بالخصم الفوري من رصيد عملات بطاقتك التعريفية</span>
                    </div>
                  </div>
                )}

                {/* Escrow Guarantee Statement */}
                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>محمي بنظام الوساطة والضمان المعتمد 100%</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">
                    لن يتم تسليم العملات للبائع إلا بعد استلامك لحساب الـ Supercell ID وتغيير كلمة السر والتأكد التام من جميع بيانات القرية.
                  </p>
                </div>

                {/* CTAs */}
                <div className="space-y-2 pt-1">
                  {account.status === 'sold' ? (
                    <div className="w-full py-3.5 px-4 rounded-xl font-bold text-red-900 bg-red-100 border border-red-300 flex items-center justify-center gap-2 cursor-not-allowed text-sm shadow-xs select-none">
                      <span className="font-serif text-base text-red-700 font-extrabold">𒀱 𒅒 𒈓 𒀰</span>
                      <span>مباع بالختم الملكي (غير متاح للشراء)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        onClose();
                        onBuy(account);
                      }}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>شراء القرية بالعملات الآن</span>
                    </button>
                  )}

                  {/* Mark as sold toggle action ("او اشر عليه ينباع") */}
                  {onToggleSold && (
                    <button
                      type="button"
                      onClick={() => onToggleSold(account.id)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                        account.status === 'sold'
                          ? 'bg-stone-850 hover:bg-stone-900 text-amber-300 border border-amber-400/50'
                          : 'bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white hover:from-red-800 hover:to-rose-900'
                      }`}
                    >
                      <span className="font-serif text-sm font-extrabold text-amber-300">𒀱 𒅒 𒈓 𒀰</span>
                      <span>
                        {account.status === 'sold'
                          ? 'إلغاء وسم البيع (إعادة عرض الحساب للبيع)'
                          : 'تأشير الحساب كمباع وطباعة الختم الملكي'}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onOpenChat(account);
                    }}
                    className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-stone-600" />
                    <span>مراسلة البائع والاستفسار</span>
                  </button>
                </div>

                {/* Seller Information */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-400 block text-[11px]">البائع المعتمد:</span>
                    <span className="font-semibold text-stone-800">{account.sellerName}</span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1 text-amber-600 font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{account.sellerRating}</span>
                    </div>
                    <span className="text-stone-400 text-[10px]">{account.sellerSalesCount} عملية ناجحة</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Title & Long Description */}
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-1.5">{account.title}</h2>
              <p className="text-sm text-stone-600 leading-relaxed">{account.description}</p>
            </div>

            {/* Heroes Grid (Clash Heroes) */}
            <div>
              <h3 className="text-sm font-bold text-stone-800 mb-3 flex items-center gap-2">
                <Swords className="w-4 h-4 text-amber-600" />
                <span>مستويات الأبطال الرسمية:</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3 bg-white border border-stone-200 rounded-xl text-center shadow-xs">
                  <span className="text-[11px] text-stone-500 block">الملك البربري</span>
                  <span className="text-xl font-extrabold text-amber-700 font-mono">
                    {account.heroes.barbarianKing}
                  </span>
                </div>
                <div className="p-3 bg-white border border-stone-200 rounded-xl text-center shadow-xs">
                  <span className="text-[11px] text-stone-500 block">ملكة الرماة</span>
                  <span className="text-xl font-extrabold text-amber-700 font-mono">
                    {account.heroes.archerQueen}
                  </span>
                </div>
                <div className="p-3 bg-white border border-stone-200 rounded-xl text-center shadow-xs">
                  <span className="text-[11px] text-stone-500 block">الآمر الكبير</span>
                  <span className="text-xl font-extrabold text-cyan-700 font-mono">
                    {account.heroes.grandWarden}
                  </span>
                </div>
                <div className="p-3 bg-white border border-stone-200 rounded-xl text-center shadow-xs">
                  <span className="text-[11px] text-stone-500 block">البطلة الملكية</span>
                  <span className="text-xl font-extrabold text-purple-700 font-mono">
                    {account.heroes.royalChampion}
                  </span>
                </div>
                {account.heroes.minionPrince !== undefined && (
                  <div className="p-3 bg-white border border-stone-200 rounded-xl text-center shadow-xs">
                    <span className="text-[11px] text-stone-500 block">أمير المينيون</span>
                    <span className="text-xl font-extrabold text-amber-800 font-mono">
                      {account.heroes.minionPrince}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Key Game Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-white border border-stone-200 rounded-xl flex items-center gap-3 shadow-xs">
                <Trophy className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <span className="text-[11px] text-stone-500 block">الكؤوس الحالية:</span>
                  <span className="font-mono font-bold text-stone-900">{account.trophies.toLocaleString()}</span>
                </div>
              </div>
              <div className="p-3.5 bg-white border border-stone-200 rounded-xl flex items-center gap-3 shadow-xs">
                <Gem className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <span className="text-[11px] text-stone-500 block">الجواهر المتوفرة:</span>
                  <span className="font-mono font-bold text-emerald-700">{account.gems.toLocaleString()}</span>
                </div>
              </div>
              <div className="p-3.5 bg-white border border-stone-200 rounded-xl flex items-center gap-3 shadow-xs">
                <Star className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-stone-500 block">نجوم الحرب:</span>
                  <span className="font-mono font-bold text-stone-900">{account.warStars.toLocaleString()}</span>
                </div>
              </div>
              <div className="p-3.5 bg-white border border-stone-200 rounded-xl flex items-center gap-3 shadow-xs">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[11px] text-stone-500 block">تغيير الاسم:</span>
                  <span className="font-semibold text-stone-900 text-xs">{account.nameChangeStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Full View */}
      {isLightboxOpen && (
        <div 
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-60 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={currentImage}
              alt="معاينة كاملة لصورة القرية"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-3 left-3 p-2 rounded-full bg-stone-900/80 text-white hover:bg-stone-900 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
