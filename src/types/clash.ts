export type CurrencyCode = 'USD' | 'IQD' | 'CLC' | 'ASIA';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateAgainstUSD: number; // USD = 1, IQD = 1320 (or 1310/1500 market rate), CLC = 100, ASIA = 1
  isAppCurrency?: boolean;
}

export interface CoinPackage {
  id: string;
  coins: number;
  bonusCoins: number;
  priceUSD: number;
  popular?: boolean;
}

export interface UserDigitalCard {
  cardId: string; // e.g. CLC-8924-IQ
  memberName: string;
  memberTier: string;
  joinedDate: string;
  securityCode: string;
  avatarSeed: number;
  qrCodeMock: string;
  warriorTitle?: string;
  leagueEmblem?: string;
  townHallLevel?: number;
  playerTag?: string;
  clanName?: string;
  cardTheme?: 'royal_gold' | 'dark_obsidian' | 'legend_emerald' | 'crimson_flame';
}

export interface HeroStats {
  barbarianKing: number;
  archerQueen: number;
  grandWarden: number;
  royalChampion: number;
  minionPrince?: number;
}

export interface AccountListing {
  id: string;
  title: string;
  description: string;
  townHallLevel: number;
  builderHallLevel: number;
  playerTag: string;
  xpLevel: number;
  priceUSD: number;
  trophies: number;
  highestTrophies: number;
  gems: number;
  warStars: number;
  clanCapitalHall: number;
  nameChangeStatus: 'مجاني (Free)' | '500 جوهرة' | '1000 جوهرة' | 'غير متاح حالياً';
  supercellIdStatus: 'بريد جيميل مخصص بالكامل' | 'بريد أوتلوك مخصص' | 'جاهز للنقل المباشر';
  linkedPhone: boolean;
  image: string;
  secondaryImages?: string[];
  heroes: HeroStats;
  maxHeroes: boolean;
  isFeatured?: boolean;
  isVerifiedSeller: boolean;
  sellerName: string;
  sellerRating: number;
  sellerSalesCount: number;
  equipmentHighlights: string[];
  skinsCount: number;
  sceneriesCount: number;
  createdAt: string;
  status: 'available' | 'sold' | 'reserved';
}

export interface ValuationForm {
  townHall: number;
  builderHall: number;
  kingLevel: number;
  queenLevel: number;
  wardenLevel: number;
  rcLevel: number;
  minionPrinceLevel: number;
  gems: number;
  skins: number;
  sceneries: number;
  freeNameChange: boolean;
}

export interface AdminRechargeTransaction {
  id: string;
  targetCardId: string;
  targetMemberName: string;
  coinsAdded: number;
  paymentMethod: string;
  notes?: string;
  date: string;
  adminCode: string;
}

export interface BidRecord {
  id: string;
  bidderCardId: string;
  bidderName: string;
  amount: number;
  timestamp: string;
}

export interface AuctionListing {
  id: string;
  account: AccountListing;
  startingBid: number;
  currentBid: number;
  minIncrement: number;
  highestBidderCardId?: string;
  highestBidderName?: string;
  endsAt: string; // ISO string
  totalBids: number;
  bidHistory: BidRecord[];
  status: 'active' | 'ended';
  buyoutCoins?: number;
}

export interface InvestmentShare {
  id: string;
  title: string;
  symbol: string;
  badge: string;
  description: string;
  sharePriceCoins: number;
  previousPriceCoins: number;
  dividendRatePercent: number; // e.g., 7.5%
  dividendPeriodLabel: string; // e.g., "أرباح أسبوعية"
  availableShares: number;
  totalShares: number;
  backedBy: string;
  riskRating: 'آمن وساطة 100%' | 'نمو متوازن' | 'أرباح مرتفعة';
  priceHistory: Array<{ date: string; price: number; volume: number }>;
}

export interface UserShareHolding {
  shareId: string;
  sharesCount: number;
  averageBuyPrice: number;
  totalInvested: number;
  unclaimedDividends: number;
  lastClaimTimestamp: string;
}

export interface ShareOrderTransaction {
  id: string;
  type: 'buy' | 'sell' | 'dividend_claim';
  shareId: string;
  shareTitle: string;
  shares: number;
  amountCoins: number;
  timestamp: string;
}


