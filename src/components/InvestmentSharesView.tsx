import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  HelpCircle, 
  CheckCircle2, 
  DollarSign, 
  Wallet, 
  RefreshCw, 
  ChevronRight, 
  Info, 
  CreditCard, 
  Flame,
  Check,
  Building2,
  Clock,
  ArrowRightLeft,
  Calculator,
  Banknote,
  BadgePercent,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { InvestmentShare, UserShareHolding, ShareOrderTransaction, UserDigitalCard } from '../types/clash';

interface InvestmentSharesViewProps {
  shares: InvestmentShare[];
  userHoldings: UserShareHolding[];
  transactions: ShareOrderTransaction[];
  walletBalance: number;
  userCard: UserDigitalCard;
  onBuyShares: (shareId: string, sharesCount: number, totalCostCoins: number) => void;
  onSellShares: (shareId: string, sharesCount: number, totalReturnCoins: number) => void;
  onClaimDividends: (shareId?: string) => void;
  onOpenRechargeModal: () => void;
}

export const InvestmentSharesView: React.FC<InvestmentSharesViewProps> = ({
  shares,
  userHoldings,
  transactions,
  walletBalance,
  userCard,
  onBuyShares,
  onSellShares,
  onClaimDividends,
  onOpenRechargeModal,
}) => {
  const [selectedShareChart, setSelectedShareChart] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'market' | 'mechanism' | 'portfolio' | 'transactions'>('market');
  
  // Buy Modal state
  const [buyingShare, setBuyingShare] = useState<InvestmentShare | null>(null);
  const [buyCount, setBuyCount] = useState<number>(1);

  // Sell Modal state
  const [sellingShare, setSellingShare] = useState<{ share: InvestmentShare; holding: UserShareHolding } | null>(null);
  const [sellCount, setSellCount] = useState<number>(1);

  // Interactive Profit Mechanism Calculator State
  const [calcShareId, setCalcShareId] = useState<string>(shares[0]?.id || 'share-qimma-escrow');
  const [calcSharesCount, setCalcSharesCount] = useState<number>(4);
  const [calcPeriodMonths, setCalcPeriodMonths] = useState<number>(1);

  // Selected share for profit calculation
  const selectedCalcShare = useMemo(() => {
    return shares.find((s) => s.id === calcShareId) || shares[0];
  }, [shares, calcShareId]);

  // Projected Return Figures
  const calcResults = useMemo(() => {
    if (!selectedCalcShare) {
      return {
        investedCoins: 0,
        dividendCoins: 0,
        capitalGrowthCoins: 0,
        totalProfitCoins: 0,
        totalEndValue: 0,
        roiPercent: 0,
      };
    }
    const investedCoins = selectedCalcShare.sharePriceCoins * calcSharesCount;
    const monthlyRate = selectedCalcShare.dividendRatePercent / 100;
    const dividendCoins = Math.round(investedCoins * monthlyRate * calcPeriodMonths);
    // Estimated ~2.5% monthly capital appreciation from store growth
    const capitalGrowthCoins = Math.round(investedCoins * (0.025 * calcPeriodMonths));
    const totalProfitCoins = dividendCoins + capitalGrowthCoins;
    const totalEndValue = investedCoins + totalProfitCoins;
    const roiPercent = investedCoins > 0 ? (totalProfitCoins / investedCoins) * 100 : 0;

    return {
      investedCoins,
      dividendCoins,
      capitalGrowthCoins,
      totalProfitCoins,
      totalEndValue,
      roiPercent,
    };
  }, [selectedCalcShare, calcSharesCount, calcPeriodMonths]);

  // Calculations for User Portfolio
  const portfolioSummary = useMemo(() => {
    let totalValue = 0;
    let totalInvested = 0;
    let totalUnclaimed = 0;
    let totalSharesCount = 0;

    userHoldings.forEach((h) => {
      const share = shares.find((s) => s.id === h.shareId);
      const currentPrice = share ? share.sharePriceCoins : h.averageBuyPrice;
      totalValue += h.sharesCount * currentPrice;
      totalInvested += h.totalInvested;
      totalUnclaimed += h.unclaimedDividends;
      totalSharesCount += h.sharesCount;
    });

    const netProfitCoins = totalValue - totalInvested;
    const returnPercent = totalInvested > 0 ? (netProfitCoins / totalInvested) * 100 : 0;

    return {
      totalValue,
      totalInvested,
      totalUnclaimed,
      totalSharesCount,
      netProfitCoins,
      returnPercent,
    };
  }, [userHoldings, shares]);

  // Chart data formatting
  const chartData = useMemo(() => {
    if (shares.length === 0) return [];
    
    // Pick historical dates from first share
    const dates = shares[0].priceHistory.map((h) => h.date);
    return dates.map((d, index) => {
      const point: any = { date: d };
      shares.forEach((s) => {
        const hist = s.priceHistory[index] || s.priceHistory[s.priceHistory.length - 1];
        point[s.symbol] = hist.price;
      });
      return point;
    });
  }, [shares]);

  const handleConfirmBuy = () => {
    if (!buyingShare) return;
    const totalCost = buyingShare.sharePriceCoins * buyCount;
    if (totalCost > walletBalance) {
      return;
    }
    onBuyShares(buyingShare.id, buyCount, totalCost);
    setBuyingShare(null);
    setBuyCount(1);
  };

  const handleConfirmSell = () => {
    if (!sellingShare) return;
    const totalReturn = sellingShare.share.sharePriceCoins * sellCount;
    onSellShares(sellingShare.share.id, sellCount, totalReturn);
    setSellingShare(null);
    setSellCount(1);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Header & Investor Value Proposition */}
      <div className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>صندوق استثمار Al-Qimma Clash الرسمي 🏛️</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2 font-serif">
              استثمر في أسهم المتجر وشارك في أرباح المبيعات والوساطة
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              اشترِ حصصاً وأسهماً استثمارية في سيولة متجر القمة باستخدام عملاتك المعتمدة. احصل على عوائد أرباح دورية ومباشرة من رسوم وساطة القرى، مع إمكانية بيع وتسييل أسهمك بالكامل في أي لحظة.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('portfolio')}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <PieChart className="w-4 h-4" />
              <span>محفظتي الاستثمارية ({portfolioSummary.totalSharesCount} سهم)</span>
            </button>
            <button
              onClick={onOpenRechargeModal}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 border border-amber-400/30 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Wallet className="w-4 h-4 text-amber-400" />
              <span>رصيدك: {walletBalance.toLocaleString()} عملة</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-stone-800">
          {/* Card 1 */}
          <div className="p-4 rounded-2xl bg-stone-950/50 border border-amber-500/20 backdrop-blur-sm">
            <span className="text-[11px] text-stone-400 block mb-1">القيمة السوقية لأسهمك</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                {portfolioSummary.totalValue.toLocaleString()}
              </span>
              <span className="text-xs text-stone-300 font-bold">عملة</span>
            </div>
            <span className="text-[10px] text-stone-400 mt-1 block">
              رأس مال مستثمر: {portfolioSummary.totalInvested.toLocaleString()} عملة
            </span>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-2xl bg-stone-950/50 border border-emerald-500/20 backdrop-blur-sm">
            <span className="text-[11px] text-stone-400 block mb-1">أرباحك الجاهزة للجني 💰</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                +{portfolioSummary.totalUnclaimed.toLocaleString()}
              </span>
              <span className="text-xs text-stone-300 font-bold">عملة</span>
            </div>
            {portfolioSummary.totalUnclaimed > 0 ? (
              <button
                onClick={() => onClaimDividends()}
                className="mt-2 w-full py-1 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-[11px] font-black cursor-pointer transition-colors shadow-xs animate-pulse flex items-center justify-center gap-1"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>إيداع الأرباح بمحفظتي الآن</span>
              </button>
            ) : (
              <span className="text-[10px] text-emerald-300/80 mt-1 block">
                توزع الأرباح آلياً مع كل صفقة وساطة
              </span>
            )}
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-2xl bg-stone-950/50 border border-amber-500/20 backdrop-blur-sm">
            <span className="text-[11px] text-stone-400 block mb-1">إجمالي الأسهم المملوكة</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">
                {portfolioSummary.totalSharesCount}
              </span>
              <span className="text-xs text-stone-300 font-bold">سهم</span>
            </div>
            <span className="text-[10px] text-amber-300 mt-1 block">
              مرتبطة ببطاقتك {userCard.cardId}
            </span>
          </div>

          {/* Card 4 */}
          <div className="p-4 rounded-2xl bg-stone-950/50 border border-amber-500/20 backdrop-blur-sm">
            <span className="text-[11px] text-stone-400 block mb-1">العائد التراكمي على الاستثمار</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-amber-300 font-mono">
                {portfolioSummary.returnPercent >= 0 ? `+${portfolioSummary.returnPercent.toFixed(1)}%` : `${portfolioSummary.returnPercent.toFixed(1)}%`}
              </span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] text-stone-400 mt-1 block">
              مقارنة بسعر الاكتتاب الأولي
            </span>
          </div>
        </div>

        {/* Mechanism Callout Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-400 text-stone-950 font-bold shrink-0">
              <Calculator className="w-4 h-4" />
            </span>
            <div>
              <span className="font-bold text-amber-200 block text-sm">كيف تنزل الأرباح وتستلمها في محفظتك؟</span>
              <span className="text-stone-300 text-xs">
                شرح تفصيلي لدورة الأرباح الحقيقية من عمولات الوساطة ومزادات كلاش مع حاسبة عوائد تفاعلية فورية.
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('mechanism')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 font-black text-xs cursor-pointer shadow-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>عرض آلية الأرباح والحاسبة</span>
            <span>←</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('market')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'market'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>سوق الأسهم المتاحة</span>
        </button>

        <button
          onClick={() => setActiveTab('mechanism')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'mechanism'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>آلية الأرباح والحاسبة 🧮</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-800 text-[10px] font-bold">
            شرح تفصيلي
          </span>
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'portfolio'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>محفظتي الاستثمارية</span>
          {portfolioSummary.totalSharesCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-stone-900 text-amber-300 text-[10px] font-mono">
              {portfolioSummary.totalSharesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'transactions'
              ? 'bg-amber-500 text-stone-950 shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>سجل العمليات الاستثمارية</span>
          <span className="text-[10px] text-stone-500 font-mono">({transactions.length})</span>
        </button>
      </div>

      {/* Main Tab 1: Available Shares Market */}
      {activeTab === 'market' && (
        <div className="space-y-8">
          {/* Share Performance Recharts Chart */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  <span>تطور أسعار أسهم الصناديق الاستثمارية (Recharts)</span>
                </h3>
                <span className="text-xs text-stone-500">
                  مقارنة أداء ونمو أسعار الأسهم الثلاثة المعتمدة خلال الـ 30 يوماً الماضية
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500">الرمز:</span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-mono font-bold border border-amber-200">
                  QIMMA (صندوق الوساطة)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 font-mono font-bold border border-emerald-200">
                  CHAMP (المزادات)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 font-mono font-bold border border-purple-200">
                  LEGEND (الأساطير)
                </span>
              </div>
            </div>

            <div className="h-[280px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorQimma" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorChamp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorLegend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                  <XAxis dataKey="date" tick={{ fill: '#78716c', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#78716c', fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      return (
                        <div className="bg-stone-900 text-white p-3 rounded-xl shadow-xl text-xs text-right border border-stone-700 font-sans">
                          <p className="font-bold text-amber-400 mb-1 border-b border-stone-800 pb-1">{label}</p>
                          {payload.map((entry: any, i: number) => (
                            <div key={i} className="flex items-center justify-between gap-4 py-0.5">
                              <span className="text-stone-300 font-mono">{entry.name}:</span>
                              <span className="font-bold font-mono text-white">{entry.value} عملة</span>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="QIMMA"
                    name="QIMMA (صندوق الوساطة)"
                    stroke="#d97706"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorQimma)"
                  />
                  <Area
                    type="monotone"
                    dataKey="CHAMP"
                    name="CHAMP (المزادات)"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorChamp)"
                  />
                  <Area
                    type="monotone"
                    dataKey="LEGEND"
                    name="LEGEND (الأساطير)"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorLegend)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Investment Shares Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shares.map((share) => {
              const userHolding = userHoldings.find((h) => h.shareId === share.id);
              const priceChange = ((share.sharePriceCoins - share.previousPriceCoins) / share.previousPriceCoins) * 100;
              const soldShares = share.totalShares - share.availableShares;
              const soldPercent = Math.round((soldShares / share.totalShares) * 100);

              return (
                <div
                  key={share.id}
                  className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:border-amber-400/80 transition-all group"
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-300/80 inline-block mb-1.5">
                          {share.badge}
                        </span>
                        <h4 className="text-lg font-black text-stone-900 tracking-tight group-hover:text-amber-800 transition-colors">
                          {share.title}
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-stone-900 text-amber-300 font-mono font-bold text-xs shadow-xs border border-amber-400/30">
                        {share.symbol}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed mb-4">
                      {share.description}
                    </p>

                    {/* Price and Return Metric Box */}
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-stone-500 font-medium">سعر السهم الحالي:</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-stone-900 font-mono">
                            {share.sharePriceCoins.toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-amber-800">عملة</span>
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center mr-1">
                            +{priceChange.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200">
                        <span className="text-stone-500 font-medium">عائد الأرباح الدوري:</span>
                        <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300">
                          +{share.dividendRatePercent}% {share.dividendPeriodLabel}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar of Shares */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                        <span>الأسهم المكتتبة:</span>
                        <span className="font-mono font-bold text-stone-800">
                          {soldShares.toLocaleString()} / {share.totalShares.toLocaleString()} ({soldPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all"
                          style={{ width: `${soldPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Backed By Tag */}
                    <div className="flex items-start gap-1.5 text-[11px] text-stone-600 mb-6 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60">
                      <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-amber-950 font-semibold">الأصول الضامنة:</strong> {share.backedBy}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    {userHolding && userHolding.sharesCount > 0 && (
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs mb-2">
                        <span className="text-amber-900 font-medium">أنت تملك في هذا السهم:</span>
                        <span className="font-bold text-stone-900 font-mono">
                          {userHolding.sharesCount} سهم ({(userHolding.sharesCount * share.sharePriceCoins).toLocaleString()} عملة)
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setBuyingShare(share);
                        setBuyCount(1);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Coins className="w-4 h-4 text-amber-400" />
                      <span>شراء واكتتاب أسهم</span>
                    </button>

                    {userHolding && userHolding.sharesCount > 0 && (
                      <button
                        onClick={() => {
                          setSellingShare({ share, holding: userHolding });
                          setSellCount(1);
                        }}
                        className="w-full py-2 px-4 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>تسييل واسترداد العملات</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Investment Trust & Protection Protocol */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              <span>ميثاق أمان واستثمار Al-Qimma Clash</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600">
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200">
                <span className="font-bold text-stone-900 text-sm block mb-1.5">1. عوائد حقيقية من الوساطة</span>
                <p className="leading-relaxed">
                  لا نعتمد على مضاربات وهمية؛ تصرف أرباح الأسهم كنسبة مباشرة من عمولات التحويل المعتمدة ورسوم بيع قاعات المدينة ومزادات الحسابات المنفذة يومياً.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200">
                <span className="font-bold text-stone-900 text-sm block mb-1.5">2. تسييل فوري 100%</span>
                <p className="leading-relaxed">
                  يحق لأي مستثمر بيع أسهمه في أي ثانية واسترداد كامل قيمة السهم السوقية الحالية كعملات معتمدة تودع فوراً في محفظته الشخصية دون تأخير.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200">
                <span className="font-bold text-stone-900 text-sm block mb-1.5">3. ربط بالهوية الدائمة</span>
                <p className="leading-relaxed">
                  تسجل شهادات الأسهم برقم بطاقتك الدائمة ({userCard.cardId}) وتضمن عدم ضياع أي حصة استثمارية حتى في حال تغيير المتصفح أو إعادة الدخول.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: Profit Mechanism & Interactive Calculator */}
      {activeTab === 'mechanism' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-100/50 to-orange-500/10 border border-amber-300 rounded-3xl p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-stone-900 text-amber-300 text-xs font-bold inline-block mb-2">
                  دليل المستثمر الشفاف 🏛️
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-serif">
                  آلية تحقيق واستلام الأرباح من أسهم Al-Qimma Clash
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
                  تعتمد منظومتنا على عوائد حقيقية ومستدامة مشتقة مباشرة من حركة بيع وشراء قريات كلاش ورسوم الوساطة والمزادات اليومية، دون مضاربات وهمية.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs shadow-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>تسييل فوري 100% في أي وقت</span>
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Profit Simulator & Calculator Tool */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-stone-200">
              <div>
                <h4 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-amber-600" />
                  <span>حاسبة ومحاكي عوائد الأرباح التفاعلي</span>
                </h4>
                <p className="text-xs text-stone-500">
                  احسب أرباحك وعوائدك التقديرية بالعملات قبل الاكتتاب حسب نوع السهم والمدة
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                حساب آلي فوري ⚡
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Interactive Inputs (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Input 1: Choose Share */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-2">
                    1. اختر الصندوق أو السهم المراد الاستثمار به:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {shares.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setCalcShareId(s.id)}
                        className={`p-3 rounded-2xl text-right border transition-all cursor-pointer flex flex-col justify-between ${
                          calcShareId === s.id
                            ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono font-bold text-xs text-stone-900">{s.symbol}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                            +{s.dividendRatePercent}%
                          </span>
                        </div>
                        <span className="text-xs font-bold text-stone-900 line-clamp-1">{s.title}</span>
                        <span className="text-[11px] font-mono text-stone-500 mt-1">
                          {s.sharePriceCoins.toLocaleString()} عملة / سهم
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input 2: Number of Shares */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-stone-800">2. حدد عدد الأسهم المراد شراؤها:</label>
                    <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-lg">
                      {calcSharesCount} {calcSharesCount === 1 ? 'سهم واحد' : 'أسهم'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCalcSharesCount((c) => Math.max(1, c - 1))}
                      className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-lg flex items-center justify-center cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={calcSharesCount}
                      onChange={(e) => setCalcSharesCount(parseInt(e.target.value) || 1)}
                      className="flex-1 accent-amber-500 cursor-pointer"
                    />
                    <button
                      onClick={() => setCalcSharesCount((c) => Math.min(50, c + 1))}
                      className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-lg flex items-center justify-center cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>
                  {/* Quick Select Buttons */}
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    {[1, 2, 5, 10, 20, 40].map((num) => (
                      <button
                        key={num}
                        onClick={() => setCalcSharesCount(num)}
                        className={`flex-1 py-1 rounded-lg border font-mono transition-colors cursor-pointer ${
                          calcSharesCount === num
                            ? 'bg-stone-900 text-amber-300 border-stone-900 font-bold'
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                        }`}
                      >
                        {num} سهم
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input 3: Duration */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-2">3. حدد مدة الاحتفاظ بالأسهم:</label>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {[
                      { months: 1, label: 'شهر واحد' },
                      { months: 3, label: '3 أشهر' },
                      { months: 6, label: '6 أشهر' },
                      { months: 12, label: 'سنة كاملة' },
                    ].map((item) => (
                      <button
                        key={item.months}
                        onClick={() => setCalcPeriodMonths(item.months)}
                        className={`py-2 px-1 text-center rounded-xl border font-bold transition-all cursor-pointer ${
                          calcPeriodMonths === item.months
                            ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-xs'
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Calculated Yield Results (5 cols) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-white p-6 rounded-3xl border border-amber-500/30 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
                    <span className="text-xs text-amber-300 font-bold">العائد التقديري الإجمالي</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-[11px] font-bold">
                      +{calcResults.roiPercent.toFixed(1)}% ربح صافي
                    </span>
                  </div>

                  {/* Main Profit Display */}
                  <div className="mb-5 text-right">
                    <span className="text-[11px] text-stone-400 block mb-1">صافي الأرباح المتوقعة لحسابك:</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                        +{calcResults.totalProfitCoins.toLocaleString()}
                      </span>
                      <span className="text-sm font-bold text-amber-200">عملة</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 mt-1 block">
                      جاهزة للجني التلقائي على مدار {calcPeriodMonths} {calcPeriodMonths === 1 ? 'شهر' : 'أشهر'}
                    </span>
                  </div>

                  {/* Breakdown Box */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-stone-950/60 border border-amber-500/20 text-xs mb-4">
                    <div className="flex items-center justify-between text-stone-300">
                      <span>رأس المال المطلوب للاكتتاب:</span>
                      <span className="font-mono font-bold text-white">{calcResults.investedCoins.toLocaleString()} عملة</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>أرباح عمولات الوساطة الدورية:</span>
                      <span className="font-mono font-bold">+{calcResults.dividendCoins.toLocaleString()} عملة</span>
                    </div>
                    <div className="flex items-center justify-between text-amber-300">
                      <span>النمو الرأسمالي التقديري لسعر السهم:</span>
                      <span className="font-mono font-bold">+{calcResults.capitalGrowthCoins.toLocaleString()} عملة</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-stone-200 font-bold">
                      <span>إجمالي القيمة المستقبلية لمحفظتك:</span>
                      <span className="font-mono text-amber-400 text-sm">{calcResults.totalEndValue.toLocaleString()} عملة</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <button
                  onClick={() => {
                    if (selectedCalcShare) {
                      setBuyingShare(selectedCalcShare);
                      setBuyCount(calcSharesCount);
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Coins className="w-4 h-4" />
                  <span>اكتتب وشراء {calcSharesCount} سهم في {selectedCalcShare?.symbol} الآن</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4-Step Visual Flowchart: How Profits Flow */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-xs">
            <h4 className="text-base font-bold text-stone-900 mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <span>دورة تدفق وتوزيع الأرباح التلقائية (4 خطوات واضحة)</span>
            </h4>
            <p className="text-xs text-stone-500 mb-6">
              كيف تنتقل أرباح صفقات المتجر اليومية خطوة بخطوة إلى بطاقتك الشخصية:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-black flex items-center justify-center text-xs mb-3 font-mono">
                    01
                  </div>
                  <h5 className="font-bold text-stone-900 text-sm mb-1.5">الشحن والاكتتاب بالهوية</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    تشحن عملاتك عبر المشرف بالواتساب، وتشتري أسهم الصندوق الذي تختاره؛ يتم تسجيل الأسهم آلياً برقم بطاقتك الدائمة ({userCard.cardId}).
                  </p>
                </div>
                <span className="text-[10px] text-amber-800 font-bold mt-3 block">وثيقة ملكية رقمية فورية</span>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-black flex items-center justify-center text-xs mb-3 font-mono">
                    02
                  </div>
                  <h5 className="font-bold text-stone-900 text-sm mb-1.5">مبيعات الوساطة والمزادات</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    يومياً يتم بيع قريات تاون 13 إلى 17 وتنفذ مزادات علنية في التطبيق مع اقتطاع رسوم وساطة آمنة بنسبة 5% إلى 8% من كل صفقة ناجحة.
                  </p>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold mt-3 block">سيولة وتدفق مالي حقيقي</span>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 font-black flex items-center justify-center text-xs mb-3 font-mono">
                    03
                  </div>
                  <h5 className="font-bold text-stone-900 text-sm mb-1.5">التوزيع الآلي للأرباح</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    يقوم نظام Al-Qimma Clash تلقائياً باقتطاع حصة المساهمين وتحويلها مباشرة إلى عداد أرباحك في خانة "أرباحك الجاهزة للجني 💰".
                  </p>
                </div>
                <span className="text-[10px] text-amber-800 font-bold mt-3 block">توزيعات دورية منتظمة</span>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-950 border border-emerald-300 font-black flex items-center justify-center text-xs mb-3 font-mono">
                    04
                  </div>
                  <h5 className="font-bold text-stone-900 text-sm mb-1.5">جني الأرباح والتسييل</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    تضغط زر "جني الأرباح" لتودع العملات في بطاقتك مباشرة؛ يمكنك شراء قريات بها، أو سحبها كاش عبر المشرف بالواتساب، أو تسييل الأسهم واسترجاع رأس المال.
                  </p>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold mt-3 block">حرية تامة وسحب لحظي</span>
              </div>
            </div>
          </div>

          {/* The 4 Real Profit Sources (Where the Money Comes From) */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-xs">
            <h4 className="text-base font-bold text-stone-900 mb-2 flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-600" />
              <span>مصادر الأرباح الأربعة الحقيقية في متجر Al-Qimma Clash</span>
            </h4>
            <p className="text-xs text-stone-500 mb-6">
              كيف يولد المتجر هذه العوائد؟ إليك مصادر الدخل التشغيلية التي تضمن أرباحك:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Source 1 */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-stone-900 mb-1">1. رسوم وساطة مبيعات القرى المعتمدة</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    المتجر يتقاضى عمولة وساطة قانونية لتأمين عمليات بيع وشراء الحسابات، ويخصص 40% من إجمالي هذه الرسوم مباشرة إلى صندوق مساهمي سهم QIMMA.
                  </p>
                </div>
              </div>

              {/* Source 2 */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-stone-900 mb-1">2. فوارق سومات ومزايدات المزادات الحية</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    قسم المزادات يطرح قريات تاون 17 و 16 ماكس النادرة؛ الفارق الإيجابي بين السعر الافتتاحي والسعر النهائي عند الشراء يوزع جزء منه على حاملي سهم CHAMP.
                  </p>
                </div>
              </div>

              {/* Source 3 */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-stone-900 mb-1">3. نمو القيمة السوقية للسهم (Capital Gain)</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    مع ازدياد شعبية المتجر والطلب على العملات، ترتفع القيمة السوقية للسهم نفسه، فيستطيع المستثمر بيع السهم بسعر أعلى من سعر الشراء وجني فارق السعر.
                  </p>
                </div>
              </div>

              {/* Source 4 */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-stone-900 mb-1">4. خدمات فحص وتثمين وتوثيق Supercell ID</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    عوائد فحص تاغات القرى وتثمين الحسابات وخدمات نقل البريد السريع المدفوعة تصب كعائد إضافي لرفع توزيعات الأسهم.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Withdraw & Use Your Profits */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-xs">
            <h4 className="text-base font-bold text-stone-900 mb-2 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-emerald-700" />
              <span>خيارات استلام وسحب واستخدام أرباحك</span>
            </h4>
            <p className="text-xs text-stone-500 mb-6">
              بمجرد ضغطك على "جني الأرباح"، تودع العملات في بطاقتك وتكون لك الحرية الكاملة في اختيار طريقة التصرف بها:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200">
                <span className="font-bold text-stone-900 text-sm block mb-1">1. شراء قريات كلاش</span>
                <p className="text-stone-600 leading-relaxed">
                  يمكنك استخدام الأرباح المودعة في بطاقتك لشراء أي قرية تاون 14 أو 15 أو 16 أو 17 من المتجر مباشرة دون دفع أي مليم إضافي.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200">
                <span className="font-bold text-stone-900 text-sm block mb-1">2. استلام كاش بالواتساب</span>
                <p className="text-stone-600 leading-relaxed">
                  تواصل مع المشرف عبر الواتساب وأرسل رقم بطاقتك، ليقوم بتحويل قيمة أرباحك كاش إلى زين كاش، آسيابوالة، أو تحويل بنكي فوري.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200">
                <span className="font-bold text-stone-900 text-sm block mb-1">3. مضاعفة الاستثمار المركب</span>
                <p className="text-stone-600 leading-relaxed">
                  أعد استثمار الأرباح المستلمة في شراء أسهم جديدة لرفع حصتك الشهرية ومضاعفة العائد التراكمي في الأشهر القادمة.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200">
                <span className="font-bold text-stone-900 text-sm block mb-1">4. تسييل رأس المال 100%</span>
                <p className="text-stone-600 leading-relaxed">
                  يمكنك في أي وقت بيع أسهمك واسترداد كامل رأس مالك فورياً بدون أي قيود، شروط جزائية، أو فترة حجز إجبارية.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 3: User Portfolio */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
            <div>
              <h3 className="text-lg font-black text-stone-900">سجل شهادات استثمارك الخاصة</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                قائمة الأسهم والمحافظ المكتتب بها المرتبطة ببطاقتك <span className="font-mono font-bold text-stone-800">{userCard.cardId}</span>
              </p>
            </div>
            {portfolioSummary.totalUnclaimed > 0 && (
              <button
                onClick={() => onClaimDividends()}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all animate-bounce"
              >
                <Coins className="w-4 h-4" />
                <span>جني أرباح جميع الأسهم (+{portfolioSummary.totalUnclaimed.toLocaleString()} عملة)</span>
              </button>
            )}
          </div>

          {userHoldings.length > 0 && userHoldings.some((h) => h.sharesCount > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userHoldings
                .filter((h) => h.sharesCount > 0)
                .map((holding) => {
                  const share = shares.find((s) => s.id === holding.shareId);
                  if (!share) return null;
                  const currentValue = holding.sharesCount * share.sharePriceCoins;
                  const profitCoins = currentValue - holding.totalInvested;
                  const profitPercent = holding.totalInvested > 0 ? (profitCoins / holding.totalInvested) * 100 : 0;

                  return (
                    <div
                      key={holding.shareId}
                      className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 rounded-xl bg-stone-900 text-amber-300 font-mono font-bold text-xs">
                            {share.symbol}
                          </span>
                          <span className="text-xs font-bold text-stone-500">
                            {holding.sharesCount} سهم مملوك
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-stone-900 mb-4">{share.title}</h4>

                        <div className="space-y-2.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-stone-500">القيمة السوقية الآن:</span>
                            <span className="font-mono font-bold text-stone-900">
                              {currentValue.toLocaleString()} عملة
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-500">إجمالي المبلغ المستثمر:</span>
                            <span className="font-mono text-stone-700">
                              {holding.totalInvested.toLocaleString()} عملة
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-stone-500">متوسط سعر الشراء:</span>
                            <span className="font-mono text-stone-700">
                              {holding.averageBuyPrice.toLocaleString()} عملة / سهم
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                            <span className="text-stone-500">صافي نمو القيمة:</span>
                            <span className={`font-mono font-bold ${profitCoins >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {profitCoins >= 0 ? `+${profitCoins.toLocaleString()}` : profitCoins.toLocaleString()} عملة ({profitPercent.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-stone-200 bg-emerald-50/60 -mx-3.5 -mb-3.5 p-3 rounded-b-2xl">
                            <span className="text-emerald-900 font-bold">أرباح غير مجنية:</span>
                            <span className="font-mono font-black text-emerald-700 text-sm">
                              +{holding.unclaimedDividends.toLocaleString()} عملة
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-stone-100">
                        {holding.unclaimedDividends > 0 && (
                          <button
                            onClick={() => onClaimDividends(holding.shareId)}
                            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
                          >
                            <Coins className="w-3.5 h-3.5" />
                            <span>جني أرباح هذا السهم (+{holding.unclaimedDividends} عملة)</span>
                          </button>
                        )}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setBuyingShare(share);
                              setBuyCount(1);
                            }}
                            className="flex-1 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs transition-colors cursor-pointer text-center"
                          >
                            زيادة الاستثمار
                          </button>
                          <button
                            onClick={() => {
                              setSellingShare({ share, holding });
                              setSellCount(1);
                            }}
                            className="flex-1 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs transition-colors cursor-pointer text-center"
                          >
                            بيع وتسييل
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="py-16 text-center bg-white border border-dashed border-stone-300 rounded-3xl p-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3">
                <PieChart className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-1">لا توجد أسهم في محفظتك حالياً</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
                ابدأ رحلتك الاستثمارية بالاكتتاب في أحد صناديق متجر القمة الثلاثة واستلم أرباحاً دورية على محفظتك.
              </p>
              <button
                onClick={() => setActiveTab('market')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer shadow-xs transition-colors"
              >
                تصفح الأسهم المتاحة للاكتتاب
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Tab 3: Investor Transaction History */}
      {activeTab === 'transactions' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900">سجل حركات الاستثمار وتوزيعات الأرباح</h3>
              <span className="text-xs text-stone-500">كافة عمليات الشراء، التسييل، واستلام الأرباح المسجلة</span>
            </div>
            <span className="text-xs text-stone-500 font-mono">
              إجمالي السجلات: {transactions.length}
            </span>
          </div>

          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-semibold">
                    <th className="py-3 px-3">نوع الحركة</th>
                    <th className="py-3 px-3">السهم / الصندوق</th>
                    <th className="py-3 px-3">عدد الأسهم</th>
                    <th className="py-3 px-3">المبلغ بالعملات</th>
                    <th className="py-3 px-3">التاريخ والوقت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        {tx.type === 'buy' && (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold inline-flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-amber-700" />
                            <span>شراء واكتتاب</span>
                          </span>
                        )}
                        {tx.type === 'sell' && (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-900 font-bold inline-flex items-center gap-1">
                            <ArrowRightLeft className="w-3 h-3 text-rose-700" />
                            <span>تسييل وبيع</span>
                          </span>
                        )}
                        {tx.type === 'dividend_claim' && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold inline-flex items-center gap-1">
                            <Coins className="w-3 h-3 text-emerald-700" />
                            <span>استلام أرباح دورية</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-stone-900">{tx.shareTitle}</td>
                      <td className="py-3.5 px-3 font-mono text-stone-700">{tx.shares > 0 ? `${tx.shares} سهم` : '-'}</td>
                      <td className="py-3.5 px-3 font-mono font-bold">
                        <span className={tx.type === 'buy' ? 'text-stone-900' : 'text-emerald-600'}>
                          {tx.type === 'buy' ? `-${tx.amountCoins.toLocaleString()}` : `+${tx.amountCoins.toLocaleString()}`} عملة
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-stone-500 font-mono">{tx.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-stone-500">
              لم تسجل أي حركة استثمارية حتى الآن.
            </div>
          )}
        </div>
      )}

      {/* Interactive Buy Share Modal */}
      {buyingShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl text-right">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900">شراء واكتتاب أسهم</h3>
                <span className="text-xs text-stone-500">{buyingShare.title} ({buyingShare.symbol})</span>
              </div>
              <button
                onClick={() => setBuyingShare(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 mb-4 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-amber-900 font-medium">سعر السهم الواحد:</span>
                <span className="font-mono font-bold text-stone-900">{buyingShare.sharePriceCoins.toLocaleString()} عملة</span>
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-amber-900 font-medium">عائد الأرباح:</span>
                <span className="font-bold text-emerald-700">+{buyingShare.dividendRatePercent}% ({buyingShare.dividendPeriodLabel})</span>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-amber-200/60">
                <span className="text-amber-900 font-medium">رصيدك المتاح:</span>
                <span className="font-mono font-bold text-amber-950">{walletBalance.toLocaleString()} عملة</span>
              </div>
            </div>

            {/* Shares Quantity Counter */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-stone-800 mb-2">حدد عدد الأسهم المطلوبة:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBuyCount((c) => Math.max(1, c - 1))}
                  className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-lg flex items-center justify-center cursor-pointer transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={Math.min(buyingShare.availableShares, Math.floor(walletBalance / buyingShare.sharePriceCoins) || 1)}
                  value={buyCount}
                  onChange={(e) => setBuyCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-stone-300 text-center font-mono font-bold text-stone-900 text-lg outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => setBuyCount((c) => c + 1)}
                  className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-lg flex items-center justify-center cursor-pointer transition-colors"
                >
                  +
                </button>
              </div>

              {/* Fast buttons */}
              <div className="flex items-center gap-2 mt-2 text-xs">
                {[1, 2, 5, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setBuyCount(num)}
                    className="flex-1 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 font-mono text-stone-700 cursor-pointer"
                  >
                    {num} سهم
                  </button>
                ))}
              </div>
            </div>

            {/* Calculation summary */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 mb-5 text-xs">
              <div className="flex items-center justify-between text-stone-700 font-bold">
                <span>المبلغ الإجمالي المطلوب خصمه:</span>
                <span className="font-mono font-black text-amber-900 text-base">
                  {(buyingShare.sharePriceCoins * buyCount).toLocaleString()} عملة
                </span>
              </div>
              {buyingShare.sharePriceCoins * buyCount > walletBalance && (
                <div className="mt-2 text-[11px] text-rose-600 font-bold flex items-center gap-1">
                  <span>⚠️ رصيدك الحالي غير كافٍ. يمكنك شحن بطاقتك عبر المشرف بالواتساب.</span>
                </div>
              )}
            </div>

            {/* Confirm button */}
            {buyingShare.sharePriceCoins * buyCount <= walletBalance ? (
              <button
                onClick={handleConfirmBuy}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs sm:text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>تأكيد الشراء والاكتتاب فورياً</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setBuyingShare(null);
                  onOpenRechargeModal();
                }}
                className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4 text-amber-400" />
                <span>شحن العملات عبر المشرف بالواتساب</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Interactive Sell / Liquidate Share Modal */}
      {sellingShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl text-right">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900">تسييل وبيع أسهم</h3>
                <span className="text-xs text-stone-500">{sellingShare.share.title} ({sellingShare.share.symbol})</span>
              </div>
              <button
                onClick={() => setSellingShare(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 mb-4 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-stone-600">الأسهم التي تملكها:</span>
                <span className="font-mono font-bold text-stone-900">{sellingShare.holding.sharesCount} سهم</span>
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-stone-600">سعر البيع والاسترداد للسهم:</span>
                <span className="font-mono font-bold text-emerald-700">{sellingShare.share.sharePriceCoins.toLocaleString()} عملة</span>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-stone-200">
                <span className="text-stone-600">رسوم التسييل:</span>
                <span className="font-bold text-emerald-700">0 عملة (مجاني 100%)</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-stone-800 mb-2">حدد عدد الأسهم المراد تسييلها:</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSellCount((c) => Math.max(1, c - 1))}
                  className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-lg flex items-center justify-center cursor-pointer transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={sellingShare.holding.sharesCount}
                  value={sellCount}
                  onChange={(e) => setSellCount(Math.min(sellingShare.holding.sharesCount, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-stone-300 text-center font-mono font-bold text-stone-900 text-lg outline-none focus:border-rose-500"
                />
                <button
                  onClick={() => setSellCount((c) => Math.min(sellingShare.holding.sharesCount, c + 1))}
                  className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-lg flex items-center justify-center cursor-pointer transition-colors"
                >
                  +
                </button>
              </div>

              <div className="flex items-center gap-2 mt-2 text-xs">
                <button
                  onClick={() => setSellCount(1)}
                  className="flex-1 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 font-mono text-stone-700 cursor-pointer"
                >
                  1 سهم
                </button>
                <button
                  onClick={() => setSellCount(sellingShare.holding.sharesCount)}
                  className="flex-1 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 font-mono text-rose-800 font-bold cursor-pointer"
                >
                  كامل الأسهم ({sellingShare.holding.sharesCount})
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 mb-5 text-xs">
              <div className="flex items-center justify-between text-emerald-900 font-bold">
                <span>المبلغ المسترد لمساعدتك في المحفظة:</span>
                <span className="font-mono font-black text-emerald-700 text-base">
                  +{(sellingShare.share.sharePriceCoins * sellCount).toLocaleString()} عملة
                </span>
              </div>
              <span className="text-[11px] text-emerald-800 mt-1 block">
                سيتم إيداع المبلغ فوراً في بطاقتك ويمكنك استخدامه في شراء القرى أو سحبه.
              </span>
            </div>

            <button
              onClick={handleConfirmSell}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>تأكيد بيع {sellCount} سهم واستلام العملات</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
