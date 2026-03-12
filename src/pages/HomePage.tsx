import { useState, useEffect, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, getDay, differenceInWeeks, differenceInMonths, addWeeks, isSameDay, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import FloatingAnimals from '@/components/FloatingAnimals';
import kangarooLogo from '@/assets/kangaroo-logo.png';

const SPURT_WEEKS = [5, 8, 12, 19, 26, 37, 46, 55, 64, 75];

const getProductsByAge = (months: number) => {
  if (months < 3) return [
    { name: 'Подгузники', emoji: '🧷', price: '990 ₽' },
    { name: 'Пелёнки', emoji: '🧵', price: '650 ₽' },
  ];
  if (months < 6) return [
    { name: 'Погремушка', emoji: '🎀', price: '450 ₽' },
    { name: 'Прорезыватель', emoji: '🦷', price: '350 ₽' },
  ];
  if (months < 12) return [
    { name: 'Стульчик', emoji: '🪑', price: '4 990 ₽' },
    { name: 'Прикорм', emoji: '🥄', price: '280 ₽' },
  ];
  if (months < 24) return [
    { name: 'Книжка', emoji: '📚', price: '520 ₽' },
    { name: 'Сортер', emoji: '🔶', price: '890 ₽' },
  ];
  return [
    { name: 'Конструктор', emoji: '🧱', price: '1 290 ₽' },
    { name: 'Набор для рисования', emoji: '🎨', price: '780 ₽' },
  ];
};

const HomePage = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [baby, setBaby] = useState<{ name: string; birthDate: string; gender: string; id?: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('kindi_baby');
    if (stored) setBaby(JSON.parse(stored));
  }, []);

  const birthDate = baby?.birthDate ? new Date(baby.birthDate) : null;
  const babyWeeks = birthDate ? differenceInWeeks(new Date(), birthDate) : 0;
  const babyMonths = birthDate ? differenceInMonths(new Date(), birthDate) : 0;
  const babyDays = birthDate ? differenceInDays(new Date(), birthDate) : 0;

  // Growth spurt dates
  const spurtDates = useMemo(() => {
    if (!birthDate) return [];
    return SPURT_WEEKS.map(w => addWeeks(birthDate, w));
  }, [birthDate]);

  const isSpurtDay = (day: Date) => spurtDates.some(s => isSameDay(s, day));
  const isCurrentlyInSpurt = SPURT_WEEKS.includes(babyWeeks);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const paddingDays = startDay === 0 ? 6 : startDay - 1;

  const products = getProductsByAge(babyMonths);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      <FloatingAnimals />

      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <img src={kindiLogo} alt="Kindi" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <span className="font-bold text-lg text-foreground">{baby?.name || 'Малыш'}</span>
            <p className="text-xs text-muted-foreground">День {babyDays} • {babyWeeks} нед</p>
          </div>
        </div>
        <span className="text-sm text-muted-foreground">{format(new Date(), 'd MMM yyyy', { locale: ru })}</span>
      </div>

      {/* Calendar */}
      <div className="mx-5 rounded-2xl bg-card p-4 shadow-sm relative z-10" onClick={() => setShowFullCalendar(!showFullCalendar)}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={e => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)); }}>
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <span className="font-semibold text-foreground capitalize">
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </span>
          <button onClick={e => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)); }}>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
            <div key={d} className="text-xs text-muted-foreground font-medium py-1">{d}</div>
          ))}
          {Array.from({ length: paddingDays }).map((_, i) => <div key={`p-${i}`} />)}
          {days.map(day => {
            const spurt = isSpurtDay(day);
            const today = isToday(day);
            return (
              <div key={day.toISOString()} className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full text-sm font-medium flex items-center justify-center ${
                  today && spurt ? 'bg-blue-500 text-white' :
                  today ? 'bg-primary text-primary-foreground' :
                  spurt ? 'bg-blue-100 text-blue-700' :
                  'text-foreground'
                }`}>
                  {format(day, 'd')}
                </div>
                {spurt && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-0.5" />}
              </div>
            );
          })}
        </div>
        {isCurrentlyInSpurt && (
          <div className="mt-3 text-center text-sm text-blue-600 font-semibold bg-blue-50 rounded-xl py-2">
            📈 Сегодня пик роста — малышу нужна особая забота
          </div>
        )}
      </div>

      {/* Today cards */}
      <div className="mt-5 px-5 relative z-10">
        <h2 className="font-bold text-foreground mb-3">Сегодня</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {[
            { title: 'Поведение', emoji: '😊', desc: 'Активный, капризный, спокойный' },
            { title: 'Зубы', emoji: '🦷', desc: 'Отметьте какие лезут' },
            { title: 'Рост/вес', emoji: '📏', desc: 'Напоминание измерить' },
          ].map(card => (
            <button key={card.title} className="min-w-[140px] bg-card rounded-2xl p-4 shadow-sm text-left flex-shrink-0 hover:shadow-md transition-shadow border border-border">
              <span className="text-2xl">{card.emoji}</span>
              <h3 className="font-semibold text-foreground mt-2 text-sm">{card.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-5 px-5 relative z-10">
        <h2 className="font-bold text-foreground mb-3">Рекомендации на сегодня</h2>
        <div className="space-y-3">
          {[
            { title: 'Скачок роста', desc: isCurrentlyInSpurt ? `Сейчас ${babyWeeks}-я неделя — скачок роста!` : `${babyWeeks}-я неделя — всё стабильно` },
            { title: 'Развитие', desc: `В ${babyMonths} мес. попробуйте новые упражнения` },
          ].map(rec => (
            <div key={rec.title} className="bg-card rounded-2xl p-4 shadow-sm border border-border">
              <h3 className="font-semibold text-foreground text-sm">{rec.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{rec.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product recommendations */}
      <div className="mt-5 px-5 pb-24 relative z-10">
        <h2 className="font-bold text-foreground mb-3">Подобрано для вас</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {products.map(p => (
            <div key={p.name} className="min-w-[140px] bg-card rounded-2xl p-4 shadow-sm border border-border flex-shrink-0 text-center">
              <span className="text-3xl">{p.emoji}</span>
              <h3 className="font-semibold text-foreground text-sm mt-2">{p.name}</h3>
              <p className="font-bold text-foreground text-xs mt-1">{p.price}</p>
              <button onClick={() => navigate('/shop')} className="mt-2 w-full py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold">В магазин</button>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default HomePage;
