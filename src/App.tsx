import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  RotateCcw,
  CheckCircle2,
  Swords,
  CreditCard,
  Gavel
} from 'lucide-react';

import { AccountListing, UserDigitalCard, AuctionListing } from './types/clash';
import { INITIAL_ACCOUNTS } from './data/mockAccounts';
import { getInitialMockAuctions } from './data/mockAuctions';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AccountCard } from './components/AccountCard';
import { AccountDetailsModal } from './components/AccountDetailsModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminAddVillageModal } from './components/AdminAddVillageModal';
import { ValuationCalculatorModal } from './components/ValuationCalculatorModal';
import { CompareModal } from './components/CompareModal';
import { EscrowGuideModal } from './components/EscrowGuideModal';
import { ChatModal } from './components/ChatModal';
import { WalletModal } from './components/WalletModal';
import { TagVerifierModal } from './components/TagVerifierModal';
import { BaseLayoutsModal } from './components/BaseLayoutsModal';
import { MyOrdersModal } from './components/MyOrdersModal';
import { ReviewsSection } from './components/ReviewsSection';
import { DigitalIdCardModal } from './components/DigitalIdCardModal';
import { AdminRechargeModal } from './components/AdminRechargeModal';
import { AuctionsView } from './components/AuctionsView';
import { PlaceBidModal } from './components/PlaceBidModal';
import { registerClientIfNew, setCardBalance, normalizeCardId } from './utils/balanceManager';

export default function App() {
  // Permanent Lifelong User Digital ID Card (Generated automatically on first visit)
  const [userCard, setUserCard] = useState<UserDigitalCard>(() => {
    try {
      const saved = localStorage.getItem('clash_user_id_card');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    const rand1 = Math.floor(1000 + Math.random() * 9000);
    const rand2 = Math.floor(1000 + Math.random() * 9000);
    const newCard: UserDigitalCard = {
      cardId: `CLC-${rand1}-${rand2}`,
      memberName: `المحارب_${rand1}`,
      memberTier: 'عضوية موثقة دائمة',
      joinedDate: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      securityCode: Math.floor(1000 + Math.random() * 9000).toString(),
      avatarSeed: Math.floor(Math.random() * 100),
      qrCodeMock: `CLC-PASS-VERIFIED-${rand1}`,
    };
    try {
      localStorage.setItem('clash_user_id_card', JSON.stringify(newCard));
    } catch (e) {
      console.error(e);
    }
    return newCard;
  });

  const handleSwitchCard = (newCard: UserDigitalCard) => {
    setUserCard(newCard);
    try {
      localStorage.setItem('clash_user_id_card', JSON.stringify(newCard));
    } catch (e) {
      console.error(e);
    }
    const bal = registerClientIfNew(newCard.cardId, newCard.memberName);
    setWalletBalance(bal);
    showToast(`تم التبديل بنجاح إلى البطاقة: ${newCard.cardId} (${newCard.memberName})`);
  };

  // Admin WhatsApp Number for Direct Recharging
  const [adminWhatsApp, setAdminWhatsApp] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('clash_admin_whatsapp');
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return '9647708924110';
  });

  // Accounts state with local storage persistence
  const [accounts, setAccounts] = useState<AccountListing[]>(() => {
    try {
      const saved = localStorage.getItem('clash_marketplace_accounts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ACCOUNTS;
  });

  // Live Clash Auctions state with local storage persistence
  const [auctions, setAuctions] = useState<AuctionListing[]>(() => {
    try {
      const saved = localStorage.getItem('clash_marketplace_auctions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return getInitialMockAuctions();
  });

  const [activeBiddingAuction, setActiveBiddingAuction] = useState<AuctionListing | null>(null);

  // User Purchased Orders History
  const [purchasedAccounts, setPurchasedAccounts] = useState<AccountListing[]>(() => {
    try {
      const saved = localStorage.getItem('clash_my_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // In-app Coins Wallet Balance (strictly defaults to 0 for every visitor until charged by admin)
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    return registerClientIfNew(userCard.cardId, userCard.memberName);
  });

  // Admin Mode state (Unlocked by typing 091909)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isAdminAddVillageOpen, setIsAdminAddVillageOpen] = useState(false);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('clash_favorites');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return ['coc-th17-001'];
  });

  // Comparison
  const [comparedAccounts, setComparedAccounts] = useState<AccountListing[]>([]);

  // Filters & Tabs
  const [currentTab, setCurrentTab] = useState<string>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTHFilter, setSelectedTHFilter] = useState<number | null>(null);
  const [onlyMaxHeroes, setOnlyMaxHeroes] = useState(false);
  const [onlyFreeName, setOnlyFreeName] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'th-desc' | 'trophies-desc'>('featured');

  // Modals
  const [inspectingAccount, setInspectingAccount] = useState<AccountListing | null>(null);
  const [buyingAccount, setBuyingAccount] = useState<AccountListing | null>(null);
  const [chattingAccount, setChattingAccount] = useState<AccountListing | null>(null);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isTagVerifierOpen, setIsTagVerifierOpen] = useState(false);
  const [isBaseLayoutsOpen, setIsBaseLayoutsOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
  const [isAdminRechargeOpen, setIsAdminRechargeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real-time synchronization of wallet balance when recharged by admin
  useEffect(() => {
    const handleBalanceEvent = (e: any) => {
      const { cardId, newBalance, amountAdded } = e.detail || {};
      if (cardId && normalizeCardId(cardId) === normalizeCardId(userCard.cardId)) {
        setWalletBalance(newBalance);
        if (amountAdded > 0) {
          showToast(`⚡ تم استلام +${amountAdded.toLocaleString()} عملة في بطاقتك بنجاح! الرصيد المتاح: ${newBalance.toLocaleString()} عملة`);
        }
      }
    };
    window.addEventListener('clash_balance_change', handleBalanceEvent);
    return () => window.removeEventListener('clash_balance_change', handleBalanceEvent);
  }, [userCard.cardId]);

  // Monitor search query for secret master admin code "091909"
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed === '091909' || trimmed.includes('091909')) {
      setIsAdminUnlocked(true);
      setIsAdminRechargeOpen(true);
      setSearchQuery('');
      showToast('⚡ تم فتح لوحة الإدارة والتحكم الشاملة بنجاح');
    }
  }, [searchQuery]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('clash_marketplace_accounts', JSON.stringify(accounts));
    } catch (e) {
      console.error(e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem('clash_my_orders', JSON.stringify(purchasedAccounts));
    } catch (e) {
      console.error(e);
    }
  }, [purchasedAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem('clash_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('clash_marketplace_auctions', JSON.stringify(auctions));
    } catch (e) {
      console.error(e);
    }
  }, [auctions]);

  useEffect(() => {
    try {
      localStorage.setItem('clash_wallet_balance', walletBalance.toString());
    } catch (e) {
      console.error(e);
    }
  }, [walletBalance]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const isFav = prev.includes(id);
      const updated = isFav ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(isFav ? 'تمت إزالة الحساب من المفضلة' : 'تمت إضافة الحساب للمفضلة');
      return updated;
    });
  };

  const handleToggleCompare = (acc: AccountListing) => {
    setComparedAccounts((prev) => {
      const exists = prev.some((a) => a.id === acc.id);
      if (exists) {
        return prev.filter((a) => a.id !== acc.id);
      }
      if (prev.length >= 3) {
        showToast('يمكنك مقارنة 3 حسابات كحد أقصى في وقت واحد');
        return prev;
      }
      showToast(`تمت إضافة ${acc.title.substring(0, 20)}... للمقارنة`);
      return [...prev, acc];
    });
  };

  const handleAddAccount = (newAcc: AccountListing) => {
    setAccounts((prev) => [newAcc, ...prev]);
    showToast('تم نشر القرية بنجاح في سوق كلاش مع كافة الصور المرفقة!');
  };

  const handleToggleSoldStatus = (accountId: string) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === accountId) {
          const newStatus = acc.status === 'sold' ? 'available' : 'sold';
          showToast(
            newStatus === 'sold'
              ? '𒀱 تم طبع الختم الملكي (𒀱 𒅒 𒈓 𒀰) وتأشير الحساب كمباع بنجاح!'
              : 'تم إلغاء وسم البيع وإعادة الحساب كـ "متاح للبيع".'
          );
          return { ...acc, status: newStatus };
        }
        return acc;
      })
    );
    setInspectingAccount((prev) => {
      if (prev && prev.id === accountId) {
        return { ...prev, status: prev.status === 'sold' ? 'available' : 'sold' };
      }
      return prev;
    });
  };

  const handleCompletePurchase = (purchasedAcc: AccountListing) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === purchasedAcc.id ? { ...acc, status: 'sold' as const } : acc))
    );
    setPurchasedAccounts((prev) => [purchasedAcc, ...prev]);
    showToast('مبروك! تم شراء الحساب وطباعة ختم التوثيق 𒀱 𒅒 𒈓 𒀰 بنجاح وحفظ الفاتورة في طلباتي.');
  };

  const handleAdminAddCoins = (amount: number, note?: string) => {
    setWalletBalance((prev) => {
      const updated = prev + amount;
      setCardBalance(userCard.cardId, updated, userCard.memberName);
      return updated;
    });
    showToast(`⚡ تم شحن ${amount.toLocaleString()} عملة بنجاح! الرصيد متاح فوراً للشراء.`);
  };

  const handleDeductWallet = (coinsToDeduct: number) => {
    setWalletBalance((prev) => {
      const updated = Math.max(0, prev - coinsToDeduct);
      setCardBalance(userCard.cardId, updated, userCard.memberName);
      return updated;
    });
  };

  // Live Auction Bidding Handler
  const handlePlaceBid = (auctionId: string, bidAmount: number) => {
    const targetAuction = auctions.find((a) => a.id === auctionId);
    if (!targetAuction) return;

    const isAlreadyHighest = 
      targetAuction.highestBidderCardId && 
      normalizeCardId(targetAuction.highestBidderCardId) === normalizeCardId(userCard.cardId);

    // If user was already highest, they only pay the incremental difference
    const coinsToDeduct = isAlreadyHighest 
      ? Math.max(0, bidAmount - targetAuction.currentBid) 
      : bidAmount;

    if (coinsToDeduct > walletBalance) {
      showToast('⚠️ رصيدك الحالي غير كافٍ لهذه السومة. يرجى شحن البطاقة عبر المشرف أولاً.');
      return;
    }

    // Deduct coins from user wallet
    handleDeductWallet(coinsToDeduct);

    // Record new bid entry
    const newBidRecord = {
      id: `bid-${Date.now()}`,
      bidderCardId: userCard.cardId,
      bidderName: userCard.memberName,
      amount: bidAmount,
      timestamp: 'الآن',
    };

    setAuctions((prev) =>
      prev.map((auc) => {
        if (auc.id !== auctionId) return auc;
        return {
          ...auc,
          currentBid: bidAmount,
          highestBidderCardId: userCard.cardId,
          highestBidderName: userCard.memberName,
          totalBids: auc.totalBids + 1,
          bidHistory: [newBidRecord, ...auc.bidHistory],
        };
      })
    );

    showToast(`⚡ تم تأكيد سومتك بـ ${bidAmount.toLocaleString()} عملة بنجاح! أنت صاحب أعلى سومة حالياً.`);
  };

  // Instant Buyout of an Auction
  const handleInstantBuyout = (auction: AuctionListing) => {
    const cost = auction.buyoutCoins || auction.currentBid;
    if (walletBalance < cost) {
      showToast(`رصيدك (${walletBalance.toLocaleString()} عملة) غير كافٍ للشراء الفوري (${cost.toLocaleString()} عملة).`);
      setIsIdCardModalOpen(true);
      return;
    }

    handleDeductWallet(cost);

    setAuctions((prev) =>
      prev.map((auc) => (auc.id === auction.id ? { ...auc, status: 'ended' as const } : auc))
    );

    setPurchasedAccounts((prev) => [auction.account, ...prev]);
    showToast(`👑 مبروك! تم شراء قرية المزاد فورياً بـ ${cost.toLocaleString()} عملة وحفظ الفاتورة في "طلباتي".`);
  };

  // Admin Adds New Auction
  const handleAddAuction = (newAuction: AuctionListing) => {
    setAuctions((prev) => [newAuction, ...prev]);
    setCurrentTab('auctions');
    showToast('🔨 تم إطلاق المزاد العلني للقرية بنجاح! يمكن للعملاء الآن المزايدة عليها.');
  };


  // Filtered & Sorted Accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      if (currentTab === 'favorites' && !favorites.includes(acc.id)) {
        return false;
      }
      if (selectedTHFilter !== null && acc.townHallLevel !== selectedTHFilter) {
        return false;
      }
      if (onlyMaxHeroes && !acc.maxHeroes) {
        return false;
      }
      if (onlyFreeName && !acc.nameChangeStatus.includes('مجاني')) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = acc.title.toLowerCase().includes(q);
        const matchesDesc = acc.description.toLowerCase().includes(q);
        const matchesTag = acc.playerTag.toLowerCase().includes(q);
        const matchesSeller = acc.sellerName.toLowerCase().includes(q);
        const matchesTH = `تاون ${acc.townHallLevel}`.includes(q) || `th${acc.townHallLevel}`.includes(q);
        if (!matchesTitle && !matchesDesc && !matchesTag && !matchesSeller && !matchesTH) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceUSD - b.priceUSD;
      if (sortBy === 'price-desc') return b.priceUSD - a.priceUSD;
      if (sortBy === 'th-desc') return b.townHallLevel - a.townHallLevel;
      if (sortBy === 'trophies-desc') return b.trophies - a.trophies;
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [accounts, currentTab, favorites, selectedTHFilter, onlyMaxHeroes, onlyFreeName, searchQuery, sortBy]);

  const activeFiltersCount = (selectedTHFilter !== null ? 1 : 0) + (onlyMaxHeroes ? 1 : 0) + (onlyFreeName ? 1 : 0) + (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#f8f6f2] text-stone-900 flex flex-col font-sans">
      {/* Top Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        favoritesCount={favorites.length}
        ordersCount={purchasedAccounts.length}
        walletBalance={walletBalance}
        userCard={userCard}
        isAdminUnlocked={isAdminUnlocked}
        onOpenAdminModal={() => setIsAdminRechargeOpen(true)}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onOpenCalculatorModal={() => setIsCalculatorModalOpen(true)}
        onOpenEscrowModal={() => setIsEscrowModalOpen(true)}
        onOpenTagVerifier={() => setIsTagVerifierOpen(true)}
        onOpenBaseLayouts={() => setIsBaseLayoutsOpen(true)}
        onOpenMyOrders={() => setIsMyOrdersOpen(true)}
        onOpenIdCardModal={() => setIsIdCardModalOpen(true)}
      />

      {/* Permanent Automatic Digital ID Card Notification Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-100/50 to-orange-500/10 border-b border-amber-200/70 py-2.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-stone-900 text-amber-300 font-mono font-bold text-xs shadow-xs border border-amber-400/30">
              🪪 {userCard.cardId}
            </span>
            <span className="text-stone-700 hidden sm:inline font-medium">
              بطاقتك التعريفية الدائمة جاهزة! يتم شحن العملات حصراً عن طريق المشرف عبر الواتساب باستخدام رقم بطاقتك.
            </span>
          </div>
          <button
            onClick={() => setIsIdCardModalOpen(true)}
            className="text-amber-900 font-bold hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap text-xs bg-white/70 px-2.5 py-1 rounded-lg border border-amber-300"
          >
            <span>عرض بطاقتي والشحن بالواتساب</span>
            <span>←</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      {currentTab === 'catalog' && (
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTHFilter={selectedTHFilter}
          setSelectedTHFilter={setSelectedTHFilter}
          onExploreClick={() => {
            const el = document.getElementById('catalog-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenCalculator={() => setIsCalculatorModalOpen(true)}
          onOpenWallet={() => setIsWalletModalOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main id="catalog-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'auctions' ? (
          <AuctionsView
            auctions={auctions}
            currentUserCardId={userCard.cardId}
            walletBalance={walletBalance}
            isAdminUnlocked={isAdminUnlocked}
            onOpenBidModal={(auc) => setActiveBiddingAuction(auc)}
            onInspectAccount={(acc) => setInspectingAccount(acc)}
            onInstantBuyout={handleInstantBuyout}
            onOpenAdminAddVillage={() => setIsAdminAddVillageOpen(true)}
            onOpenIdCardModal={() => setIsIdCardModalOpen(true)}
          />
        ) : (
          <>
            {/* Controls Bar: Filters, Tabs & Sorting */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 mb-6 border-b border-stone-200">
              {/* Segmented Controls for Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 border border-stone-200 rounded-xl shrink-0">
                <button
                  onClick={() => setCurrentTab('catalog')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    currentTab === 'catalog'
                      ? 'bg-white text-stone-900 font-bold shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  جميع الحسابات ({accounts.length})
                </button>
                <button
                  onClick={() => setCurrentTab('auctions')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'auctions'
                      ? 'bg-white text-stone-900 font-bold shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <Gavel className="w-3.5 h-3.5 text-amber-600" />
                  <span>المزادات الحية</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold">
                    {auctions.filter((a) => a.status === 'active').length}
                  </span>
                </button>
                <button
                  onClick={() => setCurrentTab('favorites')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    currentTab === 'favorites'
                      ? 'bg-white text-stone-900 font-bold shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  المفضلة ({favorites.length})
                </button>
              </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setOnlyMaxHeroes(!onlyMaxHeroes)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                onlyMaxHeroes
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              أبطال ماكس فقط
            </button>
            <button
              onClick={() => setOnlyFreeName(!onlyFreeName)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                onlyFreeName
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              تغيير اسم مجاني
            </button>

            {/* Reset Filter Button if any active */}
            {activeFiltersCount > 0 && (
              <button
                onClick={() => {
                  setSelectedTHFilter(null);
                  setOnlyMaxHeroes(false);
                  setOnlyFreeName(false);
                  setSearchQuery('');
                }}
                className="px-2.5 py-2 text-stone-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
                title="إعادة تعيين الفلاتر"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إلغاء الفلترة</span>
              </button>
            )}

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 mr-auto">
              <span className="text-stone-500 font-medium hidden sm:inline">الترتيب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 outline-none cursor-pointer shadow-xs"
              >
                <option value="featured">المميز أولاً</option>
                <option value="price-asc">الأقل بالعملات</option>
                <option value="price-desc">الأعلى بالعملات</option>
                <option value="th-desc">أعلى تاون هول</option>
                <option value="trophies-desc">أعلى كؤوس</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section Heading & Result Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              {currentTab === 'favorites' ? 'الحسابات المحفوظة في المفضلة' : 'القرى والحسابات المعروضة'}
            </h2>
            <span className="text-xs text-stone-500 font-mono">({filteredAccounts.length} حساب متاح)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTagVerifierOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-300"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>فحص تاغ القرية</span>
            </button>

            {comparedAccounts.length > 0 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-200 transition-colors cursor-pointer shadow-xs"
              >
                <Swords className="w-4 h-4 text-amber-700" />
                <span>مقارنة {comparedAccounts.length} حسابات</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid: 3-column desktop layout */}
        {filteredAccounts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                isFavorite={favorites.includes(account.id)}
                onToggleFavorite={handleToggleFavorite}
                isCompared={comparedAccounts.some((a) => a.id === account.id)}
                onToggleCompare={handleToggleCompare}
                onInspect={(acc) => setInspectingAccount(acc)}
                onBuy={(acc) => setBuyingAccount(acc)}
                onToggleSold={handleToggleSoldStatus}
              />
            ))}
          </div>
        ) : (
          /* Clean Empty State */
          <div className="py-16 text-center border border-dashed border-stone-300 rounded-2xl p-8 bg-white">
            <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">لا توجد حسابات مطابقة للبحث</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
              جرب تغيير معايير الفلترة أو قم بالبحث برقم تاون آخر.
            </p>
            <button
              onClick={() => {
                setSelectedTHFilter(null);
                setOnlyMaxHeroes(false);
                setOnlyFreeName(false);
                setSearchQuery('');
                setCurrentTab('catalog');
              }}
              className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-xs text-white font-medium cursor-pointer transition-colors"
            >
              عرض جميع الحسابات
            </button>
          </div>
        )}

        {/* Community Customer Reviews & Ratings Section */}
        <ReviewsSection />

        {/* Safe Escrow Architecture Guarantee Banner */}
        <div className="mt-12 p-6 bg-white border border-stone-200 rounded-2xl shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">كيف نضمن أموالك وعمليات البيع والشراء 100%؟</h3>
                <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                  يتم حجز العملات في الوساطة الآمنة، ولا يستلم البائع أي عملة إلا بعد نقل بريد Supercell ID وتأكيد ملكيتك الكاملة وتغيير الرمز السري.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEscrowModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 text-xs font-semibold text-stone-800 bg-stone-50 hover:bg-stone-100 transition-colors whitespace-nowrap cursor-pointer shrink-0"
            >
              شرح بروتوكول الوساطة
            </button>
          </div>
        </div>
        </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white mt-auto py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 font-serif text-sm">Al-Qimma Clash</span>
            <span>· متجر القمة لتداول حسابات كلاش أوف كلانس بالعملات الرسمية والوساطة الآمنة</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsEscrowModalOpen(true)} className="hover:text-stone-900 cursor-pointer">شروط الوساطة</button>
            <button onClick={() => setIsIdCardModalOpen(true)} className="hover:text-stone-900 cursor-pointer">بطاقتي التعريفية</button>
            <button onClick={() => setIsBaseLayoutsOpen(true)} className="hover:text-stone-900 cursor-pointer">مخططات القرى</button>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <AccountDetailsModal
        account={inspectingAccount}
        onClose={() => setInspectingAccount(null)}
        onBuy={(acc) => setBuyingAccount(acc)}
        onOpenChat={(acc) => {
          setInspectingAccount(null);
          setChattingAccount(acc);
        }}
        onToggleSold={handleToggleSoldStatus}
      />

      <CheckoutModal
        account={buyingAccount}
        onClose={() => setBuyingAccount(null)}
        walletBalance={walletBalance}
        userCard={userCard}
        adminWhatsApp={adminWhatsApp}
        onDeductWallet={handleDeductWallet}
        onOpenWalletTopUp={() => {
          setBuyingAccount(null);
          setIsWalletModalOpen(true);
        }}
        onCompletePurchase={handleCompletePurchase}
      />

      <AdminAddVillageModal
        isOpen={isAdminAddVillageOpen}
        onClose={() => setIsAdminAddVillageOpen(false)}
        onAddAccount={handleAddAccount}
        onAddAuction={handleAddAuction}
      />

      <PlaceBidModal
        isOpen={!!activeBiddingAuction}
        onClose={() => setActiveBiddingAuction(null)}
        auction={activeBiddingAuction}
        userCard={userCard}
        walletBalance={walletBalance}
        onPlaceBid={handlePlaceBid}
        onOpenRechargeGuide={() => setIsIdCardModalOpen(true)}
      />

      <ValuationCalculatorModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
        onApplyValuationToSell={() => {}}
      />

      <CompareModal
        accounts={comparedAccounts}
        onRemove={(id) => setComparedAccounts((prev) => prev.filter((a) => a.id !== id))}
        onClear={() => setComparedAccounts([])}
        onClose={() => setIsCompareModalOpen(false)}
        onInspect={(acc) => setInspectingAccount(acc)}
        onBuy={(acc) => setBuyingAccount(acc)}
      />

      <EscrowGuideModal
        isOpen={isEscrowModalOpen}
        onClose={() => setIsEscrowModalOpen(false)}
      />

      <ChatModal
        account={chattingAccount}
        onClose={() => setChattingAccount(null)}
        onBuy={(acc) => {
          setChattingAccount(null);
          setBuyingAccount(acc);
        }}
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        walletBalance={walletBalance}
        userCard={userCard}
        adminWhatsApp={adminWhatsApp}
        onOpenIdCardModal={() => setIsIdCardModalOpen(true)}
      />

      <DigitalIdCardModal
        isOpen={isIdCardModalOpen}
        onClose={() => setIsIdCardModalOpen(false)}
        userCard={userCard}
        walletBalance={walletBalance}
        adminWhatsApp={adminWhatsApp}
        onUpdateAdminWhatsApp={(newNumber) => {
          setAdminWhatsApp(newNumber);
          try {
            localStorage.setItem('clash_admin_whatsapp', newNumber);
          } catch (e) {
            console.error(e);
          }
        }}
        onSwitchCard={handleSwitchCard}
      />

      <TagVerifierModal
        isOpen={isTagVerifierOpen}
        onClose={() => setIsTagVerifierOpen(false)}
      />

      <BaseLayoutsModal
        isOpen={isBaseLayoutsOpen}
        onClose={() => setIsBaseLayoutsOpen(false)}
      />

      <MyOrdersModal
        isOpen={isMyOrdersOpen}
        onClose={() => setIsMyOrdersOpen(false)}
        purchasedAccounts={purchasedAccounts}
      />

      {/* Secret Admin Recharge & Management Portal triggered by typing 091909 in search */}
      <AdminRechargeModal
        isOpen={isAdminRechargeOpen}
        onClose={() => setIsAdminRechargeOpen(false)}
        currentUserCard={userCard}
        currentBalance={walletBalance}
        onAddCoinsToCurrentAccount={handleAdminAddCoins}
        onOpenAddVillageModal={() => setIsAdminAddVillageOpen(true)}
      />
    </div>
  );
}
