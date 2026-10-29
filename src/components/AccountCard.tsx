import React from 'react';
import { ShieldCheck, Heart, Swords, Eye, ShoppingCart, Gem, Trophy, Star, Coins, Images, Tag } from 'lucide-react';
import { AccountListing } from '../types/clash';
import { SoldSealStamp } from './SoldSealStamp';

interface AccountCardProps {
  account: AccountListing;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (account: AccountListing) => void;
  onInspect: (account: AccountListing) => void;
  onBuy: (account: AccountListing) => void;
  onToggleSold?: (id: string) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
  onInspect,
  onBuy,
  onToggleSold,
}) => {
  const priceInCoins = account.priceUSD * 100;
  const totalPhotosCount = 1 + (account.secondaryImages?.length || 0);

  return (
    <div className="group relative bg-white border border-stone-200/90 rounded-2xl overflow-hidden hover:border-stone-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Top Media Showcase Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={account.image}
          alt={account.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none ${
            account.status === 'sold' ? 'filter grayscale-[30%] brightness-90' : ''
          }`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/src/assets/images/hero_clash_marketplace_1792906935926.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />

        {/* SOLD ROYAL SEAL STAMP OVERLAY: 𒀱 𒅒 𒈓 𒀰 */}
        {account.status === 'sold' && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-2 pointer-events-none animate-in fade-in zoom-in-75 duration-300">
            <SoldSealStamp size="md" />
          </div>
        )}

        {/* Town Hall & Supercell ID status overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <span className="px-2.5 py-1 text-xs font-black tracking-wide bg-amber-500 text-stone-950 rounded-md shadow-xs">
            تاون {account.townHallLevel}
          </span>
          {account.maxHeroes && (
            <span className="px-2 py-0.5 text-[11px] font-bold bg-stone-900/90 text-amber-300 border border-amber-500/30 rounded-md">
              أبطال ماكس
            </span>
          )}
          {totalPhotosCount > 1 && (
            <span className="px-2 py-0.5 text-[11px] font-bold bg-stone-950/80 text-white rounded-md flex items-center gap-1 backdrop-blur-xs shadow-xs">
              <Images className="w-3 h-3 text-amber-400" />
              <span>{totalPhotosCount} صور</span>
            </span>
          )}
        </div>

        {/* Top-Left Action Buttons: Favorite, Compare, and Mark as Sold (او اشر عليه ينباع) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-30">
          {onToggleSold && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSold(account.id);
              }}
              className={`p-1.5 px-2 rounded-lg backdrop-blur-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md ${
                account.status === 'sold'
                  ? 'bg-red-700 text-white border border-red-800 hover:bg-red-800 ring-2 ring-red-400'
                  : 'bg-white/95 text-stone-800 hover:text-red-700 border border-stone-300 hover:border-red-400'
              }`}
              title={
                account.status === 'sold'
                  ? 'الحساب موسوم كمباع بالختم (اضغط لإلغاء البيع وإعادته متاحاً)'
                  : 'تأشير الحساب كمباع وطباعة الختم 𒀱 𒅒 𒈓 𒀰'
              }
            >
              <span className="font-serif text-sm font-extrabold text-amber-300 drop-shadow-xs leading-none">𒀱</span>
              <span className="text-[10px] font-bold">
                {account.status === 'sold' ? 'مباع بالختم' : 'تأشير كمباع'}
              </span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(account.id);
            }}
            className={`p-2 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40 bg-white/90'
                : 'bg-white/80 text-stone-700 hover:text-stone-900 border border-stone-300/80'
            }`}
            title={isFavorite ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(account);
            }}
            className={`p-2 rounded-lg backdrop-blur-md text-xs font-medium transition-colors cursor-pointer ${
              isCompared
                ? 'bg-amber-500/20 text-amber-700 border border-amber-500/40 bg-white/90'
                : 'bg-white/80 text-stone-700 hover:text-stone-900 border border-stone-300/80'
            }`}
            title="مقارنة مع حساب آخر"
          >
            <Swords className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom image overlay metadata */}
        <div className="absolute bottom-2.5 right-3 left-3 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-1 text-amber-300 font-mono font-medium drop-shadow-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{account.trophies.toLocaleString()} كأس</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-300 font-mono font-medium drop-shadow-xs">
            <Gem className="w-3.5 h-3.5 text-emerald-400" />
            <span>{account.gems.toLocaleString()} جوهرة</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Line */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
            <span>مستوى {account.xpLevel}</span>
            <span aria-hidden="true">·</span>
            <span>{account.nameChangeStatus}</span>
            <span aria-hidden="true">·</span>
            <span>بناء ليلي {account.builderHallLevel}</span>
          </div>

          {/* Account Title */}
          <h3
            onClick={() => onInspect(account)}
            className="text-base font-bold text-stone-900 hover:text-amber-700 transition-colors cursor-pointer line-clamp-1 mb-1.5"
          >
            {account.title}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
            {account.description}
          </p>

          {/* Heroes Stats Strip */}
          <div className="grid grid-cols-4 gap-1.5 p-2 bg-[#fbf9f5] border border-stone-200 rounded-xl text-center text-xs mb-3.5">
            <div className="flex flex-col">
              <span className="text-[10px] text-stone-400 font-medium">الملك</span>
              <span className="font-bold text-amber-700 font-mono tabular-nums">{account.heroes.barbarianKing}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-stone-400 font-medium">الملكة</span>
              <span className="font-bold text-amber-700 font-mono tabular-nums">{account.heroes.archerQueen}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-stone-400 font-medium">الآمر</span>
              <span className="font-bold text-cyan-700 font-mono tabular-nums">{account.heroes.grandWarden}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-stone-400 font-medium">البطلة</span>
              <span className="font-bold text-purple-700 font-mono tabular-nums">{account.heroes.royalChampion}</span>
            </div>
          </div>

          {/* Seller Verified & Security line */}
          <div className="flex items-center justify-between text-xs text-stone-500 pb-3 mb-3 border-b border-stone-100">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="truncate max-w-[140px] text-stone-700 font-medium">{account.sellerName}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-600 font-mono">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{account.sellerRating}</span>
              <span className="text-stone-400 text-[10px]">({account.sellerSalesCount})</span>
            </div>
          </div>
        </div>

        {/* Footer: Price in Coins and Action buttons */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs text-stone-400 block">
                {account.status === 'sold' ? 'حالة الحساب:' : 'سعر الحساب:'}
              </span>
              <span className={`text-[11px] font-medium ${account.status === 'sold' ? 'text-red-700 font-bold' : 'text-amber-800'}`}>
                {account.status === 'sold' ? 'تم البيع والتوثيق' : 'شراء مباشر بالعملات'}
              </span>
            </div>

            <div className="flex items-baseline gap-1.5 text-right">
              {account.status === 'sold' ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-900 border border-red-300 rounded-lg shadow-xs">
                  <span className="font-serif text-amber-700 font-extrabold text-sm">𒀱</span>
                  <span className="font-bold text-xs">مباع</span>
                  <span className="text-[11px] text-stone-400 line-through font-mono">
                    {priceInCoins.toLocaleString()} عملة
                  </span>
                </div>
              ) : (
                <>
                  <Coins className="w-4 h-4 text-amber-600 self-center" />
                  <span className="text-2xl font-black text-amber-900 font-mono tabular-nums">
                    {priceInCoins.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-stone-700">عملة</span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onInspect(account)}
              className="px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Eye className="w-3.5 h-3.5 text-stone-600" />
              <span>فحص القرية</span>
            </button>
            {account.status === 'sold' ? (
              <div
                className="px-3 py-2 text-xs font-extrabold text-red-800 bg-red-100/90 border border-red-300 rounded-lg flex items-center justify-center gap-1.5 cursor-not-allowed select-none shadow-xs"
                title="تم بيع هذا الحساب رسمياً بالختم الملكي 𒀱 𒅒 𒈓 𒀰"
              >
                <span className="font-serif text-sm text-red-700 font-bold">𒀱</span>
                <span>مباع بالختم</span>
              </div>
            ) : (
              <button
                onClick={() => onBuy(account)}
                className="px-3 py-2 text-xs font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>شراء بالعملات</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
