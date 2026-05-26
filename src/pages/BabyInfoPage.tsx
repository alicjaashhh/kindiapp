import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Camera } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const BabyInfoPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date>();
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoChoose = () => fileRef.current?.click();
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error('Файл больше 5 МБ'); return; }
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!name || !birthDate) { toast.error('Заполните имя и дату'); return; }
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error('Войдите в аккаунт'); navigate('/auth'); return; }

      let { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user.id).maybeSingle();
      if (!profile) {
        const { data: newP, error } = await supabase.from('profiles').insert({ user_id: user.id, email: user.email }).select('id').single();
        if (error) throw error;
        profile = newP;
      }

      let photo_url: string | null = null;
      if (photoFile) {
        try {
          const ext = photoFile.name.split('.').pop();
          const path = `${user.id}/${Date.now()}.${ext}`;
          const { error: upErr } = await supabase.storage.from('baby-photos').upload(path, photoFile, { upsert: true });
          if (upErr) throw upErr;
          const { data } = supabase.storage.from('baby-photos').getPublicUrl(path);
          photo_url = data.publicUrl;
        } catch (uploadErr: any) {
          console.error('Photo upload failed:', uploadErr);
          toast.error('Не удалось загрузить фото, продолжаем без него');
          photo_url = photoPreview || null;
        }
      }


      const { data: baby, error: babyErr } = await supabase.from('babies').insert({
        parent_id: profile!.id,
        name,
        birth_date: birthDate.toISOString().split('T')[0],
        gender: gender || null,
        weight: weight ? Number(weight) : null,
        height: height ? Number(height) : null,
        photo_url,
      }).select().single();
      if (babyErr) throw babyErr;

      localStorage.setItem('kindi_baby', JSON.stringify({
        id: baby.id, name: baby.name, birthDate: baby.birth_date, gender: baby.gender, photo: baby.photo_url,
        weight: baby.weight, height: baby.height,
      }));
      navigate('/home');
    } catch (e: any) {
      toast.error(e.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const genderOptions = [
    { value: 'boy', label: 'Мальчик' },
    { value: 'girl', label: 'Девочка' },
    { value: 'unspecified', label: 'Не указано' },
  ];

  return (
    <div className="min-h-screen bg-card flex flex-col max-w-md mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">Расскажите о малыше</h1>
      <p className="text-sm text-muted-foreground mb-8">Заполните информацию о вашем ребёнке</p>

      <div className="space-y-5 flex-1">
        <div className="flex justify-center">
          <button onClick={handlePhotoChoose} className="relative w-28 h-28 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <Camera className="w-6 h-6" />
                <span className="text-xs mt-1">Фото</span>
              </div>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        </div>

        <div>
          <Label>Имя ребёнка *</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Введите имя" className="mt-1.5 h-12 rounded-xl" />
        </div>

        <div>
          <Label>Дата рождения *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn('w-full mt-1.5 h-12 rounded-xl justify-start font-normal', !birthDate && 'text-muted-foreground')}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {birthDate ? format(birthDate, 'dd MMMM yyyy', { locale: ru }) : 'Выберите дату'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} disabled={(d) => d > new Date() || d < new Date('2020-01-01')} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Пол</Label>
          <div className="flex gap-3 mt-1.5">
            {genderOptions.map((opt) => (
              <button key={opt.value} onClick={() => setGender(opt.value)}
                className={cn('flex-1 h-11 rounded-xl border text-sm font-medium',
                  gender === opt.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border'
                )}>{opt.label}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Вес (г)</Label>
            <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="3500" className="mt-1.5 h-12 rounded-xl" />
          </div>
          <div>
            <Label>Рост (см)</Label>
            <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="50" className="mt-1.5 h-12 rounded-xl" />
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={!name || !birthDate || saving} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold mt-6">
        {saving ? 'Сохранение...' : 'Сохранить и продолжить'}
      </Button>
    </div>
  );
};

export default BabyInfoPage;
