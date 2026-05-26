import { useState, useEffect, useMemo, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, getDay, differenceInWeeks, differenceInMonths, addWeeks, isSameDay, differenceInDays } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import FloatingAnimals from '@/components/FloatingAnimals';
import kangarooLogo from '@/assets/kangaroo-logo.png';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getBabyId, getLocalBaby } from '@/lib/baby';
import { useI18n } from '@/lib/i18n';

const SPURT_WEEKS = [5, 8, 12, 19, 26, 37, 46, 55, 64, 75];
const MAIN_TYPES = ['behavior', 'teeth', 'growth'];
const ADDITIONAL_TYPES = ['food', 'sleep', 'skill', 'teething', 'vaccination'];

const HomePage = () => {
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const locale = lang === 'ru' ? ru : enUS;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [baby, setBaby] = useState<any>(null);
  const [babyId, setBabyId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayEvents, setDayEvents] = useState<any[]>([]);
  const [dayNote, setDayNote] = useState('');
  const [existingNoteId, setExistingNoteId] = useState<string | null>(null);

  // Modals
  const [behaviorOpen, setBehaviorOpen] = useState(false);
  const [teethOpen, setTeethOpen] = useState(false);
  const [growthOpen, setGrowthOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [behavior, setBehavior] = useState('');
  const [teethCount, setTeethCount] = useState('');
  const [w, setW] = useState(''); const [h, setH] = useState('');
  const [noteText, setNoteText] = useState('');

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
  const isBirthday = (day: Date) => birthDate && isSameDay(day, birthDate);
  const isCurrentlyInSpurt = SPURT_WEEKS.includes(babyWeeks);

  const monthStart = startOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: endOfMonth(currentMonth) });
  const startDay = getDay(monthStart);
  const paddingDays = startDay === 0 ? 6 : startDay - 1;

  const loadDay = useCallback(async (date: Date) => {
    if (!babyId) return;
    const dateStr = format(date, 'yyyy-MM-dd');
    const { data } = await supabase.from('baby_events').select('*').eq('baby_id', babyId).eq('event_date', dateStr).order('created_at');
    const events = data || [];
    setDayEvents(events);
    const note = events.find(e => e.event_type === 'note');
    setExistingNoteId(note?.id || null);
    setDayNote(note?.details?.text || '');
  }, [babyId]);

  const handleDayClick = (d: Date) => {
    setSelectedDate(d);
    loadDay(d);
  };

  const saveQuick = async (event_type: string, details: any, date?: Date) => {
    if (!babyId) { toast.error(lang === 'ru' ? 'Сначала добавьте малыша' : 'Add baby first'); return; }
    const dateStr = format(date || new Date(), 'yyyy-MM-dd');
    const { error } = await supabase.from('baby_events').insert({
      baby_id: babyId, event_type, event_date: dateStr, details,
    });
    if (error) { toast.error(lang === 'ru' ? 'Ошибка' : 'Error'); return; }
    toast.success(lang === 'ru' ? 'Сохранено!' : 'Saved!');
  };

  const saveDayNote = async () => {
    if (!babyId || !selectedDate) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    if (existingNoteId) {
      const { error } = await supabase.from('baby_events').update({ details: { text: dayNote } }).eq('id', existingNoteId);
      if (error) { toast.error('Error'); return; }
    } else {
      const { data, error } = await supabase.from('baby_events').insert({
        baby_id: babyId, event_type: 'note', event_date: dateStr, details: { text: dayNote },
      }).select().single();
      if (error) { toast.error('Error'); return; }
      setExistingNoteId(data.id);
    }
    toast.success(lang === 'ru' ? 'Заметка сохранена' : 'Note saved');
    loadDay(selectedDate);
  };

  const mainEvents = dayEvents.filter(e => MAIN_TYPES.includes(e.event_type));
  const additionalEvents = dayEvents.filter(e => ADDITIONAL_TYPES.includes(e.event_type));

  const renderDetails = (e: any) => {
    const d = e.details || {};
    switch (e.event_type) {
      case 'behavior': return d.mood;
      case 'teeth': return `${lang === 'ru' ? 'Зубов' : 'Teeth'}: ${d.count}`;
      case 'growth': return `${d.weight ? `${d.weight}г` : ''} ${d.height ? `${d.height}см` : ''}`.trim();
      case 'food': return `${d.type || ''} ${d.amount ? `· ${d.amount}` : ''}`;
      case 'sleep': return `${d.duration || ''} ${d.quality ? `· ${d.quality}` : ''}`;
      default: return JSON.stringify(d);
    }
  };

  const typeIcon: Record<string, string> = {
    behavior: '😊', teeth: '🦷', growth: '📏', food: '🍎', sleep: '😴',
    skill: '🧸', teething: '🦷', vaccination: '💉',
  };
  const typeLabel: Record<string, string> = {
    behavior: t('behavior'), teeth: t('teethShort'), growth: t('weightHeight'),
    food: t('food'), sleep: t('sleep'), skill: t('skills'), teething: t('teeth'), vaccination: t('vaccines'),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      <FloatingAnimals />

      <div className="px-5 pt-5 pb-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <img src={kangarooLogo} alt="Kindi" className="w-10 h-10 rounded-full object-cover" />
          <div>
            <span className="font-bold text-lg text-foreground">{baby?.name || (lang === 'ru' ? 'Малыш' : 'Baby')}</span>
            <p className="text-xs text-muted-foreground">{lang === 'ru' ? 'День' : 'Day'} {babyDays} • {babyWeeks} {lang === 'ru' ? 'нед' : 'wk'}</p>
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
            {format(currentMonth, 'LLLL yyyy', { locale })}
          </span>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {(lang === 'ru' ? ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'] : ['Mo','Tu','We','Th','Fr','Sa','Su']).map(d => (
            <div key={d} className="text-xs text-muted-foreground font-medium py-1">{d}</div>
          ))}
          {Array.from({ length: paddingDays }).map((_, i) => <div key={`p-${i}`} />)}
          {days.map(day => {
            const spurt = isSpurtDay(day);
            const today = isToday(day);
            const birthday = isBirthday(day);
            const isFuture = day > new Date();
            return (
              <button key={day.toISOString()} onClick={() => !isFuture && handleDayClick(day)} disabled={isFuture}
                className="flex flex-col items-center disabled:opacity-30 relative">
                <div className={`w-9 h-9 rounded-full text-sm font-medium flex items-center justify-center relative ${
                  birthday ? 'bg-pink-500 text-white ring-2 ring-pink-300' :
                  today && spurt ? 'bg-blue-500 text-white' :
                  today ? 'bg-primary text-primary-foreground' :
                  spurt ? 'bg-blue-100 text-blue-700' :
                  'text-foreground'
                }`}>
                  {birthday ? '🎂' : format(day, 'd')}
                </div>
                {spurt && !birthday && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-0.5" />}
              </button>
            );
          })}
        </div>
        {isCurrentlyInSpurt && (
          <div className="mt-3 text-center text-sm text-blue-600 font-semibold bg-blue-50 rounded-xl py-2">
            📈 {lang === 'ru' ? 'Сегодня пик роста — малышу нужна особая забота' : 'Growth spurt today — extra care needed'}
          </div>
        )}
      </div>

      <div className="mt-5 px-5 relative z-10">
        <h2 className="font-bold text-foreground mb-3">{t('today')}</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          <button onClick={() => setBehaviorOpen(true)} className="min-w-[140px] bg-card rounded-2xl p-4 shadow-sm text-left flex-shrink-0 border border-border">
            <span className="text-2xl">😊</span>
            <h3 className="font-semibold mt-2 text-sm">{t('behavior')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{lang === 'ru' ? 'Отметить настроение' : 'Mark mood'}</p>
          </button>
          <button onClick={() => setTeethOpen(true)} className="min-w-[140px] bg-card rounded-2xl p-4 shadow-sm text-left flex-shrink-0 border border-border">
            <span className="text-2xl">🦷</span>
            <h3 className="font-semibold mt-2 text-sm">{t('teethShort')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{lang === 'ru' ? 'Сколько прорезалось' : 'How many erupted'}</p>
          </button>
          <button onClick={() => setGrowthOpen(true)} className="min-w-[140px] bg-card rounded-2xl p-4 shadow-sm text-left flex-shrink-0 border border-border">
            <span className="text-2xl">📏</span>
            <h3 className="font-semibold mt-2 text-sm">{t('weightHeight')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{lang === 'ru' ? 'Записать измерение' : 'Log measurement'}</p>
          </button>
          <button onClick={() => { setNoteText(''); setNoteOpen(true); }} className="min-w-[140px] bg-card rounded-2xl p-4 shadow-sm text-left flex-shrink-0 border border-border">
            <span className="text-2xl">📝</span>
            <h3 className="font-semibold mt-2 text-sm">{t('notes')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{t('addNote')}</p>
          </button>
        </div>
      </div>

      <div className="mt-5 px-5 pb-24 relative z-10">
        <h2 className="font-bold text-foreground mb-3">{t('recommendations')}</h2>
        <div className="space-y-3">
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="font-semibold text-sm">{t('growth')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{isCurrentlyInSpurt ? `${lang === 'ru' ? 'Сейчас' : 'Now'} ${babyWeeks} ${lang === 'ru' ? 'нед — скачок' : 'wk — spurt'}!` : `${babyWeeks} ${lang === 'ru' ? 'нед — стабильно' : 'wk — stable'}`}</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border">
            <h3 className="font-semibold text-sm">{t('development')}</h3>
            <p className="text-xs text-muted-foreground mt-1">{lang === 'ru' ? `В ${babyMonths} мес. попробуйте новые упражнения` : `At ${babyMonths} mo try new activities`}</p>
          </div>
        </div>
      </div>

      {/* Day events dialog with 3 sections */}
      <Dialog open={!!selectedDate} onOpenChange={(v) => !v && setSelectedDate(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedDate && isBirthday(selectedDate) && <Gift className="w-5 h-5 text-pink-500" />}
              {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale })}
              {selectedDate && isBirthday(selectedDate) && <span className="text-xs text-pink-500">{t('birthday')}</span>}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* MAIN */}
            <section>
              <h4 className="text-sm font-bold text-foreground mb-2">1. {t('main')}</h4>
              {mainEvents.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t('noRecords')}</p>
              ) : (
                <div className="space-y-2">
                  {mainEvents.map(e => (
                    <div key={e.id} className="bg-muted rounded-xl p-2.5 text-sm flex gap-2">
                      <span>{typeIcon[e.event_type]}</span>
                      <div>
                        <p className="font-semibold text-xs">{typeLabel[e.event_type]}</p>
                        <p className="text-xs text-muted-foreground">{renderDetails(e)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ADDITIONAL */}
            <section>
              <h4 className="text-sm font-bold text-foreground mb-2">2. {t('additional')}</h4>
              {additionalEvents.length === 0 ? (
                <p className="text-xs text-muted-foreground">{t('noRecords')}</p>
              ) : (
                <div className="space-y-2">
                  {additionalEvents.map(e => (
                    <div key={e.id} className="bg-muted rounded-xl p-2.5 text-sm flex gap-2">
                      <span>{typeIcon[e.event_type]}</span>
                      <div>
                        <p className="font-semibold text-xs">{typeLabel[e.event_type]}</p>
                        <p className="text-xs text-muted-foreground">{renderDetails(e)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* NOTES — editable any day */}
            <section>
              <h4 className="text-sm font-bold text-foreground mb-2">3. {t('notes')}</h4>
              <Textarea value={dayNote} onChange={e => setDayNote(e.target.value)} placeholder={t('notePlaceholder')} className="min-h-[80px]" />
              <button onClick={saveDayNote} className="mt-2 w-full py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                {t('save')}
              </button>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Behavior dialog */}
      <Dialog open={behaviorOpen} onOpenChange={setBehaviorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{t('behavior')}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-3 gap-2">
            {(lang === 'ru'
              ? ['😊 Активный', '😢 Капризный', '😴 Спокойный', '🤒 Болеет', '😋 Голодный', '🥰 Игривый']
              : ['😊 Active', '😢 Fussy', '😴 Calm', '🤒 Sick', '😋 Hungry', '🥰 Playful']
            ).map(b => (
              <button key={b} onClick={() => setBehavior(b)} className={`p-3 rounded-xl text-xs ${behavior === b ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{b}</button>
            ))}
          </div>
          <button onClick={async () => { await saveQuick('behavior', { mood: behavior }); setBehaviorOpen(false); setBehavior(''); }}
            disabled={!behavior} className="mt-3 w-full py-2 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50">{t('save')}</button>
        </DialogContent>
      </Dialog>

      {/* Teeth dialog */}
      <Dialog open={teethOpen} onOpenChange={setTeethOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{t('teethShort')}</DialogTitle></DialogHeader>
          <Label>{lang === 'ru' ? 'Сколько прорезалось зубов' : 'How many teeth erupted'}</Label>
          <Input type="number" value={teethCount} onChange={e => setTeethCount(e.target.value)} placeholder="0" />
          <button onClick={async () => { await saveQuick('teeth', { count: Number(teethCount) }); setTeethOpen(false); setTeethCount(''); }}
            disabled={!teethCount} className="mt-3 w-full py-2 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50">{t('save')}</button>
        </DialogContent>
      </Dialog>

      {/* Growth dialog */}
      <Dialog open={growthOpen} onOpenChange={setGrowthOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{t('weightHeight')}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>{t('weight')}</Label><Input type="number" value={w} onChange={e => setW(e.target.value)} /></div>
            <div><Label>{t('height')}</Label><Input type="number" value={h} onChange={e => setH(e.target.value)} /></div>
          </div>
          <button onClick={async () => { await saveQuick('growth', { weight: Number(w), height: Number(h) }); setGrowthOpen(false); setW(''); setH(''); }}
            disabled={!w && !h} className="mt-3 w-full py-2 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50">{t('save')}</button>
        </DialogContent>
      </Dialog>

      {/* Note dialog (today quick add) */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{t('notes')}</DialogTitle></DialogHeader>
          <Textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder={t('notePlaceholder')} className="min-h-[120px]" />
          <button onClick={async () => { await saveQuick('note', { text: noteText }); setNoteOpen(false); setNoteText(''); }}
            disabled={!noteText.trim()} className="mt-3 w-full py-2 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50">{t('save')}</button>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default HomePage;
