import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, FileText, Copy, Check, Clock, Coins } from 'lucide-react';
import { AccountListing } from '../types/clash';

interface MyOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchasedAccounts: AccountListing[];
}

export const MyOrdersModal: React.FC<MyOrdersModalProps> = ({
  isOpen,
  onClose,
  purchasedAccounts,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#faf8f5] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-700">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">سجل طلباتي وفواتير الضمان المالي</h3>
              <span className="text-[11px] text-stone-500">حساباتك المشتراة بالعملات وبيانات Supercell ID وشهادات الضمان</span>
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
        <div className="p-6 overflow-y-auto space-y-4 text-right">
          {purchasedAccounts.length > 0 ? (
            purchasedAccounts.map((acc, index) => {
              const priceInCoins = acc.priceUSD * 100;
              const orderId = `ORD-COC-${acc.townHallLevel}X-${index + 1}849`;
              const simEmail = `clash.${acc.playerTag.replace('#', '').toLowerCase()}@supermail.net`;

              return (
                <div key={acc.id} className="p-4 bg-white border border-stone-200 rounded-2xl space-y-3 shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.image}
                        alt={acc.title}
                        className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500 text-stone-950 rounded">
                            تاون {acc.townHallLevel}
                          </span>
                          <span className="text-xs font-mono text-stone-400 font-bold">{orderId}</span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900">{acc.title}</h4>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <div className="flex items-baseline gap-1 justify-end font-mono">
                        <Coins className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-sm font-extrabold text-stone-900">
                          {priceInCoins.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-stone-600">عملة</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center justify-end gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>مدفوع بالعملات</span>
                      </span>
                    </div>
                  </div>

                  {/* Warranty Badge & Countdown */}
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>الضمان الذهبي مفعل ضد الاسترجاع</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>متبقي 29 يوماً و23 ساعة</span>
                    </div>
                  </div>

                  {/* Supercell Credentials Quick Copy */}
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">بريد الدخول المستلم:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-stone-800" dir="ltr">{simEmail}</span>
                        <button
                          onClick={() => copyText(acc.id, simEmail)}
                          className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                        >
                          {copiedId === acc.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 space-y-2">
              <FileText className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="text-sm font-bold text-stone-700">لم تقم بشراء أي قرية بعد</p>
              <p className="text-xs text-stone-500">
                عند إتمام شراء أي حساب، سيتم إدراج بيانات Supercell ID وفاتورة الضمان هنا فوراً.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
