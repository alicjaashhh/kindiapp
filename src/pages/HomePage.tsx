import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { User, BarChart3, ShoppingBag, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const tabs = [
  { icon: User, label: 'Аккаунт', id: 'account' },
  { icon: BarChart3, label: 'Развитие', id: 'development' },
  { icon: ShoppingBag, label: 'Магазин', id: 'shop' },
  { icon: BookOpen, label: 'Статьи', id: 'articles' },
];

const todayCards = [
  { title: 'Поведение', emoji: '😊', desc: 'Активный, капризный, спокойный' },
  { title: 'Зубы', emoji: '🦷', desc: 'Отметьте какие лезут' },
  { title: 'Рост/вес', emoji: '📏', desc: 'Напоминание измерить' },
];

const recommendations = [
  { title: 'Скачок роста', desc: 'Сегодня 5-я неделя — возможен скачок роста' },
  { title: 'Игрушки', desc: 'Попробуйте дать погремушку' },
  { title: 'Сон', desc: 'В этом возрасте нормально спать 14-17 часов' },
];

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [baby, setBaby] = useState<{ name: string; birthDate: string; gender: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('kindi_baby');
    if (stored) setBaby(JSON.parse(stored));
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = getDay(monthStart);
  const paddingDays = startDay === 0 ? 6 : startDay - 1;

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
            {baby?.gender === 'girl' ? '👧' : '👶'}
          </div>
          <span className="font-bold text-lg text-foreground">{baby?.name || 'Малыш'}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {format(new Date(), 'd MMMM yyyy', { locale: ru })}
        </span>
      </div>

      {/* Calendar */}
      <div className="mx-5 rounded-2xl bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <span className="font-semibold text-foreground capitalize">
            {format(currentMonth, 'LLLL yyyy', { locale: ru })}
          </span>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
            <div key={d} className="text-xs text-muted-foreground font-medium py-1">{d}</div>
          ))}
          {Array.from({ length: paddingDays }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {days.map((day) => (
            <button
              key={day.toISOString()}
              className={`relative w-9 h-9 mx-auto rounded-full text-sm font-medium flex items-center justify-center transition-colors ${
                isToday(day)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {format(day, 'd')}
            </button>
          ))}
        </div>
      </div>

      {/* Today cards */}
      <div className="mt-5 px-5">
        <h2 className="font-bold text-foreground mb-3">Сегодня</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {todayCards.map((card) => (
            <button
              key={card.title}
              className="min-w-[140px] bg-card rounded-2xl p-4 shadow-sm text-left flex-shrink-0 hover:shadow-md transition-shadow border border-border"
            >
              <span className="text-2xl">{card.emoji}</span>
              <h3 className="font-semibold text-foreground mt-2 text-sm">{card.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-5 px-5 pb-24">
        <h2 className="font-bold text-foreground mb-3">Рекомендации на сегодня</h2>
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.title}
              className="bg-card rounded-2xl p-4 shadow-sm border border-border"
            >
              <h3 className="font-semibold text-foreground text-sm">{rec.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{rec.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border">
        <div className="flex items-center justify-around py-2 pb-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
