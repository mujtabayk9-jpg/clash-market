import React from 'react';
import { Shield, Sparkles, Coins, CreditCard, ShieldAlert } from 'lucide-react';
import { UserDigitalCard } from '../types/clash';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  favoritesCount: number;
  ordersCount: number;
  walletBalance: number;
  userCard: UserDigitalCard;
  isAdminUnlocked?: boolean;
  onOpenWalletModal: () => void;
  onOpenAdminModal: () => void;
  onOpenCalculatorModal: () => void;
  onOpenEscrowModal: () => void;
  onOpenTagVerifier: () => void;
  onOpenBaseLayouts: () => void;
  onOpenMyOrders: () => void;
  onOpenIdCardModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  ordersCount,
  walletBalance,
  userCard,
  isAdminUnlocked = false,
  onOpenWalletModal,
  onOpenAdminModal,
  onOpenCalculatorModal,
  onOpenTagVerifier,
  onOpenBaseLayouts,
  onOpenMyOrders,
  onOpenIdCardModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-md border-b border-stone-200/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab('catalog')}
              className="flex items-center gap-2.5 text-stone-900 hover:text-amber-700 transition-colors whitespace-nowrap cursor-pointer text-right group"
            >
              <span className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-600 inline-flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 fill-amber-500/20 text-amber-600" />
              </span>
              <div className="flex flex-col text-right">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-stone-950 font-serif leading-none">
                  Al-Qimma Clash
                </span>
                <span className="text-[10px] text-amber-700 font-bold tracking-wider mt-0.5">
                  متجر القمة كلاش الرسمي
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Clean navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
            <button
              onClick={() => setCurrentTab('catalog')}
              className={`hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
                currentTab === 'catalog' ? 'text-amber-700 font-semibold border-b-2 border-amber-600' : ''
              }`}
            >
              حسابات للبيع
            </button>
            <button
              onClick={() => setCurrentTab('auctions')}
              className={`hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 pb-0.5 ${
                currentTab === 'auctions' ? 'text-amber-700 font-semibold border-b-2 border-amber-600' : ''
              }`}
            >
              <span>المزادات</span>
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                <span>مباشر</span>
              </span>
            </button>
            <button
              onClick={onOpenTagVerifier}
              className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              فحص تاغ القرية
            </button>
            <button
              onClick={onOpenBaseLayouts}
              className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              مخططات مجانية
            </button>
            <button
              onClick={onOpenCalculatorModal}
              className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              حاسبة السعر
            </button>
            <button
              onClick={onOpenMyOrders}
              className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
            >
              <span>طلباتي</span>
              {ordersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>
            <button
              onClick={onOpenIdCardModal}
              className="hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 font-bold text-amber-800"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-600" />
              <span>بطاقتي التعريفية</span>
            </button>
          </nav>

          {/* Zone 3: ID Card Badge + Coins Wallet + Admin Portal Trigger if unlocked */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* User Permanent Digital ID Card Badge */}
            <button
              onClick={onOpenIdCardModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-900 text-amber-300 hover:bg-stone-800 transition-colors cursor-pointer text-xs font-mono font-bold shadow-xs border border-amber-400/30"
              title="عرض بطاقتي التعريفية الدائمة والشحن عبر المشرف"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-[11px] text-stone-300 font-sans">هويتي:</span>
              <span className="tracking-wider">{userCard.cardId}</span>
            </button>

            {/* Custom App Coins Wallet Button */}
            <button
              onClick={onOpenWalletModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 hover:bg-amber-100/70 transition-colors cursor-pointer text-xs"
              title="رصيد المحفظة بالعملات (يتم الشحن بواسطة المشرف)"
            >
              <Coins className="w-4 h-4 text-amber-600" />
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-black text-amber-900 tabular-nums text-sm">
                  {walletBalance.toLocaleString()}
                </span>
                <span className="text-[11px] font-bold text-stone-700">عملة</span>
              </div>
            </button>

            {/* Admin Management Button (Only shown when admin panel is active or unlocked) */}
            {isAdminUnlocked && (
              <button
                onClick={onOpenAdminModal}
                className="px-3.5 py-1.5 text-xs font-black text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
                title="لوحة الإدارة والتحكم المعتمدة"
              >
                <ShieldAlert className="w-4 h-4 text-stone-950" />
                <span>إدارة المتجر</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
