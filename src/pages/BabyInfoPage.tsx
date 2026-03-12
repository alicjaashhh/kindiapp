import { useState } from 'react';
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

const BabyInfoPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date>();
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const handleSave = () => {
    if (!name || !birthDate) return;
    const baby = { name, birthDate: birthDate.toISOString(), gender, weight, height };
    localStorage.setItem('kindi_baby', JSON.stringify(baby));
    localStorage.setItem('kindi_last_login', Date.now().toString());
    navigate('/');
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
        <div>
          <Label className="text-sm font-semibold text-foreground">Имя ребёнка *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите имя"
            className="mt-1.5 h-12 rounded-xl border-border bg-card"
          />
        </div>

        <div>
          <Label className="text-sm font-semibold text-foreground">Дата рождения *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full mt-1.5 h-12 rounded-xl justify-start text-left font-normal border-border bg-card',
                  !birthDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {birthDate ? format(birthDate, 'dd MMMM yyyy', { locale: ru }) : 'Выберите дату'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={birthDate}
                onSelect={setBirthDate}
                disabled={(date) => date > new Date() || date < new Date('2020-01-01')}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="text-sm font-semibold text-foreground">Пол</Label>
          <div className="flex gap-3 mt-1.5">
            {genderOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setGender(opt.value)}
                className={cn(
                  'flex-1 h-11 rounded-xl border text-sm font-medium transition-colors',
                  gender === opt.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:border-primary/50'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-semibold text-foreground">Вес (граммы)</Label>
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="3500"
              className="mt-1.5 h-12 rounded-xl border-border bg-card"
            />
          </div>
          <div>
            <Label className="text-sm font-semibold text-foreground">Рост (см)</Label>
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="50"
              className="mt-1.5 h-12 rounded-xl border-border bg-card"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold text-foreground">Фото</Label>
          <button className="mt-1.5 w-full h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 transition-colors">
            <Camera className="w-5 h-5" />
            <span className="text-sm">Добавить фото</span>
          </button>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={!name || !birthDate}
        className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-base mt-6 hover:opacity-90 disabled:opacity-50"
      >
        Сохранить и продолжить
      </Button>
    </div>
  );
};

export default BabyInfoPage;
