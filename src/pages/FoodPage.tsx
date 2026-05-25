import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';
import { getBabyId } from '@/lib/baby';

const feedTabs = ['Грудное молоко', 'Смесь', 'Прикорм'];

interface Entry { id: string; details: any; created_at: string; }

const FoodPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [time, setTime] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [babyId, setBabyId] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showForm, setShowForm] = useState(true);

  const loadEntries = useCallback(async (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('baby_events')
      .select('id, details, created_at')
      .eq('baby_id', id).eq('event_type', 'feeding').eq('event_date', today)
      .order('created_at', { ascending: false });
    setEntries((data as Entry[]) || []);
  }, []);

  useEffect(() => {
    getBabyId().then(id => {
      if (id) { setBabyId(id); loadEntries(id); }
    });
  }, [loadEntries]);

  const handleSave = async () => {
    if (!babyId) { toast.error('Сначала добавьте малыша'); return; }
    setSaving(true);
    const { error } = await supabase.from('baby_events').insert({
      baby_id: babyId,
      event_type: 'feeding',
      event_date: new Date().toISOString().split('T')[0],
      details: { type: feedTabs[activeTab], time, amount: Number(amount), notes },
    });
    setSaving(false);
    if (error) { toast.error('Ошибка сохранения'); return; }
    toast.success('Сохранено!');
    setTime(''); setAmount(''); setNotes('');
    loadEntries(babyId);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <PageHeader title="Питание" />
      <div className="px-5 pb-24">
        {entries.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold text-foreground text-sm mb-2">Сегодня записано:</h3>
            <div className="space-y-2">
              {entries.map(e => (
                <div key={e.id} className="bg-card border border-border rounded-xl p-3 text-sm">
                  <div className="flex justify-between font-semibold">
                    <span>🍼 {e.details?.type}</span>
                    <span className="text-muted-foreground">{e.details?.time || '—'}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {e.details?.amount ? `${e.details.amount} ${e.details?.type === 'Грудное молоко' ? 'мин' : 'мл'}` : ''}
                    {e.details?.notes ? ` • ${e.details.notes}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="w-full py-3 rounded-xl border-2 border-dashed border-primary text-primary font-bold">
            + Добавить ещё кормление
          </button>
        ) : (
          <>
            <div className="flex gap-2 mb-5">
              {feedTabs.map((t, i) => (
                <button key={t} onClick={() => setActiveTab(i)} className={`px-3 py-2 rounded-xl text-sm font-semibold ${activeTab === i ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>{t}</button>
              ))}
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Время кормления</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-border bg-card" />
              </div>
              <div>
                <label className="text-sm font-medium">{activeTab === 0 ? 'Длительность (мин)' : 'Объём (мл)'}</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={activeTab === 0 ? 'минуты' : 'мл'} className="w-full mt-1 p-3 rounded-xl border border-border bg-card" />
              </div>
              <div>
                <label className="text-sm font-medium">Заметки</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full mt-1 p-3 rounded-xl border border-border bg-card resize-none" />
              </div>
              <button onClick={handleSave} disabled={saving} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50">
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default FoodPage;
