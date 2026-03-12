import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';

const upperTeeth = [
  { id: 'u1', label: 'Центральный резец (П)' },
  { id: 'u2', label: 'Центральный резец (Л)' },
  { id: 'u3', label: 'Боковой резец (П)' },
  { id: 'u4', label: 'Боковой резец (Л)' },
  { id: 'u5', label: 'Клык (П)' },
  { id: 'u6', label: 'Клык (Л)' },
  { id: 'u7', label: '1й моляр (П)' },
  { id: 'u8', label: '1й моляр (Л)' },
  { id: 'u9', label: '2й моляр (П)' },
  { id: 'u10', label: '2й моляр (Л)' },
];
const lowerTeeth = [
  { id: 'l1', label: 'Центральный резец (П)' },
  { id: 'l2', label: 'Центральный резец (Л)' },
  { id: 'l3', label: 'Боковой резец (П)' },
  { id: 'l4', label: 'Боковой резец (Л)' },
  { id: 'l5', label: 'Клык (П)' },
  { id: 'l6', label: 'Клык (Л)' },
  { id: 'l7', label: '1й моляр (П)' },
  { id: 'l8', label: '1й моляр (Л)' },
  { id: 'l9', label: '2й моляр (П)' },
  { id: 'l10', label: '2й моляр (Л)' },
];

const TeethingPage = () => {
  const [erupted, setErupted] = useState<Record<string, 'erupted' | 'coming'>>(() => {
    const s = localStorage.getItem('kindi_teeth');
    return s ? JSON.parse(s) : {};
  });

  const toggle = (id: string) => {
    const current = erupted[id];
    let next: Record<string, 'erupted' | 'coming'>;
    if (!current) next = { ...erupted, [id]: 'coming' };
    else if (current === 'coming') next = { ...erupted, [id]: 'erupted' };
    else { const { [id]: _, ...rest } = erupted; next = rest; }
    setErupted(next);
    localStorage.setItem('kindi_teeth', JSON.stringify(next));
  };

  const renderTeethRow = (teeth: typeof upperTeeth, label: string) => (
    <div className="mb-4">
      <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
      <div className="grid grid-cols-5 gap-2">
        {teeth.map(tooth => (
          <button key={tooth.id} onClick={() => toggle(tooth.id)} className={`aspect-square rounded-full border-2 flex items-center justify-center text-lg transition-colors ${
            erupted[tooth.id] === 'erupted' ? 'bg-primary border-primary' :
            erupted[tooth.id] === 'coming' ? 'bg-blue-100 border-blue-400' :
            'bg-card border-border'
          }`} title={tooth.label}>
            🦷
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <PageHeader title="Прорезывание зубов" />
      <div className="px-5 pb-24">
        <p className="text-xs text-muted-foreground mb-4">Нажмите: 1 раз — режется (синий), 2 — прорезался (жёлтый), 3 — сброс</p>
        {renderTeethRow(upperTeeth, '🔼 Верхняя челюсть')}
        {renderTeethRow(lowerTeeth, '🔽 Нижняя челюсть')}

        <div className="mt-6 bg-card border border-border rounded-2xl p-4">
          <h3 className="font-bold text-foreground mb-2">📅 Дневник зубов</h3>
          <p className="text-sm text-muted-foreground">Календарь отметок беспокойных дней — скоро</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default TeethingPage;
