import React from 'react';
import { X, Swords, Coins } from 'lucide-react';
import { AccountListing } from '../types/clash';

interface CompareModalProps {
  accounts: AccountListing[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
  onInspect: (account: AccountListing) => void;
  onBuy: (account: AccountListing) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  accounts,
  onRemove,
  onClear,
  onClose,
  onInspect,
  onBuy,
}) => {
  if (accounts.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#faf8f5] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-stone-900">مقارنة قرى وحسابات كلاش أوف كلانس ({accounts.length})</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClear}
              className="text-xs text-stone-500 hover:text-stone-800 px-2 py-1 rounded cursor-pointer"
            >
              مسح الكل
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Table / Columns */}
        <div className="p-6 overflow-y-auto text-right">
          <div className={`grid gap-4 ${accounts.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
            {accounts.map((acc) => {
              const priceInCoins = acc.priceUSD * 100;

              return (
                <div key={acc.id} className="p-4 bg-white border border-stone-200 rounded-2xl space-y-4 relative shadow-xs">
                  <button
                    onClick={() => onRemove(acc.id)}
                    className="absolute top-3 left-3 p-1 rounded-md text-stone-400 hover:text-rose-600 bg-stone-100 hover:bg-rose-50 border border-stone-200 transition-colors cursor-pointer"
                    title="إزالة من المقارنة"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3">
                    <img
                      src={acc.image}
                      alt={acc.title}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-amber-700">تاون هول {acc.townHallLevel}</span>
                      <h4 className="text-sm font-bold text-stone-900 truncate">{acc.title}</h4>
                      <div className="flex items-baseline gap-1.5 mt-1">
                        <Coins className="w-4 h-4 text-amber-600 self-center" />
                        <span className="text-base font-extrabold text-amber-900 font-mono tabular-nums">
                          {priceInCoins.toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-stone-700">عملة</span>
                      </div>
                    </div>
                  </div>

                  {/* Attributes Spec List */}
                  <div className="space-y-2 text-xs divide-y divide-stone-100">
                    <div className="flex justify-between pt-2">
                      <span className="text-stone-500">الملك البربري:</span>
                      <span className="font-bold text-amber-800 font-mono">{acc.heroes.barbarianKing}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-stone-500">الملكة رامية السهام:</span>
                      <span className="font-bold text-amber-800 font-mono">{acc.heroes.archerQueen}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-stone-500">الآمر الكبير:</span>
                      <span className="font-bold text-cyan-800 font-mono">{acc.heroes.grandWarden}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-stone-500">البطلة الملكية:</span>
                      <span className="font-bold text-purple-800 font-mono">{acc.heroes.royalChampion}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-stone-500">الجواهر:</span>
                      <span className="font-bold text-emerald-700 font-mono">{acc.gems.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-stone-500">الكؤوس:</span>
                      <span className="font-bold text-stone-900 font-mono">{acc.trophies.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-stone-500">تغيير الاسم:</span>
                      <span className="font-semibold text-stone-800">{acc.nameChangeStatus}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-stone-500">القرية الليلية:</span>
                      <span className="font-mono text-stone-800">BH {acc.builderHallLevel}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        onInspect(acc);
                      }}
                      className="py-2 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs text-stone-800 font-medium transition-colors cursor-pointer"
                    >
                      فحص القرية
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onBuy(acc);
                      }}
                      className="py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-xs text-stone-950 font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      شراء بالعملات
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
