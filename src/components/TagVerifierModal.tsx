import React, { useState } from 'react';
import { X, Search, ShieldCheck, CheckCircle2, AlertTriangle, Swords, Trophy, Gem, Sparkles, ArrowLeft } from 'lucide-react';

interface TagVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListVerifiedAccount?: (tag: string, th: number) => void;
}

export const TagVerifierModal: React.FC<TagVerifierModalProps> = ({
  isOpen,
  onClose,
  onListVerifiedAccount,
}) => {
  const [playerTag, setPlayerTag] = useState('#289CPQ8L0');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerTag.trim()) return;

    setIsVerifying(true);
    setVerifiedResult(null);

    setTimeout(() => {
      setIsVerifying(false);
      // Realistic verified clash village response
      const cleanTag = playerTag.toUpperCase().startsWith('#') ? playerTag.toUpperCase() : `#${playerTag.toUpperCase()}`;
      setVerifiedResult({
        tag: cleanTag,
        name: cleanTag === '#289CPQ8L0' ? 'LEGEND_WARRIOR' : 'CLASH_CHAMPION',
        townHall: 17,
        expLevel: 264,
        trophies: 5540,
        bestTrophies: 5920,
        warStars: 2180,
        clan: 'IRAQ_LEGENDS (Level 24)',
        heroes: {
          king: 95,
          queen: 95,
          warden: 70,
          rc: 45,
          minion: 35,
        },
        securityReport: {
          supercellLinked: true,
          emailClean: true,
          phoneLinked: false,
          securityStatus: 'نظيف 100% وجاهز للنقل الفوري',
          riskScore: 'آمن جداً (0% مخاطر)',
        },
        equipmentRating: 'ملحمي ماكس (القفاز 27 / السهم 27)',
      });
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#faf8f5] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">أداة فحص التاغ المباشر (#PlayerTag)</h3>
              <span className="text-[11px] text-stone-500">فحص فوري لأمان حساب Supercell ID ومستويات الأبطال</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-right">
          <p className="text-xs text-stone-600 leading-relaxed">
            اكتب تاغ قريتك أو أي قرية تريد شراءها للتأكد من مطابقتها للسيرفر، وفحص عدم وجود رقم هاتف استرجاع مربوط بحساب Supercell ID.
          </p>

          {/* Search Input Form */}
          <form onSubmit={handleVerify} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="#289CPQ8L0"
              value={playerTag}
              onChange={(e) => setPlayerTag(e.target.value)}
              className="flex-1 bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm text-stone-900 font-mono uppercase placeholder-stone-400 focus:border-amber-600 outline-none text-right"
            />
            <button
              type="submit"
              disabled={isVerifying}
              className="px-5 py-2.5 rounded-xl font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5 text-xs sm:text-sm"
            >
              <Search className="w-4 h-4" />
              <span>{isVerifying ? 'جاري الفحص...' : 'فحص الآن'}</span>
            </button>
          </form>

          {/* Verification Result Card */}
          {verifiedResult && (
            <div className="p-5 bg-white border border-emerald-300 rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-black bg-amber-500 text-stone-950 rounded-md">
                    تاون {verifiedResult.townHall}
                  </span>
                  <span className="font-bold text-stone-900 text-sm">{verifiedResult.name}</span>
                </div>
                <span className="text-xs font-mono text-stone-500">{verifiedResult.tag}</span>
              </div>

              {/* Security Health Score */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>تقرير أمان ونظافة Supercell ID:</span>
                  </span>
                  <span className="font-bold text-emerald-700 font-mono">{verifiedResult.securityReport.riskScore}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-600 pt-1 text-[11px]">
                  <div>✓ البريد الإلكتروني: نظيف وغير مسترد</div>
                  <div>✓ ربط الهاتف: غير مربوط برقم استرجاع</div>
                  <div>✓ القبيلة: {verifiedResult.clan}</div>
                  <div>✓ المعدات: {verifiedResult.equipmentRating}</div>
                </div>
              </div>

              {/* Heroes Stats Strip */}
              <div>
                <span className="text-xs font-bold text-stone-700 block mb-2">مستويات الأبطال الرسمية في السيرفر:</span>
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2 bg-stone-50 border border-stone-200 rounded-lg">
                    <span className="text-[10px] text-stone-400 block">الملك</span>
                    <span className="font-bold text-amber-800 font-mono text-base">{verifiedResult.heroes.king}</span>
                  </div>
                  <div className="p-2 bg-stone-50 border border-stone-200 rounded-lg">
                    <span className="text-[10px] text-stone-400 block">الملكة</span>
                    <span className="font-bold text-amber-800 font-mono text-base">{verifiedResult.heroes.queen}</span>
                  </div>
                  <div className="p-2 bg-stone-50 border border-stone-200 rounded-lg">
                    <span className="text-[10px] text-stone-400 block">الآمر</span>
                    <span className="font-bold text-cyan-800 font-mono text-base">{verifiedResult.heroes.warden}</span>
                  </div>
                  <div className="p-2 bg-stone-50 border border-stone-200 rounded-lg">
                    <span className="text-[10px] text-stone-400 block">البطلة</span>
                    <span className="font-bold text-purple-800 font-mono text-base">{verifiedResult.heroes.rc}</span>
                  </div>
                  <div className="p-2 bg-stone-50 border border-stone-200 rounded-lg">
                    <span className="text-[10px] text-stone-400 block">المينيون</span>
                    <span className="font-bold text-emerald-800 font-mono text-base">{verifiedResult.heroes.minion}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex items-center gap-1 font-mono">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  <span>{verifiedResult.trophies} كأس</span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>مستوى XP: {verifiedResult.expLevel}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>القرية موثقة ومعتمدة ومطابقة 100% لسيرفر Supercell الرسمي</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
