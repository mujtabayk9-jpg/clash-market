import React, { useState, useEffect } from 'react';
import { 
  X, 
  Shield, 
  QrCode, 
  Copy, 
  Check, 
  MessageCircle, 
  User, 
  Award, 
  Settings, 
  Coins, 
  RefreshCw, 
  Plus, 
  ArrowLeftRight, 
  UserCheck, 
  Edit3, 
  Sparkles, 
  Trophy, 
  Crown, 
  Flame, 
  Download, 
  Share2,
  CheckCircle2,
  Palette
} from 'lucide-react';
import { UserDigitalCard } from '../types/clash';
import { 
  getKnownClients, 
  createNewCardAccount, 
  normalizeCardId, 
  getCardBalance, 
  KnownClient,
  updateClientInfo 
} from '../utils/balanceManager';

interface DigitalIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCard: UserDigitalCard;
  walletBalance: number;
  adminWhatsApp: string;
  onUpdateAdminWhatsApp: (newNumber: string) => void;
  onSwitchCard?: (newCard: UserDigitalCard) => void;
  onUpdateUserCard?: (updated: UserDigitalCard) => void;
}

const WARRIOR_TITLES = [
  '👑 أسطورة كلاش الملكية',
  '⚔️ قائد كلان معتمد',
  '🏆 بطل دوري الأساطير 5800+',
  '⚡ صقر التاون هول 17',
  '🛡️ حارس القلعة الذهبية',
  '💎 مستثمر القمة الماسي',
];

const LEAGUE_BADGES = [
  { name: 'دوري الأساطير', icon: '🏆', trophies: '5,000+ كأس' },
  { name: 'دوري التيتان', icon: '⚡', trophies: '4,100+ كأس' },
  { name: 'دوري الأبطال', icon: '⚔️', trophies: '3,200+ كأس' },
  { name: 'دوري الماستر', icon: '🛡️', trophies: '2,600+ كأس' },
];

const CARD_THEMES: Array<{
  id: 'royal_gold' | 'dark_obsidian' | 'legend_emerald' | 'crimson_flame';
  name: 'الذهب الملكي' | 'الأوبسيديان الأسود' | 'الزمرد الأسطوري' | 'اللهب القرمزي';
  bgGradient: string;
  borderColor: string;
  accentColor: string;
  chipColor: string;
}> = [
  {
    id: 'royal_gold',
    name: 'الذهب الملكي',
    bgGradient: 'from-amber-950 via-stone-900 to-amber-900',
    borderColor: 'border-amber-400/70',
    accentColor: 'text-amber-400',
    chipColor: 'from-yellow-300 via-amber-400 to-yellow-600',
  },
  {
    id: 'dark_obsidian',
    name: 'الأوبسيديان الأسود',
    bgGradient: 'from-stone-950 via-stone-900 to-black',
    borderColor: 'border-stone-500/50',
    accentColor: 'text-stone-300',
    chipColor: 'from-stone-300 via-stone-400 to-stone-600',
  },
  {
    id: 'legend_emerald',
    name: 'الزمرد الأسطوري',
    bgGradient: 'from-emerald-950 via-stone-900 to-teal-950',
    borderColor: 'border-emerald-400/70',
    accentColor: 'text-emerald-400',
    chipColor: 'from-emerald-300 via-teal-400 to-emerald-600',
  },
  {
    id: 'crimson_flame',
    name: 'اللهب القرمزي',
    bgGradient: 'from-rose-950 via-stone-900 to-red-950',
    borderColor: 'border-rose-400/70',
    accentColor: 'text-rose-400',
    chipColor: 'from-amber-300 via-rose-400 to-amber-600',
  },
];

export const DigitalIdCardModal: React.FC<DigitalIdCardModalProps> = ({
  isOpen,
  onClose,
  userCard,
  walletBalance,
  adminWhatsApp,
  onUpdateAdminWhatsApp,
  onSwitchCard,
  onUpdateUserCard,
}) => {
  const [copiedData, setCopiedData] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [customPhone, setCustomPhone] = useState(adminWhatsApp);
  const [selectedPackForWhatsapp, setSelectedPackForWhatsapp] = useState<number>(2500);
  const [showSwitchAccounts, setShowSwitchAccounts] = useState(false);
  const [manualCardIdInput, setManualCardIdInput] = useState('');
  const [knownClientsList, setKnownClientsList] = useState<KnownClient[]>([]);

  // Editing state
  const [editName, setEditName] = useState(userCard.memberName);
  const [editTitle, setEditTitle] = useState(userCard.warriorTitle || WARRIOR_TITLES[0]);
  const [editLeague, setEditLeague] = useState(userCard.leagueEmblem || 'دوري الأساطير');
  const [editTownHall, setEditTownHall] = useState(userCard.townHallLevel || 17);
  const [editClan, setEditClan] = useState(userCard.clanName || 'كلان القمة الملكي');
  const [editTheme, setEditTheme] = useState<any>(userCard.cardTheme || 'royal_gold');
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKnownClientsList(getKnownClients());
      setEditName(userCard.memberName);
      setEditTitle(userCard.warriorTitle || WARRIOR_TITLES[0]);
      setEditLeague(userCard.leagueEmblem || 'دوري الأساطير');
      setEditTownHall(userCard.townHallLevel || 17);
      setEditClan(userCard.clanName || 'كلان القمة الملكي');
      setEditTheme(userCard.cardTheme || 'royal_gold');
    }
  }, [isOpen, userCard, walletBalance]);

  if (!isOpen) return null;

  const currentTheme = CARD_THEMES.find((t) => t.id === editTheme) || CARD_THEMES[0];

  const handleSaveCardCustomization = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserDigitalCard = {
      ...userCard,
      memberName: editName.trim() || userCard.memberName,
      warriorTitle: editTitle,
      leagueEmblem: editLeague,
      townHallLevel: editTownHall,
      clanName: editClan.trim() || 'كلان القمة الملكي',
      cardTheme: editTheme,
    };

    if (onUpdateUserCard) {
      onUpdateUserCard(updated);
    }
    updateClientInfo(userCard.cardId, updated.memberName);
    setShowEditDrawer(false);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  const handleCreateNewTestAccount = () => {
    const newAccount = createNewCardAccount();
    const fullCard: UserDigitalCard = {
      cardId: newAccount.cardId,
      memberName: newAccount.memberName,
      memberTier: 'عضوية موثقة دائمة',
      joinedDate: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' }),
      securityCode: Math.floor(1000 + Math.random() * 9000).toString(),
      avatarSeed: Math.floor(Math.random() * 100),
      qrCodeMock: `CLC-PASS-${newAccount.cardId}`,
      warriorTitle: '⚔️ محارب معتمد',
      leagueEmblem: 'دوري الأساطير',
      townHallLevel: 17,
      clanName: 'Al-Qimma Clan',
      cardTheme: 'royal_gold',
    };
    if (onSwitchCard) {
      onSwitchCard(fullCard);
    }
    setKnownClientsList(getKnownClients());
  };

  const handleSwitchToClient = (client: KnownClient) => {
    const fullCard: UserDigitalCard = {
      cardId: client.cardId,
      memberName: client.memberName,
      memberTier: 'عضوية موثقة دائمة',
      joinedDate: client.lastUpdated || new Date().toLocaleDateString('ar-EG'),
      securityCode: Math.floor(1000 + Math.random() * 9000).toString(),
      avatarSeed: Math.floor(Math.random() * 100),
      qrCodeMock: `CLC-PASS-${client.cardId}`,
      warriorTitle: '⚔️ عضو معتمد',
      leagueEmblem: 'دوري الأساطير',
      townHallLevel: 17,
      clanName: 'Al-Qimma Clan',
      cardTheme: 'royal_gold',
    };
    if (onSwitchCard) {
      onSwitchCard(fullCard);
    }
  };

  const handleManualCardSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    const norm = normalizeCardId(manualCardIdInput);
    if (!norm) return;
    const existing = knownClientsList.find((c) => normalizeCardId(c.cardId) === norm);
    const fullCard: UserDigitalCard = {
      cardId: norm,
      memberName: existing?.memberName || 'عميل كلاش',
      memberTier: 'عضوية موثقة دائمة',
      joinedDate: new Date().toLocaleDateString('ar-EG'),
      securityCode: Math.floor(1000 + Math.random() * 9000).toString(),
      avatarSeed: Math.floor(Math.random() * 100),
      qrCodeMock: `CLC-PASS-${norm}`,
      warriorTitle: '⚔️ عضو معتمد',
      leagueEmblem: 'دوري الأساطير',
      townHallLevel: 17,
      clanName: 'Al-Qimma Clan',
      cardTheme: 'royal_gold',
    };
    if (onSwitchCard) {
      onSwitchCard(fullCard);
    }
    setManualCardIdInput('');
  };

  // Direct WhatsApp message formatting
  const whatsappMessage = `السلام عليكم ورحمة الله،
أود شحن رصيد عملات في متجر Al-Qimma Clash الرسمي.

🪪 بيانات بطاقتي التعريفية الملكية:
- رقم البطاقة الدائمة: ${userCard.cardId}
- اسم المحارب: ${userCard.memberName}
- اللقب: ${userCard.warriorTitle || '👑 أسطورة كلاش الملكية'}
- الكلان: ${userCard.clanName || 'كلان القمة'} (تاون ${userCard.townHallLevel || 17})
- كود الأمان المعتمد: ${userCard.securityCode}
- رصيدي الحالي في البطاقة: ${walletBalance.toLocaleString()} عملة

🎯 باقة العملات المطلوب شحنها: ${selectedPackForWhatsapp.toLocaleString()} عملة
يرجى شحن الرصيد لبطاقتي بعد التحقق. شكراً جزيلاً!`;

  const cleanPhone = adminWhatsApp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  const copyCardInfo = () => {
    const text = `بطاقة عضوية Al-Qimma Clash الملكية 𒀱 𒅒 𒈓 𒀰
رقم الهوية الدائم: ${userCard.cardId}
اسم المحارب: ${userCard.memberName}
اللقب: ${userCard.warriorTitle || 'أسطورة كلاش'}
رصيد العملات المتاح: ${walletBalance.toLocaleString()} عملة
الكلان: ${userCard.clanName || 'كلان القمة'} (تاون ${userCard.townHallLevel || 17})
كود الأمان السري: ${userCard.securityCode}`;
    navigator.clipboard.writeText(text);
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2000);
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhone.trim()) return;
    onUpdateAdminWhatsApp(customPhone.trim());
    setShowSettings(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/65 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#faf8f5] border border-stone-200 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col text-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-400/40 text-amber-700 shadow-xs">
              <Crown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">بطاقة الهوية الملكية (Al-Qimma Passport)</h3>
              <span className="text-[11px] text-stone-500">هويتك المعتمدة والدائمة مدى الحياة للشحن والتوثيق والوساطة</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowEditDrawer(!showEditDrawer)}
              className="p-2 rounded-xl text-stone-600 hover:text-amber-800 hover:bg-amber-50 transition-colors cursor-pointer border border-stone-200 flex items-center gap-1 text-xs font-bold"
              title="تعديل وتخصيص بيانات الهوية"
            >
              <Edit3 className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">تعديل الهوية</span>
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer border border-stone-200"
              title="تعديل رقم واتساب المشرف"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer border border-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* WhatsApp Phone Settings Drawer */}
        {showSettings && (
          <form onSubmit={handleSavePhone} className="p-4 bg-amber-50 border-b border-amber-200 text-xs space-y-2">
            <label className="block font-bold text-stone-800">
              تعديل رقم هاتف المشرف على الواتساب (المستلم لطلبات الشحن):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="مثال: 9647708924110"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 font-mono text-stone-900 outline-none"
                dir="ltr"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl cursor-pointer shadow-xs"
              >
                حفظ
              </button>
            </div>
          </form>
        )}

        {/* Customization & Editing Drawer */}
        {showEditDrawer && (
          <form onSubmit={handleSaveCardCustomization} className="p-5 bg-white border-b border-stone-200 text-xs space-y-4 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>تخصيص وترقية بطاقتك الشخصية</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowEditDrawer(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer text-xs"
              >
                إلغاء
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">اسم المحارب / اللاعب:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold outline-none focus:border-amber-500"
                  placeholder="مثال: المحارب الملكي"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">الكلان / القبيلة:</label>
                <input
                  type="text"
                  value={editClan}
                  onChange={(e) => setEditClan(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold outline-none focus:border-amber-500"
                  placeholder="مثال: صقور الرافدين"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">اللقب والرتبة الفخرية:</label>
                <select
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold outline-none cursor-pointer"
                >
                  {WARRIOR_TITLES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">مستوى التاون هول للقرية الرئيسية:</label>
                <select
                  value={editTownHall}
                  onChange={(e) => setEditTownHall(parseInt(e.target.value) || 17)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-bold outline-none cursor-pointer"
                >
                  {[17, 16, 15, 14, 13].map((th) => (
                    <option key={th} value={th}>تاون هول {th} (Town Hall {th})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Card Theme Picker */}
            <div>
              <label className="block font-bold text-stone-700 mb-1.5 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-amber-600" />
                <span>اختر تصميم وشكل البطاقة الملكية:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CARD_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setEditTheme(theme.id)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      editTheme === theme.id
                        ? 'border-amber-500 bg-amber-50/80 font-bold text-stone-900 ring-2 ring-amber-500/20'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-gradient-to-tr shadow-xs" style={{ background: theme.id === 'royal_gold' ? '#d97706' : theme.id === 'dark_obsidian' ? '#1c1917' : theme.id === 'legend_emerald' ? '#059669' : '#e11d48' }} />
                    <span className="text-[11px]">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>حفظ التعديلات على هويتي</span>
              </button>
            </div>
          </form>
        )}

        {/* Saved Toast Alert */}
        {isSavedFeedback && (
          <div className="mx-6 mt-4 p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>تم حفظ وترقية بيانات بطاقتك بنجاح!</span>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-right">
          {/* THE ROYAL LIFELONG DIGITAL PASSPORT CARD */}
          <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-br ${currentTheme.bgGradient} p-6 sm:p-7 text-white border-2 ${currentTheme.borderColor} shadow-2xl transition-all`}>
            {/* Holographic Watermark with Royal Seal */}
            <div className="absolute inset-0 pointer-events-none select-none opacity-10 flex items-center justify-center overflow-hidden">
              <span className="text-8xl sm:text-9xl font-serif text-amber-300 tracking-widest rotate-12">
                𒀱 𒅒 𒈓 𒀰
              </span>
            </div>

            {/* Glowing orbs */}
            <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-600/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

            {/* Card Header: Brand, Royal Chip & Title */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-xs">
                  <Shield className="w-5 h-5 fill-amber-400/30 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-base tracking-wide text-white font-serif leading-none">Al-Qimma Clash</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                      TH {userCard.townHallLevel || 17}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-300/90 font-mono mt-0.5 block">
                    متجر القمة كلاش · بطاقة العضوية الدائمة المعتمدة
                  </span>
                </div>
              </div>

              {/* Realistic Gold EMV Microchip */}
              <div className="flex items-center gap-2">
                <div className="w-11 h-8 rounded-lg bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-600 p-1 border border-yellow-200/50 shadow-md flex flex-col justify-between">
                  <div className="w-full h-1 bg-amber-700/40 rounded-full" />
                  <div className="w-3/4 h-1 bg-amber-700/40 rounded-full self-end" />
                  <div className="w-full h-1 bg-amber-700/40 rounded-full" />
                </div>
              </div>
            </div>

            {/* Middle Row: Warrior Profile, Title & Clan */}
            <div className="my-5 relative z-10 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-stone-400 block mb-1">اسم المحارب واللقب:</span>
                <span className="font-black text-white text-base sm:text-lg tracking-tight block">
                  {userCard.memberName}
                </span>
                <span className="text-xs font-bold text-amber-300 mt-0.5 block">
                  {userCard.warriorTitle || '👑 أسطورة كلاش الملكية'}
                </span>
                <span className="text-[11px] text-stone-300 mt-1 block">
                  🛡️ {userCard.clanName || 'كلان القمة الملكي'}
                </span>
              </div>

              {/* Balance Box */}
              <div className="text-left flex flex-col justify-center items-end bg-black/30 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                <span className="text-[10px] text-stone-400 block mb-0.5">رصيد العملات المتاح:</span>
                <div className="flex items-baseline gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400 self-center" />
                  <span className="font-mono font-black text-xl sm:text-2xl text-amber-300 tabular-nums">
                    {walletBalance.toLocaleString()}
                  </span>
                  <span className="text-xs text-amber-200 font-bold">عملة</span>
                </div>
                <span className="text-[10px] text-emerald-400 mt-0.5 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>حساب نشط وموثق</span>
                </span>
              </div>
            </div>

            {/* Royal Certification Seal Banner */}
            <div className="relative z-10 py-1.5 px-3 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-between text-[11px] mb-4 text-amber-200">
              <span className="font-bold flex items-center gap-1.5">
                <span>وثيقة معتمدة ومختومة رسمياً</span>
                <span className="text-amber-300 font-serif tracking-widest">𒀱 𒅒 𒈓 𒀰</span>
              </span>
              <span className="font-mono text-[10px] text-amber-300/80">SEC-ID: {userCard.securityCode}</span>
            </div>

            {/* Bottom Row: Permanent ID Number & Barcode */}
            <div className="pt-3 border-t border-white/10 relative z-10 flex items-end justify-between gap-4">
              <div>
                <span className="text-[10px] text-stone-400 block mb-0.5 font-sans">
                  رقم الهوية الدائم (Permanent Member ID):
                </span>
                <span className="font-mono text-lg sm:text-xl font-black tracking-widest text-amber-300 select-all block">
                  {userCard.cardId}
                </span>
                <span className="text-[10px] text-stone-400 font-mono block mt-1">
                  تاريخ الانضمام: {userCard.joinedDate} · {userCard.memberTier}
                </span>
              </div>

              {/* QR Code Graphic */}
              <div className="p-1.5 bg-white rounded-xl text-stone-950 shrink-0 shadow-md">
                <QrCode className="w-10 h-10 text-stone-900" />
              </div>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={copyCardInfo}
              className="py-3 px-4 bg-white border border-stone-200 hover:border-amber-400 rounded-2xl text-xs font-bold text-stone-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {copiedData ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">تم نسخ بيانات البطاقة كاملة!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-600" />
                  <span>نسخ بيانات ورقم الهوية</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowEditDrawer(!showEditDrawer)}
              className="py-3 px-4 bg-white border border-stone-200 hover:border-amber-400 rounded-2xl text-xs font-bold text-stone-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Edit3 className="w-4 h-4 text-amber-600" />
              <span>تعديل اللقب واسم المحارب</span>
            </button>
          </div>

          {/* WHATSAPP INSTANT RECHARGE SECTION */}
          <div className="p-5 bg-gradient-to-br from-emerald-50 via-white to-amber-50 border border-emerald-300 rounded-3xl space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">شحن رصيد العملات المباشر عبر الواتساب</h4>
                <span className="text-[11px] text-stone-500">
                  يتم الشحن حصراً من خلال المشرف المعتمد، تُرسل هويتك بالواتساب لتعبئة رصيدك فورياً
                </span>
              </div>
            </div>

            {/* Select Recharge Package */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">اختر باقة العملات المراد شحنها:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[1000, 2500, 5000, 10000].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setSelectedPackForWhatsapp(amount)}
                    className={`py-2.5 px-1 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedPackForWhatsapp === amount
                        ? 'bg-emerald-600 text-white font-bold border-emerald-700 shadow-sm'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <span className="block font-mono font-black text-sm">{amount.toLocaleString()}</span>
                    <span className="text-[10px] block opacity-90">عملة كلاش</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-white/90 border border-emerald-200 rounded-2xl text-xs space-y-1.5 text-stone-600">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold">رقم المشرف المباشر على الواتساب:</span>
                <span className="font-mono font-bold text-emerald-800" dir="ltr">+{cleanPhone}</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                عند النقر، يتم إرسال بطاقتك <strong>({userCard.cardId})</strong> واسمك <strong>({userCard.memberName})</strong> في رسالة مهيأة مسبقاً ليشحن المشرف رصيدك خلال دقائق.
              </p>
            </div>

            {/* WhatsApp Send Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 transition-all flex items-center justify-center gap-2.5 shadow-md shadow-emerald-600/20 text-sm cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>مراسلة المشرف بالواتساب للشحن ({selectedPackForWhatsapp.toLocaleString()} عملة)</span>
            </a>
          </div>

          {/* MULTI-ACCOUNT SWITCHING & TESTING MODULE */}
          <div className="p-4 bg-stone-100/90 border border-stone-200 rounded-3xl space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-stone-200 text-stone-700">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-stone-900">إدارة البطاقات والتبديل بين الحسابات</h5>
                  <span className="text-[10px] text-stone-500">للتبديل بين بطاقات العملاء والتأكد من وصول العملات المحولة</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSwitchAccounts(!showSwitchAccounts)}
                className="text-xs font-bold text-amber-800 hover:text-amber-900 underline cursor-pointer"
              >
                {showSwitchAccounts ? 'إخفاء' : 'عرض البطاقات'}
              </button>
            </div>

            {showSwitchAccounts && (
              <div className="pt-2 border-t border-stone-200 space-y-3 animate-in fade-in">
                <button
                  type="button"
                  onClick={handleCreateNewTestAccount}
                  className="w-full py-2 px-3 rounded-2xl border border-dashed border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4 text-amber-700" />
                  <span>إنشاء بطاقة إضافية جديدة (برصيد 0 عملة)</span>
                </button>

                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  <span className="block text-[11px] font-bold text-stone-600">البطاقات المسجلة لديك:</span>
                  {knownClientsList.map((client) => {
                    const isCurrent = normalizeCardId(client.cardId) === normalizeCardId(userCard.cardId);
                    return (
                      <div
                        key={client.cardId}
                        className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all ${
                          isCurrent
                            ? 'bg-amber-50/90 border-amber-300 text-stone-900 shadow-xs'
                            : 'bg-white border-stone-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-amber-500 ring-2 ring-amber-300' : 'bg-stone-300'}`} />
                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-xs">{client.cardId}</span>
                              {isCurrent && (
                                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">الحالي</span>
                              )}
                            </div>
                            <span className="text-[10px] text-stone-500 truncate block">{client.memberName}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono font-black text-amber-800 text-xs">
                            {getCardBalance(client.cardId).toLocaleString()} عملة
                          </span>
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => handleSwitchToClient(client)}
                              className="px-2.5 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>تبديل</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleManualCardSwitch} className="pt-2 border-t border-stone-200 flex gap-2">
                  <input
                    type="text"
                    placeholder="اكتب رقم بطاقة أخرى (مثال: CLC-1234-5678)"
                    value={manualCardIdInput}
                    onChange={(e) => setManualCardIdInput(e.target.value)}
                    className="flex-1 bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs font-mono outline-none"
                    dir="ltr"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
                  >
                    دخول
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
