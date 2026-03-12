import { useState } from 'react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';

const vaccinations = [
  { age: 'При рождении', name: 'БЦЖ (туберкулёз)', id: 'bcg' },
  { age: 'При рождении', name: 'Гепатит B (1-я доза)', id: 'hepb1' },
  { age: '1 месяц', name: 'Гепатит B (2-я доза)', id: 'hepb2' },
  { age: '2 месяца', name: 'Пневмококк (1-я доза)', id: 'pneumo1' },
  { age: '3 месяца', name: 'АКДС (1-я доза)', id: 'dtp1' },
  { age: '3 месяца', name: 'Полиомиелит (1-я доза)', id: 'polio1' },
  { age: '4.5 месяца', name: 'АКДС (2-я доза)', id: 'dtp2' },
  { age: '4.5 месяца', name: 'Полиомиелит (2-я доза)', id: 'polio2' },
  { age: '4.5 месяца', name: 'Пневмококк (2-я доза)', id: 'pneumo2' },
  { age: '6 месяцев', name: 'АКДС (3-я доза)', id: 'dtp3' },
  { age: '6 месяцев', name: 'Полиомиелит (3-я доза)', id: 'polio3' },
  { age: '6 месяцев', name: 'Гепатит B (3-я доза)', id: 'hepb3' },
  { age: '12 месяцев', name: 'Корь, краснуха, паротит', id: 'mmr1' },
  { age: '15 месяцев', name: 'Пневмококк (ревакцинация)', id: 'pneumo3' },
  { age: '18 месяцев', name: 'АКДС (ревакцинация)', id: 'dtp4' },
  { age: '20 месяцев', name: 'Полиомиелит (ревакцинация)', id: 'polio4' },
];

const VaccinationPage = () => {
  const [done, setDone] = useState<Record<string, { date: string; reaction: string }>>(() => {
    const s = localStorage.getItem('kindi_vaccines');
    return s ? JSON.parse(s) : {};
  });

  const toggleVaccine = (id: string) => {
    let next: typeof done;
    if (done[id]) {
      const { [id]: _, ...rest } = done;
      next = rest;
    } else {
      next = { ...done, [id]: { date: new Date().toISOString().split('T')[0], reaction: '' } };
    }
    setDone(next);
    localStorage.setItem('kindi_vaccines', JSON.stringify(next));
  };

  const setReaction = (id: string, reaction: string) => {
    const next = { ...done, [id]: { ...done[id], reaction } };
    setDone(next);
    localStorage.setItem('kindi_vaccines', JSON.stringify(next));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <PageHeader title="Вакцинации" />
      <div className="px-5 pb-24 space-y-3">
        {vaccinations.map(v => (
          <div key={v.id} className={`p-4 rounded-2xl border ${done[v.id] ? 'bg-primary/10 border-primary' : 'bg-card border-border'}`}>
            <div className="flex items-start gap-3">
              <button onClick={() => toggleVaccine(v.id)} className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${done[v.id] ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                {done[v.id] && <span className="text-primary-foreground text-xs">✓</span>}
              </button>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{v.age}</p>
                <p className="font-semibold text-foreground text-sm">{v.name}</p>
                {done[v.id] && (
                  <input placeholder="Реакция (опционально)" value={done[v.id].reaction} onChange={e => setReaction(v.id, e.target.value)} className="mt-2 w-full text-xs p-2 rounded-lg border border-border bg-card" />
                )}
              </div>
              <button onClick={() => { toast.info('Напоминание установлено!'); }} className="text-xs text-primary font-semibold">🔔</button>
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
};

export default VaccinationPage;
