import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';
import { getBabyId } from '@/lib/baby';

interface Entry { id: string; details: any; created_at: string; }

const SleepPage = () => {
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [quality, setQuality] = useState<'good' | 'restless'>('good');
  const [sleepType, setSleepType] = useState<'day' | 'night'>('night');
  const [saving, setSaving] = useState(false);
  const [babyId, setBabyId] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showForm, setShowForm] = useState(true);

  const loadEntries = useCallback(async (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('baby_events').select('id, details, created_at')
      .eq('baby_id', id).eq('event_type', 'sleep').eq('event_date', today)
      .order('created_at', { ascending: false });
    setEntries((data as Entry[]) || []);
  }, []);

  useEffect(() => {
    getBabyId().then(id => { if (id) { setBabyId(id); loadEntries(id); } });
  }, [loadEntries]);

  const handleSave = async () => {
    if (!babyId) { toast.error('Сначала добавьте малыша'); return; }
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
    loadEntries(babyId);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <PageHeader title="Сон" />
      <div className="px-5 pb-24 space-y-4">
        {entries.length > 0 && (
          <div>
            <h3 className="font-bold text-foreground text-sm mb-2">Сегодня:</h3>
            <div className="space-y-2">
              {entries.map(e => (
                <div key={e.id} className="bg-card border border-border rounded-xl p-3 text-sm">
                  <div className="flex justify-between font-semibold">
                    <span>{e.details?.sleepType === 'night' ? '🌙 Ночной' : '☀️ Дневной'}</span>
                    <span className="text-muted-foreground">{e.details?.sleepTime} → {e.details?.wakeTime}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Качество: {e.details?.quality === 'good' ? '😊 Хороший' : '😟 Беспокойный'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="w-full py-3 rounded-xl border-2 border-dashed border-primary text-primary font-bold">
            + Добавить ещё сон
          </button>
        ) : (
          <>
            <div className="flex gap-2">
              {(['night', 'day'] as const).map(t => (
                <button key={t} onClick={() => setSleepType(t)} className={`flex-1 py-2 rounded-xl text-sm font-semibold ${sleepType === t ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
                  {t === 'night' ? '🌙 Ночной' : '☀️ Дневной'}
                </button>
              ))}
            </div>
            <div>
              <label className="text-sm font-medium">Время засыпания</label>
              <input type="time" value={sleepTime} onChange={e => setSleepTime(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-border bg-card" />
            </div>
            <div>
              <label className="text-sm font-medium">Время пробуждения</label>
              <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-border bg-card" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Качество сна</label>
              <div className="flex gap-2">
                {(['good', 'restless'] as const).map(q => (
                  <button key={q} onClick={() => setQuality(q)} className={`flex-1 py-2 rounded-xl text-sm font-semibold ${quality === q ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
                    {q === 'good' ? '😊 Хороший' : '😟 Беспокойный'}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50">
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default SleepPage;
