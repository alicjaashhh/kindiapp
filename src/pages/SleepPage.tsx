import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';

const SleepPage = () => {
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [quality, setQuality] = useState<'good' | 'restless'>('good');
  const [sleepType, setSleepType] = useState<'day' | 'night'>('night');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const stored = localStorage.getItem('kindi_baby');
    const baby = stored ? JSON.parse(stored) : null;
    const babyId = baby?.id;
    if (!babyId) { toast.error('Не найден ребёнок'); return; }

    setSaving(true);
    const { error } = await supabase.from('baby_events').insert({
      baby_id: babyId,
      event_type: 'sleep',
      event_date: new Date().toISOString().split('T')[0],
      details: { sleepTime, wakeTime, quality, sleepType },
    });
    setSaving(false);
    if (error) { toast.error('Ошибка сохранения'); return; }
    toast.success('Сохранено!');
    setSleepTime(''); setWakeTime('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <PageHeader title="Сон" />
      <div className="px-5 pb-24 space-y-4">
        {/* Type */}
        <div className="flex gap-2">
          {(['night', 'day'] as const).map(t => (
            <button key={t} onClick={() => setSleepType(t)} className={`flex-1 py-2 rounded-xl text-sm font-semibold ${sleepType === t ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>
              {t === 'night' ? '🌙 Ночной' : '☀️ Дневной'}
            </button>
          ))}
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Время засыпания</label>
          <input type="time" value={sleepTime} onChange={e => setSleepTime(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-border bg-card text-foreground" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Время пробуждения</label>
          <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-border bg-card text-foreground" />
        </div>

        {/* Quality */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Качество сна</label>
          <div className="flex gap-2">
            {(['good', 'restless'] as const).map(q => (
              <button key={q} onClick={() => setQuality(q)} className={`flex-1 py-2 rounded-xl text-sm font-semibold ${quality === q ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>
                {q === 'good' ? '😊 Хороший' : '😟 Беспокойный'}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-base disabled:opacity-50">
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default SleepPage;
