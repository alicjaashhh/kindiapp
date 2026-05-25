import { useState, useEffect, useMemo, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, getDay, differenceInWeeks, differenceInMonths, addWeeks, isSameDay, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import FloatingAnimals from '@/components/FloatingAnimals';
import kangarooLogo from '@/assets/kangaroo-logo.png';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getBabyId, getLocalBaby } from '@/lib/baby';

const SPURT_WEEKS = [5, 8, 12, 19, 26, 37, 46, 55, 64, 75];

const HomePage = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [baby, setBaby] = useState<any>(null);
  const [babyId, setBabyId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayEvents, setDayEvents] = useState<any[]>([]);

  // Modals
  const [behaviorOpen, setBehaviorOpen] = useState(false);
  const [teethOpen, setTeethOpen] = useState(false);
  const [growthOpen, setGrowthOpen] = useState(false);
  const [behavior, setBehavior] = useState('');
  const [teethCount, setTeethCount] = useState('');
  const [w, setW] = useState(''); const [h, setH] = useState('');

  useEffect(() => {
    setBaby(getLocalBaby());
    getBabyId().then(id => setBabyId(id));
  }, []);

  const birthDate = baby?.birthDate ? new Date(baby.birthDate) : null;
  const babyWeeks = birthDate ? differenceInWeeks(new Date(), birthDate) : 0;
  const babyMonths = birthDate ? differenceInMonths(new Date(), birthDate) : 0;
  const babyDays = birthDate ? differenceInDays(new Date(), birthDate) : 0;

  const spurtDates = useMemo(() => birthDate ? SPURT_WEEKS.map(w => addWeeks(birthDate, w)) : [], [birthDate]);
  const isSpurtDay = (day: Date) => spurtDates.some(s => isSameDay(s, day));
  const isCurrentlyInSpurt = SPURT_WEEKS.includes(babyWeeks);

  const monthStart = startOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: endOfMonth(currentMonth) });
  const startDay = getDay(monthStart);
  const paddingDays = startDay === 0 ? 6 : startDay - 1;

  const loadDay = useCallback(async (date: Date) => {
    if (!babyId) return;
    const dateStr = date.toISOString().split('T')[0];
    const { data } = await supabase.from('baby_events').select('*').eq('baby_id', babyId).eq('event_date', dateStr).order('created_at');
    setDayEvents(data || []);
  }, [babyId]);

  const handleDayClick = (d: Date) => {
    setSelectedDate(d);
    loadDay(d);
  };

  const saveQuick = async (event_type: string, details: any) => {
    if (!babyId) { toast.error('Сначала добавьте малыша'); return; }
    const { error } = await supabase.from('baby_events').insert({
      baby_id: babyId, event_type, event_date: new Date().toISOString().split('T')[0], details,
    });
    if (error) { toast.error('Ошибка'); return; }
    toast.success('Сохранено!');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      <FloatingAnimals />

      <div className="px-5 pt-5 pb-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <img src={kangarooLogo} alt="Kindi" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <span className="font-bold text-lg text-foreground">{baby?.name || 'Малыш'}</span>
            <p className="text-xs text-muted-foreground">День {babyDays} • {babyWeeks} нед</p>
          </div>
        </div>
        <button onClick={() => navigate('/account')} className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary bg-muted flex items-center justify-center">
          {baby?.photo ? (
            <img src={baby.photo} alt="baby" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl">👶</span>
          )}
        </button>
      </div>

      <div className="mx-5 rounded-2xl bg-card p-4 shadow-sm relative z-10">
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
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
            <div key={d} className="text-xs text-muted-foreground font-medium py-1">{d}</div>
          ))}
          {Array.from({ length: paddingDays }).map((_, i) => <div key={`p-${i}`} />)}
          {days.map(day => {
            const spurt = isSpurtDay(day);
            const today = isToday(day);
            const isFuture = day > new Date();
            return (
              <button key={day.toISOString()} onClick={() => !isFuture && handleDayClick(day)} disabled={isFuture}
                className="flex flex-col items-center disabled:opacity-30">
                <div className={`w-9 h-9 rounded-full text-sm font-medium flex items-center justify-center ${
                  today && spurt ? 'bg-blue-500 text-white' :
                  today ? 'bg-primary text-primary-foreground' :
                  spurt ? 'bg-blue-100 text-blue-700' :
                  'text-foreground'
                }`}>
                  {format(day, 'd')}
                </div>
                {spurt && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-0.5" />}
              </button>
            );
          })}
        </div>
        {isCurrentlyInSpurt && (
          <div className="mt-3 text-center text-sm text-blue-600 font-semibold bg-blue-50 rounded-xl py-2">
            📈 Сегодня пик роста — малышу нужна особая забота
          </div>
        )}
      </div>

      <div className="mt-5 px-5 relative z-10">
        <h2 className="font-bold text-foreground mb-3">Сегодня</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          <button onClick={() => setBehaviorOpen(true)} className="min-w-[140px] bg-card rounded-2xl p-4 shadow-sm text-left flex-shrink-0 border border-border">
            <span className="text-2xl">😊</span>
            <h3 className="font-semibold mt-2 text-sm">Поведение</h3>
            <p className="text-xs text-muted-foreground mt-1">Отметить настроение</p>
          </button>
          <button onClick={() => setTeethOpen(true)} className="min-w-[140px] bg-card rounded-2xl p-4 shadow-sm text-left flex-shrink-0 border border-border">
            <span className="text-2xl">🦷</span>
            <h3 className="font-semibold mt-2 text-sm">Зубы</h3>
            <p className="text-xs text-muted-foreground mt-1">Сколько прорезалось</p>
          </button>
          <button onClick={() => setGrowthOpen(true)} className="min-w-[140px] bg-card rounded-2xl p-4 shadow-sm text-left flex-shrink-0 border border-border">
            <span className="text-2xl">📏</span>
            <h3 className="font-semibold mt-2 text-sm">Рост/вес</h3>
            <p className="text-xs text-muted-foreground mt-1">Записать измерение</p>
          </button>
        </div>
      </div>

      <div className="mt-5 px-5 pb-24 relative z-10">
        <h2 className="font-bold text-foreground mb-3">Рекомендации</h2>
        <div className="space-y-3">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="font-semibold text-sm">Скачок роста</h3>
            <p className="text-xs text-muted-foreground mt-1">{isCurrentlyInSpurt ? `Сейчас ${babyWeeks}-я неделя — скачок роста!` : `${babyWeeks}-я неделя — всё стабильно`}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="font-semibold text-sm">Развитие</h3>
            <p className="text-xs text-muted-foreground mt-1">В {babyMonths} мес. попробуйте новые упражнения</p>
          </div>
        </div>
      </div>

      {/* Day events dialog */}
      <Dialog open={!!selectedDate} onOpenChange={(v) => !v && setSelectedDate(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: ru })}</DialogTitle></DialogHeader>
          {dayEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Записей нет</p>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {dayEvents.map(e => (
                <div key={e.id} className="bg-muted rounded-xl p-3 text-sm">
                  <p className="font-semibold capitalize">{e.event_type}</p>
                  <pre className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">{JSON.stringify(e.details, null, 2)}</pre>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Behavior dialog */}
      <Dialog open={behaviorOpen} onOpenChange={setBehaviorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Поведение сегодня</DialogTitle></DialogHeader>
          <div className="grid grid-cols-3 gap-2">
            {['😊 Активный', '😢 Капризный', '😴 Спокойный', '🤒 Болеет', '😋 Голодный', '🥰 Игривый'].map(b => (
              <button key={b} onClick={() => setBehavior(b)} className={`p-3 rounded-xl text-xs ${behavior === b ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{b}</button>
            ))}
          </div>
          <button onClick={async () => { await saveQuick('behavior', { mood: behavior }); setBehaviorOpen(false); setBehavior(''); }}
            disabled={!behavior} className="mt-3 w-full py-2 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50">Сохранить</button>
        </DialogContent>
      </Dialog>

      {/* Teeth dialog */}
      <Dialog open={teethOpen} onOpenChange={setTeethOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Зубы</DialogTitle></DialogHeader>
          <Label>Сколько прорезалось зубов</Label>
          <Input type="number" value={teethCount} onChange={e => setTeethCount(e.target.value)} placeholder="0" />
          <button onClick={async () => { await saveQuick('teeth', { count: Number(teethCount) }); setTeethOpen(false); setTeethCount(''); }}
            disabled={!teethCount} className="mt-3 w-full py-2 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50">Сохранить</button>
          <button onClick={() => { setTeethOpen(false); navigate('/teething'); }} className="mt-2 w-full py-2 rounded-xl border border-border text-foreground text-sm">Открыть схему зубов</button>
        </DialogContent>
      </Dialog>

      {/* Growth dialog */}
      <Dialog open={growthOpen} onOpenChange={setGrowthOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Рост и вес</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Вес (г)</Label><Input type="number" value={w} onChange={e => setW(e.target.value)} /></div>
            <div><Label>Рост (см)</Label><Input type="number" value={h} onChange={e => setH(e.target.value)} /></div>
          </div>
          <button onClick={async () => { await saveQuick('growth', { weight: Number(w), height: Number(h) }); setGrowthOpen(false); setW(''); setH(''); }}
            disabled={!w && !h} className="mt-3 w-full py-2 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50">Сохранить</button>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default HomePage;
