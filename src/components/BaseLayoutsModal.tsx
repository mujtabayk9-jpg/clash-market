import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Shield, Swords, Trophy, Sparkles } from 'lucide-react';

interface BaseLayoutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BaseLayout {
  id: string;
  townHall: number;
  type: 'war' | 'trophy' | 'farm';
  typeName: string;
  title: string;
  description: string;
  copyUrl: string;
  downloadsCount: number;
  rating: number;
}

export const BaseLayoutsModal: React.FC<BaseLayoutsModalProps> = ({ isOpen, onClose }) => {
  const [selectedTH, setSelectedTH] = useState<number>(17);
  const [selectedType, setSelectedType] = useState<'all' | 'war' | 'trophy' | 'farm'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const layouts: BaseLayout[] = [
    {
      id: 'th17-war-1',
      townHall: 17,
      type: 'war',
      typeName: 'تصميم حروب CWL',
      title: 'مخطط تاون 17 مضاد لـ 3 نجوم وهجمات تنين الكهرباء',
      description: 'جزر دفاعية معزولة تفصل المونوليث وأبراج التعاويذ عن قلب التاون، توزيع أفخاخ إعصار مدروسة.',
      copyUrl: 'https://link.clashofclans.com/ar?action=OpenLayout&id=TH17:WB:WAR_DEFENSE_PRO_01',
      downloadsCount: 1420,
      rating: 4.96,
    },
    {
      id: 'th17-trophy-2',
      townHall: 17,
      type: 'trophy',
      typeName: 'دوري الأساطير (Legend)',
      title: 'تصميم أساطير لحماية الكؤوس +5600',
      description: 'مقاوم لهجمات راكبو الجذور (Root Riders) مع تسليط أقصى نيران على المداخل الرئيسية.',
      copyUrl: 'https://link.clashofclans.com/ar?action=OpenLayout&id=TH17:WB:LEGEND_PUSH_MAX_02',
      downloadsCount: 980,
      rating: 4.92,
    },
    {
      id: 'th16-war-1',
      townHall: 16,
      type: 'war',
      typeName: 'تصميم حروب احترافي',
      title: 'مخطط تاون 16 بطولات عالمية ومباريات دوري القبائل',
      description: 'مركز دفاعي كاسح يمنع الهبوط الجوي للبالون والتنين الكهربائي ويحمي مدفعية النسر.',
      copyUrl: 'https://link.clashofclans.com/ar?action=OpenLayout&id=TH16:WB:WAR_CHAMPIONS_03',
      downloadsCount: 2310,
      rating: 4.95,
    },
    {
      id: 'th16-farm-2',
      townHall: 16,
      type: 'farm',
      typeName: 'حماية الموارد والنفط',
      title: 'حماية الإكسير الأسود ومخازن الذهب للتاون 16',
      description: 'توزيع متناغم لمخازن الموارد داخل حلقات الجدران المزدوجة لحماية الغنائم.',
      copyUrl: 'https://link.clashofclans.com/ar?action=OpenLayout&id=TH16:WB:FARMING_LOOT_SAFE_04',
      downloadsCount: 1650,
      rating: 4.88,
    },
    {
      id: 'th15-war-1',
      townHall: 15,
      type: 'war',
      typeName: 'تصميم حروب مضاد للثلج',
      title: 'مخطط تاون 15 المونوليث المركزي الحصين',
      description: 'تشتيت لقوات الخصم حول الأطراف وإجبار أبطال الخصم على الدخول في فخاخ القنابل العملاقة.',
      copyUrl: 'https://link.clashofclans.com/ar?action=OpenLayout&id=TH15:WB:WAR_DIAMOND_BASE_05',
      downloadsCount: 1890,
      rating: 4.91,
    },
    {
      id: 'th14-war-1',
      townHall: 14,
      type: 'war',
      typeName: 'تصميم حروب الغابة',
      title: 'مخطط تاون 14 ماكس مضاد لهجوم الساحرات والتنانين',
      description: 'تصميم كلاسيكي تم اختباره في مئات الحروب بنسبة دفاعات ناجحة 85%.',
      copyUrl: 'https://link.clashofclans.com/ar?action=OpenLayout&id=TH14:WB:WAR_ANTI_DRAG_06',
      downloadsCount: 1470,
      rating: 4.87,
    },
  ];

  const filteredLayouts = layouts.filter((l) => {
    if (l.townHall !== selectedTH) return false;
    if (selectedType !== 'all' && l.type !== selectedType) return false;
    return true;
  });

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#faf8f5] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 border border-amber-300 text-amber-700">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">مخططات وتصاميم القرى مجاناً (Base Layouts)</h3>
              <span className="text-[11px] text-stone-500">مع روابط النسخ المباشرة إلى داخل لعبة كلاش أوف كلانس</span>
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
          {/* Town Hall Selector */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 p-1 rounded-xl shadow-xs text-xs">
              {[17, 16, 15, 14].map((th) => (
                <button
                  key={th}
                  onClick={() => setSelectedTH(th)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    selectedTH === th ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  تاون {th}
                </button>
              ))}
            </div>

            {/* Type selector */}
            <div className="flex items-center gap-1 bg-stone-100 border border-stone-200 p-1 rounded-xl text-xs">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                  selectedType === 'all' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setSelectedType('war')}
                className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                  selectedType === 'war' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                حروب CWL
              </button>
              <button
                onClick={() => setSelectedType('trophy')}
                className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                  selectedType === 'trophy' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                رفع كؤوس
              </button>
              <button
                onClick={() => setSelectedType('farm')}
                className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                  selectedType === 'farm' ? 'bg-white text-stone-900 font-bold shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                موارد
              </button>
            </div>
          </div>

          {/* Layouts List */}
          <div className="space-y-3">
            {filteredLayouts.length > 0 ? (
              filteredLayouts.map((layout) => {
                const isCopied = copiedId === layout.id;

                return (
                  <div key={layout.id} className="p-4 bg-white border border-stone-200 rounded-2xl space-y-3 shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">
                            {layout.typeName}
                          </span>
                          <span className="text-xs font-mono text-stone-400">
                            ⭐ {layout.rating} · ({layout.downloadsCount.toLocaleString()} نسخة)
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900">{layout.title}</h4>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {layout.description}
                    </p>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-stone-500">
                        اضغط لنسخ الرابط وافتحه في هاتفك ليتم تنزيل المخطط فوراً باللعبة.
                      </span>

                      <button
                        onClick={() => handleCopy(layout.id, layout.copyUrl)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isCopied
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>تم نسخ رابط المخطط!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ المخطط للعبة</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-stone-500 bg-white border border-dashed border-stone-200 rounded-2xl">
                لا توجد تصاميم بهذا التصنيف حالياً، اختر تصنيفاً آخر.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
