import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';

const feedTabs = ['Грудное молоко', 'Смесь', 'Прикорм'];

const FoodPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [time, setTime] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const stored = localStorage.getItem('kindi_baby');
    const baby = stored ? JSON.parse(stored) : null;
    const babyId = baby?.id;
    if (!babyId) { toast.error('Не найден ребёнок'); return; }

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
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <PageHeader title="Питание" />
      <div className="px-5 pb-24">
        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {feedTabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === i ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Время кормления</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full mt-1 p-3 rounded-xl border border-border bg-card text-foreground" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">{activeTab === 0 ? 'Длительность (мин)' : 'Объём (мл)'}</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={activeTab === 0 ? 'минуты' : 'мл'} className="w-full mt-1 p-3 rounded-xl border border-border bg-card text-foreground" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Заметки</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full mt-1 p-3 rounded-xl border border-border bg-card text-foreground resize-none" />
          </div>
          <button onClick={handleSave} disabled={saving} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-base disabled:opacity-50">
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-card border border-border rounded-2xl p-4">
          <h3 className="font-bold text-foreground mb-2">💡 Советы по возрасту</h3>
          <p className="text-sm text-muted-foreground">Рекомендации по питанию появятся здесь после подключения ИИ-модуля.</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default FoodPage;
