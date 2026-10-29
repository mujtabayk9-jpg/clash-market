import React, { useState } from 'react';
import { X, Send, ShieldCheck, User } from 'lucide-react';
import { AccountListing } from '../types/clash';

interface ChatModalProps {
  account: AccountListing | null;
  onClose: () => void;
  onBuy: (account: AccountListing) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'seller';
  text: string;
  time: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({ account, onClose, onBuy }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'seller',
      text: `أهلاً بك! أنا مالك حساب (${account?.title || 'القرية'}). الحساب جاهز للتسليم الفوري عبر وسيط سوق كلاش، ويمكنك الدفع بالبطاقات أو بعملة كلاش كوين (CLC)، كيف يمكنني مساعدتك؟`,
      time: '12:00',
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!account) return null;

  const quickQuestions = [
    'هل تغيير الاسم متاح مجاناً؟',
    'هل تقبل الدفع برصيد كلاش كوين (CLC)؟',
    'هل بريد الـ Supercell ID نظيف وبدون هاتف؟',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    setTimeout(() => {
      let reply = 'نعم بالتأكيد! الحساب جاهز ومطابق للوصف تماماً والوسيط يشرف على التسليم خطوة بخطوة.';
      if (text.includes('الاسم')) {
        reply = `حالة تغيير الاسم هي: ${account.nameChangeStatus}، ويمكنك تغييره فور تسجيل الدخول.`;
      } else if (text.includes('كلاش كوين') || text.includes('CLC')) {
        reply = `نعم بكل سرور! الدفع بعملة كلاش كوين CLC مدعوم بالكامل ويمنحك خصماً فورياً بنسبة 5% في السلة.`;
      } else if (text.includes('Supercell') || text.includes('بريد') || text.includes('هاتف')) {
        reply = `نعم، ${account.supercellIdStatus} وبدون أي رقم هاتف استرجاع، يمكنك وضع إيميلك الشخصي مباشرة.`;
      }

      const sellerMsg: Message = {
        id: `s-${Date.now()}`,
        sender: 'seller',
        text: reply,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, sellerMsg]);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#faf8f5] border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700">
              <User className="w-5 h-5" />
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-stone-900">{account.sellerName}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <span className="text-[11px] text-stone-500 truncate block max-w-[200px]">
                بخصوص: تاون هول {account.townHallLevel} ({account.playerTag})
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-[#f6f2ea] text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-stone-950 font-medium rounded-bl-sm'
                    : 'bg-white text-stone-800 rounded-br-sm border border-stone-200'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Quick Question Buttons */}
        <div className="px-4 py-2 border-t border-stone-200 bg-white flex items-center gap-1.5 overflow-x-auto text-xs">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200 hover:border-amber-500 text-stone-700 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-stone-200 bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder="اكتب استفسارك للبائع..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:border-amber-600 outline-none text-right"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
