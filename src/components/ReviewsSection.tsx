import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle2, User, Send } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  accountBought: string;
  paymentMethod: string;
  text: string;
}

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      name: 'أبو علي التميمي',
      location: 'بغداد - المنصور',
      rating: 5,
      date: 'منذ يومين',
      accountBought: 'تاون هول 17 ماكس',
      paymentMethod: 'رصيد آسياسيل (تحويل مباشر)',
      text: 'أفضل تجربة وساطة والله، حولت رصيد آسيا للوسيط واستلمت كود السوبر سيل وغيرت الإيميل خلال 5 دقائق. عاشت إيديكم على الأمانة.',
    },
    {
      id: 'rev-2',
      name: 'كرار البصراوي',
      location: 'البصرة',
      rating: 5,
      date: 'منذ 3 أيام',
      accountBought: 'تاون هول 16 أبطال ماكس',
      paymentMethod: 'كلاش كوين (CLC)',
      text: 'شحنت كلاش كوين بالماستر واستفدت من خصم الـ 5%، القرية مطابقة للوصف بالضبط وكل المعدات الملحمية ليفل 27.',
    },
    {
      id: 'rev-3',
      name: 'أحمد الموصلي',
      location: 'الموصل',
      rating: 5,
      date: 'منذ 5 أيام',
      accountBought: 'تاون هول 15 كوني',
      paymentMethod: 'كارت شحن آسياسيل 50$',
      text: 'دخلت كود الكارت وشحنت على السريع، استلمت الحساب كامل بدون أي رقم هاتف والوسيط تابع وياي على الواتساب خطوة بخطوة.',
    },
    {
      id: 'rev-4',
      name: 'سيف الحلي',
      location: 'بابل',
      rating: 5,
      date: 'منذ أسبوع',
      accountBought: 'تاون 14 غابوي',
      paymentMethod: 'زين كاش (ZainCash)',
      text: 'سعر مناسب جداً وتغيير الاسم مجاني مثل ما مكتوب، منصة موثوقة وأنصح كل لاعب كلاش يجربها.',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newText, setNewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newAccount, setNewAccount] = useState('تاون هول 16');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newText.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      name: newName.trim(),
      location: newLocation.trim() || 'العراق',
      rating: newRating,
      date: 'الآن',
      accountBought: newAccount,
      paymentMethod: 'كلاش كوين / آسيا',
      text: newText.trim(),
    };

    setReviews([newRev, ...reviews]);
    setNewName('');
    setNewLocation('');
    setNewText('');
    setShowAddForm(false);
  };

  return (
    <section className="mt-16 pt-12 border-t border-stone-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-stone-900">تقييمات وآراء المشترين الحقيقيين</h3>
            <span className="text-xs text-amber-700 font-mono font-bold">(4.98 / 5.0)</span>
          </div>
          <p className="text-xs text-stone-500">
            أكثر من 1,200 لاعب كلاش وثقوا بالوساطة واستلموا قراهم بأمان في العراق والوطن العربي.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 text-xs font-bold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer border border-stone-300"
        >
          {showAddForm ? 'إلغاء' : '+ أضف تقييمك وتجربتك'}
        </button>
      </div>

      {/* Add Review Form */}
      {showAddForm && (
        <form onSubmit={handleAddReview} className="p-5 bg-white border border-stone-200 rounded-2xl mb-8 space-y-4 shadow-xs text-right text-xs">
          <h4 className="font-bold text-stone-800 text-sm">شارك تجربتك مع وسيط سوق كلاش:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-600 mb-1">اسمك:</label>
              <input
                type="text"
                required
                placeholder="مثال: حيدر البغدادي"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1">المدينة أو المحافظة:</label>
              <input
                type="text"
                placeholder="بغداد، البصرة، أربيل..."
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-stone-600 mb-1">الحساب المشترى:</label>
              <input
                type="text"
                value={newAccount}
                onChange={(e) => setNewAccount(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-600 mb-1">رأيك بالتسليم والوساطة:</label>
            <textarea
              required
              rows={3}
              placeholder="اكتب تفاصيل تجربتك وسرعة استلام كود السوبر سيل..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg p-3 text-stone-900 outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer shadow-xs"
          >
            نشر التقييم فوراً
          </button>
        </form>
      )}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((r) => (
          <div key={r.id} className="p-4 bg-white border border-stone-200 rounded-2xl space-y-3 shadow-xs text-right">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">{r.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-[11px] text-stone-400">{r.location} · {r.date}</span>
                </div>
              </div>

              <div className="flex items-center text-amber-500">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed">
              "{r.text}"
            </p>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>الحساب: <strong className="text-stone-800">{r.accountBought}</strong></span>
              <span className="text-amber-800 font-medium">طريقة الدفع: {r.paymentMethod}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
