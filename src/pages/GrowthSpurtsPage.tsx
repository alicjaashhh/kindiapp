import { useState, useEffect } from 'react';
import { differenceInWeeks } from 'date-fns';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';

const SPURT_WEEKS = [5, 8, 12, 19, 26, 37, 46, 55, 64, 75];

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
        <p className="text-sm text-muted-foreground mb-4">Возраст малыша: <span className="font-bold text-foreground">{babyWeeks} недель</span></p>
        <div className="space-y-3">
          {SPURT_WEEKS.map(week => {
            const isPast = babyWeeks > week;
            const isCurrent = babyWeeks === week;
            return (
              <div key={week} className={`flex items-center gap-4 p-4 rounded-2xl border ${isCurrent ? 'bg-blue-50 border-blue-400' : isPast ? 'bg-card border-border opacity-60' : 'bg-card border-border'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isCurrent ? 'bg-blue-500 text-white' : isPast ? 'bg-muted text-muted-foreground' : 'bg-primary/20 text-primary'}`}>
                  {week}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{week}-я неделя</p>
                  <p className="text-xs text-muted-foreground">{isCurrent ? '🔥 Сейчас идёт скачок!' : isPast ? 'Пройден ✓' : 'Впереди'}</p>
                </div>
                {isCurrent && <span className="text-2xl">📈</span>}
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
