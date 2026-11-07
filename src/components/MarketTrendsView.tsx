import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Flame, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  HelpCircle, 
  Filter, 
  Calendar, 
  ShoppingBag,
  Award,
  Zap,
  BarChart3,
  LineChart as LineChartIcon,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import {
  MONTHLY_PRICE_HISTORY,
  TOWNHALL_MARKET_STATS,
  PRICE_DISTRIBUTION,
  MARKET_INSIGHTS,
  WeeklyTrendPoint,
  TownHallMarketStats
} from '../data/marketPriceTrends';

interface MarketTrendsViewProps {
  onSelectTownHallFilter?: (th: number) => void;
  onOpenCalculator?: () => void;
}

export const MarketTrendsView: React.FC<MarketTrendsViewProps> = ({
  onSelectTownHallFilter,
  onOpenCalculator,
}) => {
  const [selectedTownHallTab, setSelectedTownHallTab] = useState<'all' | '17' | '16' | '15' | '14' | '13'>('all');
  const [chartMetric, setChartMetric] = useState<'price' | 'volume'>('price');

  // Deal Evaluator Calculator State
  const [evalTH, setEvalTH] = useState<number>(16);
  const [evalCoinsInput, setEvalCoinsInput] = useState<string>('8500');

  // Colors config
  const TH_COLORS: Record<string, string> = {
    th17: '#b45309', // amber-700
    th16: '#f59e0b', // amber-500
    th15: '#10b981', // emerald-500
    th14: '#3b82f6', // blue-500
    th13: '#8b5cf6', // purple-500
    allAverage: '#78350f', // amber-900
  };

  // Custom Tooltip for Area and Line charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-900/95 text-white p-3 rounded-xl border border-amber-400/40 shadow-xl backdrop-blur-md text-right text-xs space-y-1.5 font-sans min-w-[200px]">
          <div className="flex items-center justify-between pb-1.5 border-b border-stone-800 font-bold text-amber-300">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{label}</span>
            </span>
            <span className="text-[10px] text-stone-400">آخر 30 يوماً</span>
          </div>

          {payload.map((entry: any, index: number) => {
            const isPrice = chartMetric === 'price';
            return (
              <div key={`tooltip-${index}`} className="flex items-center justify-between gap-3 py-0.5">
                <span className="flex items-center gap-1.5 text-stone-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span>{entry.name}:</span>
                </span>
                <span className="font-mono font-bold text-white flex items-center gap-1">
                  <span>{entry.value.toLocaleString()}</span>
                  <span className="text-[10px] text-amber-300">{isPrice ? 'عملة' : 'حساب'}</span>
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Calculation for the Deal Evaluator
  const dealEvaluation = useMemo(() => {
    const val = parseInt(evalCoinsInput, 10);
    if (isNaN(val) || val <= 0) return null;
    const stats = TOWNHALL_MARKET_STATS.find((s) => s.townHall === evalTH);
    if (!stats) return null;

    const diff = stats.currentAvgPrice - val;
    const diffPercentage = Math.round((diff / stats.currentAvgPrice) * 100);

    let status: 'steal' | 'fair' | 'high';
    let message = '';
    let colorClass = '';

    if (diffPercentage >= 10) {
      status = 'steal';
      message = `صفقة ذهبية رابحة جداً! السعر أقل من متوسط السوق بنسبة ${diffPercentage}% (وفرت ${diff.toLocaleString()} عملة).`;
      colorClass = 'bg-emerald-50 text-emerald-900 border-emerald-300';
    } else if (diffPercentage >= -5 && diffPercentage < 10) {
      status = 'fair';
      message = 'سعر عادل ومنطقي جداً ومطابق للمعدل السعري المعتمد في سوق كلاش.';
      colorClass = 'bg-amber-50 text-amber-900 border-amber-300';
    } else {
      status = 'high';
      message = `السعر أعلى من المتوسط بنسبة ${Math.abs(diffPercentage)}%. تأكد من وجود معدات ماكس أو سكنات حصرية تبرر هذه الزيادة.`;
      colorClass = 'bg-orange-50 text-orange-950 border-orange-300';
    }

    return {
      status,
      diff,
      diffPercentage,
      message,
      colorClass,
      avg: stats.currentAvgPrice,
    };
  }, [evalTH, evalCoinsInput]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-right font-sans">
      {/* Top Hero Banner for Market Price Index */}
      <div className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>مؤشر Al-Qimma Clash الرسمي للأسعار · تحديث الشهر الماضي</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              حركة وتطور أسعار قرى كلاش أوف كلانس
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              رسوم بيانية حية وتحليلات موثوقة لحركة العرض والطلب خلال الـ 30 يوماً الماضية، لمساعدتك على اقتناص الصفقات والشراء بأفضل سعر قبل نفاد الحسابات.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenCalculator && (
              <button
                type="button"
                onClick={onOpenCalculator}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>حاسبة تثمين قريتك</span>
              </button>
            )}
            <a
              href="#smart-deal-checker"
              className="px-4 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-bold transition-colors cursor-pointer"
            >
              فحص جودة صفقتك ↓
            </a>
          </div>
        </div>

        {/* 4 Quick Market Key Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-stone-800/80">
          <div className="p-3.5 bg-stone-850/80 rounded-2xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block mb-1">متوسط سعر السوق العام:</span>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-xl sm:text-2xl font-black text-amber-400">7,630</span>
              <span className="text-xs text-amber-200 font-sans">عملة</span>
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1 font-bold">
              <ArrowDownRight className="w-3 h-3 text-emerald-400" />
              <span>هبوط -2.1% (فرصة شراء للمستخدم)</span>
            </span>
          </div>

          <div className="p-3.5 bg-stone-850/80 rounded-2xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block mb-1">الصفقات المكتملة الشهر الماضي:</span>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-xl sm:text-2xl font-black text-white">387</span>
              <span className="text-xs text-stone-300 font-sans">قرية مباعة</span>
            </div>
            <span className="text-[10px] text-stone-400 flex items-center gap-0.5 mt-1 font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>موثقة بالوساطة والختم الملكي</span>
            </span>
          </div>

          <div className="p-3.5 bg-stone-850/80 rounded-2xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block mb-1">أقوى فئة طلباً وصعوداً:</span>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-xl sm:text-2xl font-black text-amber-300">TH 17</span>
              <span className="text-xs text-rose-400 font-bold font-sans">+7.9%</span>
            </div>
            <span className="text-[10px] text-amber-300/90 flex items-center gap-0.5 mt-1 font-bold">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>تصفيات دوري الأساطير</span>
            </span>
          </div>

          <div className="p-3.5 bg-stone-850/80 rounded-2xl border border-stone-800">
            <span className="text-[11px] text-stone-400 block mb-1">أفضل فرصة شراء (أقل سعر):</span>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">TH 15 & 16</span>
              <span className="text-xs text-emerald-400 font-bold font-sans">-10.3%</span>
            </div>
            <span className="text-[10px] text-emerald-300 flex items-center gap-0.5 mt-1 font-bold">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>أنسب توقيت للشراء حالياً</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="p-5 sm:p-7 bg-white border border-stone-200 rounded-3xl shadow-xs space-y-6">
        {/* Controls Bar for Chart */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-5 border-b border-stone-200">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-stone-900 flex items-center gap-2">
              <LineChartIcon className="w-5 h-5 text-amber-600" />
              <span>الرسم البياني لتطور الأسعار خلال الشهر الماضي (Recharts)</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              يعرض المسار السعري بالعملات عبر 5 نقاط زمنية مقاسة أسبوعياً على مدار الـ 30 يوماً الماضية
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Metric Toggle */}
            <div className="flex p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => setChartMetric('price')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  chartMetric === 'price'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                متوسط السعر (عملات)
              </button>
              <button
                type="button"
                onClick={() => setChartMetric('volume')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  chartMetric === 'volume'
                    ? 'bg-white text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                حجم المبيعات (قرى)
              </button>
            </div>

            {/* Town Hall Selector Tabs */}
            <div className="flex flex-wrap p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs font-mono font-bold">
              {[
                { id: 'all', label: 'المقارنة الشاملة' },
                { id: '17', label: 'TH 17' },
                { id: '16', label: 'TH 16' },
                { id: '15', label: 'TH 15' },
                { id: '14', label: 'TH 14' },
                { id: '13', label: 'TH 13' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTownHallTab(tab.id as any)}
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    selectedTownHallTab === tab.id
                      ? 'bg-amber-600 text-white shadow-xs font-sans font-bold'
                      : 'text-stone-600 hover:text-stone-900 font-sans'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The Primary Recharts Area/Line Chart */}
        <div className="w-full h-80 sm:h-96" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            {chartMetric === 'price' ? (
              <AreaChart data={MONTHLY_PRICE_HISTORY} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorTh17" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TH_COLORS.th17} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={TH_COLORS.th17} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTh16" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TH_COLORS.th16} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={TH_COLORS.th16} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTh15" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TH_COLORS.th15} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={TH_COLORS.th15} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTh14" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TH_COLORS.th14} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={TH_COLORS.th14} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTh13" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TH_COLORS.th13} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={TH_COLORS.th13} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={TH_COLORS.allAverage} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={TH_COLORS.allAverage} stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                <XAxis dataKey="shortDate" stroke="#78716c" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#78716c"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `${val.toLocaleString()} ع`}
                  domain={['dataMin - 500', 'dataMax + 1000']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 10, fontSize: 12, fontFamily: 'Tajawal, sans-serif' }}
                  formatter={(value) => <span className="text-stone-700 font-semibold">{value}</span>}
                />

                {(selectedTownHallTab === 'all' || selectedTownHallTab === '17') && (
                  <Area
                    type="monotone"
                    dataKey="th17"
                    name="تاون هول 17"
                    stroke={TH_COLORS.th17}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTh17)"
                    activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                  />
                )}
                {(selectedTownHallTab === 'all' || selectedTownHallTab === '16') && (
                  <Area
                    type="monotone"
                    dataKey="th16"
                    name="تاون هول 16"
                    stroke={TH_COLORS.th16}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorTh16)"
                    activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                  />
                )}
                {(selectedTownHallTab === 'all' || selectedTownHallTab === '15') && (
                  <Area
                    type="monotone"
                    dataKey="th15"
                    name="تاون هول 15"
                    stroke={TH_COLORS.th15}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorTh15)"
                    activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
                  />
                )}
                {(selectedTownHallTab === 'all' || selectedTownHallTab === '14') && (
                  <Area
                    type="monotone"
                    dataKey="th14"
                    name="تاون هول 14"
                    stroke={TH_COLORS.th14}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorTh14)"
                    activeDot={{ r: 5 }}
                  />
                )}
                {(selectedTownHallTab === 'all' || selectedTownHallTab === '13') && (
                  <Area
                    type="monotone"
                    dataKey="th13"
                    name="تاون هول 13"
                    stroke={TH_COLORS.th13}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTh13)"
                    activeDot={{ r: 5 }}
                  />
                )}
              </AreaChart>
            ) : (
              /* Volume Bar Chart */
              <BarChart data={MONTHLY_PRICE_HISTORY} margin={{ top: 15, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                <XAxis dataKey="shortDate" stroke="#78716c" fontSize={12} tickLine={false} />
                <YAxis stroke="#78716c" fontSize={12} tickLine={false} tickFormatter={(val) => `${val} قرية`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 10, fontSize: 12, fontFamily: 'Tajawal, sans-serif' }}
                  formatter={(value) => <span className="text-stone-700 font-semibold">{value}</span>}
                />
                <Bar
                  dataKey="totalVolume"
                  name="إجمالي القرى المتداولة أسبوعياً"
                  fill="#d97706"
                  radius={[8, 8, 0, 0]}
                  barSize={36}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Analytical Legend Note */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs text-amber-950">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <p>
              <strong>ملخص المؤشر:</strong> تُظهر البيانات استقراراً ملحوظاً في أسعار تاون 13 و14، وهبوطاً مناسباً للشراء في تاون 15 و16، مع قفزة بنسبة 7.9% في أسعار تاون 17.
            </p>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">
            عينة الرصد: 387 قرية مسجلة وموثقة
          </span>
        </div>
      </div>

      {/* Middle Grid: Town Hall Comparison Bar Chart & Price Tier Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart: Comparison of current average price by Town Hall */}
        <div className="lg:col-span-7 p-5 sm:p-6 bg-white border border-stone-200 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <h4 className="font-extrabold text-stone-900 text-base">مقارنة متوسط الأسعار الحالية (تاون 13 - 17)</h4>
              <span className="text-xs text-stone-500">متوسط سعر القرية الجاهزة للشراء بالعملات المعتمدة</span>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>

          <div className="w-full h-64" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={TOWNHALL_MARKET_STATS}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                <XAxis
                  dataKey="townHall"
                  stroke="#78716c"
                  fontSize={12}
                  tickFormatter={(val) => `TH ${val}`}
                  tickLine={false}
                />
                <YAxis
                  stroke="#78716c"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any) => [`${value.toLocaleString()} عملة`, 'متوسط السعر']}
                  labelFormatter={(th) => `تاون هول ${th}`}
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    border: '1px solid #d97706',
                    borderRadius: '12px',
                    color: '#fff',
                    textAlign: 'right',
                    fontSize: '12px',
                    fontFamily: 'Tajawal, sans-serif'
                  }}
                />
                <Bar dataKey="currentAvgPrice" name="متوسط السعر" radius={[8, 8, 0, 0]}>
                  {TOWNHALL_MARKET_STATS.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.townHall === 17
                          ? '#b45309'
                          : entry.townHall === 16
                          ? '#d97706'
                          : entry.townHall === 15
                          ? '#10b981'
                          : entry.townHall === 14
                          ? '#3b82f6'
                          : '#8b5cf6'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-2 text-center text-xs">
            {TOWNHALL_MARKET_STATS.map((stat) => (
              <div key={stat.townHall} className="p-2 rounded-xl bg-stone-50 border border-stone-200/80">
                <span className="font-mono font-bold text-stone-900 block">TH {stat.townHall}</span>
                <span className="font-mono text-[11px] text-amber-800 font-bold block mt-0.5">
                  {stat.currentAvgPrice.toLocaleString()}
                </span>
                <span className={`text-[10px] font-bold block mt-0.5 ${stat.changePercentage >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {stat.changePercentage >= 0 ? `+${stat.changePercentage}%` : `${stat.changePercentage}%`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights & Tips */}
        <div className="lg:col-span-5 p-5 sm:p-6 bg-white border border-stone-200 rounded-3xl shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <h4 className="font-extrabold text-stone-900 text-base">نصائح وإرشادات الشراء الذكي</h4>
              <span className="text-xs text-stone-500">مبنية على تحليلات بيانات الشهر الماضي</span>
            </div>
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-3">
            {MARKET_INSIGHTS.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-stone-200/90 bg-[#faf8f5] space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-stone-900 line-clamp-1">{item.title}</h5>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between">
            <span className="font-bold">هل ترغب بشراء حساب بسعر مدروس؟</span>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer text-xs transition-colors"
            >
              تصفح الحسابات المتاحة
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Deal Evaluator & Comparison Tool (فاحص الصفقات الذكي) */}
      <div id="smart-deal-checker" className="p-6 sm:p-8 bg-gradient-to-br from-amber-50/90 via-white to-amber-100/50 border-2 border-amber-300 rounded-3xl shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-xs">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-stone-900">فاحص ومقياس جودة الصفقة (Smart Purchase Advisor)</h3>
            <p className="text-xs text-stone-600">
              أدخل سعر أي حساب معروض بالعملات ومستوى التاون هول، وسيقوم النظام بمقارنته مع متوسط أسعار الشهر الماضي لإرشادك هل الصفقة رابحة أم مرتفعة!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Select Town Hall */}
          <div className="sm:col-span-4 space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              1. اختر مستوى التاون هول للقرية:
            </label>
            <select
              value={evalTH}
              onChange={(e) => setEvalTH(Number(e.target.value))}
              className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-bold text-stone-900 outline-none focus:border-amber-500 cursor-pointer shadow-xs"
            >
              <option value={17}>تاون هول 17 (متوسط السوق: 16,400 عملة)</option>
              <option value={16}>تاون هول 16 (متوسط السوق: 9,100 عملة)</option>
              <option value={15}>تاون هول 15 (متوسط السوق: 6,100 عملة)</option>
              <option value={14}>تاون هول 14 (متوسط السوق: 3,900 عملة)</option>
              <option value={13}>تاون هول 13 (متوسط السوق: 2,650 عملة)</option>
            </select>
          </div>

          {/* Enter Price */}
          <div className="sm:col-span-4 space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              2. السعر المعروض للقرية بالعملات:
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                placeholder="أدخل السعر بالعملات..."
                value={evalCoinsInput}
                onChange={(e) => setEvalCoinsInput(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-stone-900 outline-none focus:border-amber-500 shadow-xs"
              />
              <span className="absolute left-3 top-2.5 text-xs text-stone-400 font-bold">عملة</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="sm:col-span-4 space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              أسعار نموذجية للاختبار:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[5000, 7500, 9500, 15000].map((pr) => (
                <button
                  key={pr}
                  type="button"
                  onClick={() => setEvalCoinsInput(pr.toString())}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:border-amber-400 text-xs font-mono font-bold cursor-pointer transition-colors"
                >
                  {pr.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Evaluation Verdict */}
        {dealEvaluation && (
          <div className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-200 ${dealEvaluation.colorClass}`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/80 shadow-xs">
                {dealEvaluation.status === 'steal' ? (
                  <Sparkles className="w-6 h-6 text-emerald-600" />
                ) : dealEvaluation.status === 'fair' ? (
                  <CheckCircle2 className="w-6 h-6 text-amber-600" />
                ) : (
                  <Info className="w-6 h-6 text-orange-600" />
                )}
              </div>
              <div>
                <span className="text-xs font-black block">
                  {dealEvaluation.status === 'steal' ? '👑 تقييم المؤشر: صفقة رابحة وممتازة!' : dealEvaluation.status === 'fair' ? '⚡ تقييم المؤشر: سعر عادل ومتوازن' : '⚠️ تقييم المؤشر: أعلى من متوسط السوق'}
                </span>
                <p className="text-xs mt-0.5 font-medium leading-relaxed">
                  {dealEvaluation.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              {onSelectTownHallFilter && (
                <button
                  type="button"
                  onClick={() => onSelectTownHallFilter(evalTH)}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  تصفح قريات TH {evalTH} الآن
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Comprehensive Town Hall Historical Stats Table */}
      <div className="bg-white border border-stone-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div>
            <h4 className="font-extrabold text-stone-900 text-base">جدول المقارنة التفصيلي لمستويات التاون هول (الشهر الماضي)</h4>
            <span className="text-xs text-stone-500">احصاءات دقيقة لمتوسط الأسعار، المدى، ونسبة التغير لاتخاذ قرار شراء مدروس</span>
          </div>
          <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2.5 py-1 rounded-lg">
            5 مستويات تاون
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 bg-stone-50/60">
                <th className="py-3 px-3 font-bold">المستوى</th>
                <th className="py-3 px-3 font-bold">متوسط السعر الحالي</th>
                <th className="py-3 px-3 font-bold">السعر بداية الشهر</th>
                <th className="py-3 px-3 font-bold">التغير الشهري</th>
                <th className="py-3 px-3 font-bold">المدى السعري</th>
                <th className="py-3 px-3 font-bold">مستوى الطلب</th>
                <th className="py-3 px-3 font-bold">توصية الشراء</th>
                <th className="py-3 px-3 font-bold text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {TOWNHALL_MARKET_STATS.map((stat) => (
                <tr key={stat.townHall} className="hover:bg-amber-50/40 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-stone-900">
                    <span className="px-2 py-0.5 rounded-md bg-stone-900 text-amber-300 font-mono text-xs">
                      TH {stat.townHall}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-black text-amber-900 text-sm">
                    {stat.currentAvgPrice.toLocaleString()} عملة
                  </td>
                  <td className="py-3.5 px-3 font-mono text-stone-500">
                    {stat.lastMonthAvgPrice.toLocaleString()} عملة
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold">
                    <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] ${
                      stat.changePercentage >= 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {stat.changePercentage >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      <span>{stat.changePercentage >= 0 ? `+${stat.changePercentage}%` : `${stat.changePercentage}%`}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-stone-600">
                    {stat.minPrice.toLocaleString()} - {stat.maxPrice.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-stone-800">
                    {stat.demandLevel}
                  </td>
                  <td className="py-3.5 px-3 text-stone-600 max-w-xs text-[11px] leading-relaxed">
                    {stat.advisoryTip}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {onSelectTownHallFilter && (
                      <button
                        type="button"
                        onClick={() => onSelectTownHallFilter(stat.townHall)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] cursor-pointer transition-colors whitespace-nowrap shadow-xs"
                      >
                        عرض القرى
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
