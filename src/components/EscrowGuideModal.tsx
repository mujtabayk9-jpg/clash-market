import React from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, HelpCircle } from 'lucide-react';

interface EscrowGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EscrowGuideModal: React.FC<EscrowGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#faf8f5] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-stone-900">دليل نظام الوساطة والضمان المالي (Escrow)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-right text-xs sm:text-sm">
          {/* 4-step sequence */}
          <div className="space-y-3">
            <h4 className="font-bold text-amber-800 text-sm">كيف تتم عملية البيع والشراء بدون أي مخاطرة احتيال؟</h4>

            <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-3 shadow-xs">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 border border-amber-300 text-xs font-mono">1</span>
                <div>
                  <h5 className="font-bold text-stone-900 mb-0.5">تجميد المبلغ في حساب الوساطة</h5>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    عند قيامك بالدفع (سواء بالبطاقة أو رصيد كلاش كوين CLC)، لا يذهب المبلغ لحساب البائع إطلاقاً، بل يتم قفله وتأمينه في خزنة وسيط المنصة.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 border border-amber-300 text-xs font-mono">2</span>
                <div>
                  <h5 className="font-bold text-stone-900 mb-0.5">تسليم بيانات الحساب وفحص القرية</h5>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    يستلم المشتري بيانات حساب الـ Supercell ID والكود الأولي لتسجيل الدخول في اللعبة ومعاينة القوات والأبطال والجواهر.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 border border-amber-300 text-xs font-mono">3</span>
                <div>
                  <h5 className="font-bold text-stone-900 mb-0.5">نقل وتغيير البريد الإلكتروني للمشتري</h5>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    يقوم المشتري بالدخول لإعدادات Supercell ID وتغيير البريد لبريده الشخصي وإلغاء أي جلسات سابقة.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 border border-emerald-300 text-xs font-mono">4</span>
                <div>
                  <h5 className="font-bold text-emerald-800 mb-0.5">تأكيد الرضا وتحويل المبلغ للبائع</h5>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    بعد تأكيد المشتري لنجاح النقل 100%، يتم الإفراج عن المبلغ للبائع، مع استمرار سريان ضمان المنصة لمدة 30 يوماً.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-3">
            <h4 className="font-bold text-stone-800 text-sm flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-stone-600" />
              <span>الأسئلة الشائعة والأمان</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-xs">
                <span className="font-bold text-stone-800 block mb-1">ماذا لو كان الحساب غير مطابق للمواصفات المعروضة؟</span>
                <p className="text-stone-600 leading-relaxed">
                  يحق للمشتري إلغاء الطلب فوراً بضغطة زر واسترجاع كامل أمواله أو رصيد كلاش كوين خلال دقائق دون أي خصم.
                </p>
              </div>

              <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-xs">
                <span className="font-bold text-stone-800 block mb-1">هل يمكن للبائع استرجاع الحساب بعد البيع؟</span>
                <p className="text-stone-600 leading-relaxed">
                  كافة الحسابات المفحوصة في المنصة تم التأكد من عدم ربطها برقم هاتف أو حسابات استرداد خارجية، كما يتم تقديم إثبات إبراء ذمة رسمي.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer text-sm shadow-xs"
          >
            فهمت آلية الضمان - إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
