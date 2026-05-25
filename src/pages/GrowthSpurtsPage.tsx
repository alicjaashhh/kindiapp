import { useState, useEffect } from 'react';
import { differenceInWeeks } from 'date-fns';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';

const SPURTS = [
  { week: 5, title: 'Мир ощущений', desc: 'Малыш чаще плачет, нужны объятия и контакт.' },
  { week: 8, title: 'Узнавание узоров', desc: 'Интерес к формам, теням. Беспокойный сон.' },
  { week: 12, title: 'Плавные переходы', desc: 'Гулит, замечает движение. Изменения в кормлении.' },
  { week: 19, title: 'События', desc: 'Понимает причину и следствие, тянет в рот всё подряд.' },
  { week: 26, title: 'Отношения и страх разлуки', desc: 'Прорезывание зубов, страх потери мамы.' },
  { week: 37, title: 'Категории', desc: 'Сортирует предметы. Капризы, плохой аппетит.' },
  { week: 46, title: 'Последовательности', desc: 'Складывает кубики. Учится самостоятельности.' },
  { week: 55, title: 'Программы', desc: 'Первые шаги, первые слова. Эмоциональные всплески.' },
  { week: 64, title: 'Принципы', desc: 'Хитрит, испытывает границы. Истерики.' },
  { week: 75, title: 'Системы', desc: 'Чувство «я», осознанные просьбы. Прорыв в речи.' },
];

const GrowthSpurtsPage = () => {
  const [babyWeeks, setBabyWeeks] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('kindi_baby');
    if (stored) {
      const baby = JSON.parse(stored);
      setBabyWeeks(differenceInWeeks(new Date(), new Date(baby.birthDate)));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <PageHeader title="Скачки роста" />
      <div className="px-5 pb-24">
        <p className="text-sm text-muted-foreground mb-4">
          Возраст малыша: <span className="font-bold text-foreground">{babyWeeks} недель</span>
        </p>
        <div className="space-y-3">
          {SPURTS.map(s => {
            const isPast = babyWeeks > s.week;
            const isCurrent = babyWeeks === s.week || (babyWeeks >= s.week - 1 && babyWeeks <= s.week + 1);
            return (
              <div key={s.week} className={`flex gap-4 p-4 rounded-2xl border ${
                isCurrent ? 'bg-blue-50 border-blue-400' : isPast ? 'bg-card border-border opacity-70' : 'bg-card border-border'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                  isCurrent ? 'bg-blue-500 text-white' : isPast ? 'bg-muted text-muted-foreground' : 'bg-primary/20 text-primary'
                }`}>
                  {s.week}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{s.week}-я неделя — {s.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                  <p className="text-xs font-medium mt-1.5">
                    {isCurrent ? '🔥 Идёт сейчас' : isPast ? '✓ Пройден' : '⏳ Впереди'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default GrowthSpurtsPage;
