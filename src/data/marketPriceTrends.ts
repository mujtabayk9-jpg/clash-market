/**
 * Market Price Evolution & Historical Data for Clash of Clans accounts in Al-Qimma Clash
 * Tracking price trends, sales volume, and buyer recommendation indicators over the past month.
 */

export interface WeeklyTrendPoint {
  date: string; // e.g. "الأسبوع 1 (1 أكتوبر)"
  shortDate: string; // "1 أكتوبر"
  dayIndex: number;
  th17: number;
  th16: number;
  th15: number;
  th14: number;
  th13: number;
  allAverage: number;
  totalVolume: number;
}

export interface TownHallMarketStats {
  townHall: number;
  name: string;
  currentAvgPrice: number;
  lastMonthAvgPrice: number;
  changePercentage: number; // e.g. +4.2 or -6.5
  minPrice: number;
  maxPrice: number;
  salesVolumeLastMonth: number;
  demandLevel: 'مرتفع جداً 🔥' | 'نشط ومستقر ⚡' | 'فرصة شراء ذهبية 💎';
  advisoryTip: string;
  bestHeroConfig: string;
}

export interface PriceRangeDistribution {
  range: string;
  category: string;
  count: number;
  percentage: number;
  color: string;
}

// 30-Day Historical Data Points (Sampled across the past month)
export const MONTHLY_PRICE_HISTORY: WeeklyTrendPoint[] = [
  {
    date: 'الأسبوع 1 (بداية الشهر)',
    shortDate: '1 نوفمبر',
    dayIndex: 1,
    th17: 15200,
    th16: 9800,
    th15: 6800,
    th14: 4300,
    th13: 2900,
    allAverage: 7800,
    totalVolume: 42,
  },
  {
    date: 'الأسبوع 2 (منتصف الشهر الأول)',
    shortDate: '8 نوفمبر',
    dayIndex: 8,
    th17: 15600,
    th16: 9600,
    th15: 6500,
    th14: 4150,
    th13: 2850,
    allAverage: 7740,
    totalVolume: 56,
  },
  {
    date: 'الأسبوع 3 (منتصف الشهر الثاني)',
    shortDate: '15 نوفمبر',
    dayIndex: 15,
    th17: 16100,
    th16: 9400,
    th15: 6300,
    th14: 4000,
    th13: 2750,
    allAverage: 7710,
    totalVolume: 64,
  },
  {
    date: 'الأسبوع 4 (أواخر الشهر)',
    shortDate: '22 نوفمبر',
    dayIndex: 22,
    th17: 15900,
    th16: 9200,
    th15: 6150,
    th14: 3950,
    th13: 2700,
    allAverage: 7580,
    totalVolume: 71,
  },
  {
    date: 'الوقت الحالي (نهاية الشهر)',
    shortDate: 'اليوم',
    dayIndex: 30,
    th17: 16400,
    th16: 9100,
    th15: 6100,
    th14: 3900,
    th13: 2650,
    allAverage: 7630,
    totalVolume: 85,
  },
];

// In-depth statistics per Town Hall level
export const TOWNHALL_MARKET_STATS: TownHallMarketStats[] = [
  {
    townHall: 17,
    name: 'تاون هول 17 (القمة الأسطورية)',
    currentAvgPrice: 16400,
    lastMonthAvgPrice: 15200,
    changePercentage: 7.9,
    minPrice: 13500,
    maxPrice: 22000,
    salesVolumeLastMonth: 38,
    demandLevel: 'مرتفع جداً 🔥',
    advisoryTip: 'الطلب في ذروته بسبب تصفيات دوري الأساطير والحروب العالمية، والحسابات المميزة تباع في أقل من 24 ساعة.',
    bestHeroConfig: 'أبطال 95/95/70/45 ومعدات ماكس',
  },
  {
    townHall: 16,
    name: 'تاون هول 16 (التنافسي المعتمد)',
    currentAvgPrice: 9100,
    lastMonthAvgPrice: 9800,
    changePercentage: -7.1,
    minPrice: 7500,
    maxPrice: 12500,
    salesVolumeLastMonth: 94,
    demandLevel: 'فرصة شراء ذهبية 💎',
    advisoryTip: 'أفضل توقيت للشراء! هبطت الأسعار بنسبة 7.1% مع انتقال بعض اللاعبين لتاون 17، مما يتيح لك اقتناء تاون 16 ماكس بسعر مغرٍ.',
    bestHeroConfig: 'أبطال 90/90/65/40',
  },
  {
    townHall: 15,
    name: 'تاون هول 15 (الأكثر استقراراً)',
    currentAvgPrice: 6100,
    lastMonthAvgPrice: 6800,
    changePercentage: -10.3,
    minPrice: 4800,
    maxPrice: 8000,
    salesVolumeLastMonth: 112,
    demandLevel: 'فرصة شراء ذهبية 💎',
    advisoryTip: 'تراجع ملحوظ في الأسعار بنسبة 10.3%، وتعتبر القرى هنا الخيار الأنسب للميزانيات المتوسطة مع إمكانية الترقية السريعة.',
    bestHeroConfig: 'أبطال 85/85/60/35',
  },
  {
    townHall: 14,
    name: 'تاون هول 14 (الفئة المتوسطة)',
    currentAvgPrice: 3900,
    lastMonthAvgPrice: 4300,
    changePercentage: -9.3,
    minPrice: 3000,
    maxPrice: 5200,
    salesVolumeLastMonth: 78,
    demandLevel: 'نشط ومستقر ⚡',
    advisoryTip: 'سعر مناسب جداً للبدء في حروب القبائل المتوسطة ودخول الكلانات النشطة بدون دفع مبالغ ضخمة.',
    bestHeroConfig: 'أبطال 80/80/55/30',
  },
  {
    townHall: 13,
    name: 'تاون هول 13 (البداية الاحترافية)',
    currentAvgPrice: 2650,
    lastMonthAvgPrice: 2900,
    changePercentage: -8.6,
    minPrice: 1800,
    maxPrice: 3500,
    salesVolumeLastMonth: 65,
    demandLevel: 'نشط ومستقر ⚡',
    advisoryTip: 'الخيار الاقتصادي الأفضل للمبتدئين الذين يريدون تخطي تعب البناء والبدء ببطلة ملكية وأبطال مطورين.',
    bestHeroConfig: 'أبطال 75/75/50/25',
  },
];

// Price Distribution Across All Accounts in Market
export const PRICE_DISTRIBUTION: PriceRangeDistribution[] = [
  {
    range: 'أقل من 3,000 عملة',
    category: 'قرى اقتصادية (TH11 - TH13)',
    count: 85,
    percentage: 22,
    color: '#10b981', // emerald
  },
  {
    range: '3,000 - 6,500 عملة',
    category: 'قرى متوازنة (TH14 - TH15)',
    count: 142,
    percentage: 37,
    color: '#f59e0b', // amber
  },
  {
    range: '6,500 - 11,000 عملة',
    category: 'قرى متقدمة وماكس (TH15 - TH16)',
    count: 108,
    percentage: 28,
    color: '#d97706', // amber-600
  },
  {
    range: 'أكثر من 11,000 عملة',
    category: 'قرى كبار الشخصيات والأساطير (TH17)',
    count: 51,
    percentage: 13,
    color: '#854d0e', // amber-800
  },
];

// Daily Volatility and Activity Highlights
export const MARKET_INSIGHTS = [
  {
    id: 1,
    type: 'positive',
    title: 'تاون هول 16 و15 يقدمان أعلى عائد قيمة للمشتري حالياً',
    description: 'سجلت أسعار تاون 16 هبوطاً بنسبة 7.1% وتاون 15 بنسبة 10.3%، مما يجعل الوقت الحالي هو التوقيت المثالي لاقتناء قرية تنافسية بأقل سعر تم تسجيله خلال 6 أشهر.',
    badge: 'فرصة شراء 💎',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 2,
    type: 'trend',
    title: 'طلب قياسي وأسعار متماسكة لتاون هول 17 مع اقتراب البطولات',
    description: 'ارتفع متوسط سعر تاون 17 بنسبة +7.9% بسبب ندرة القرى الماكس بالكامل وارتفاع الطلب من قادة الكلانات المصنفة في دوري الأساطير.',
    badge: 'طلب مرتفع 🔥',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  {
    id: 3,
    type: 'advice',
    title: 'نصيحة وسيط Al-Qimma Clash للشراء الذكي',
    description: 'ابحث عن القرى التي تحتوي على "تغيير اسم مجاني" ومعدات ملحمية مطورة مثل Giant Gauntlet أو Frozen Arrow؛ فهذه التفاصيل توفر عليك أكثر من 2,500 عملة إضافية.',
    badge: 'نصيحة الوساطة 🛡️',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
  },
];
