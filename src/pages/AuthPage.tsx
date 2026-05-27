import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { toast } from 'sonner';

const emailSchema = z.string().trim().email({ message: 'Введите корректный email' }).max(255);
const passSchema = z.string().min(6, { message: 'Пароль минимум 6 символов' }).max(72);

const TERMS = `Условия использования Kindi Baby

1. Регистрируясь в приложении, вы соглашаетесь с нашими условиями.
2. Все данные о ребёнке (включая фото) хранятся конфиденциально в защищённом облаке и используются ТОЛЬКО для персонализации рекомендаций внутри приложения.
3. Мы НЕ передаём, НЕ продаём и НЕ публикуем фотографии или личные данные детей третьим лицам — ни рекламодателям, ни партнёрам, ни государственным органам без законного требования.
4. Фотографии видны только владельцу аккаунта благодаря Row Level Security на уровне базы данных.
5. Мы не несём ответственности за медицинские решения — обращайтесь к врачу.
6. Возрастные нормы и рекомендации носят ознакомительный характер.
7. Аккаунт и все данные могут быть удалены в любой момент по вашему запросу.`;

const PRIVACY = `Политика конфиденциальности Kindi Baby

1. Мы собираем: email, имя ребёнка, дату рождения, фото, данные о развитии.
2. Данные и фотографии хранятся в защищённой облачной базе с шифрованием.
3. Мы НЕ передаём ваши данные и фото третьим лицам ни при каких условиях.
4. Фото ребёнка доступно только вам и не индексируется поисковыми системами.
5. Вы можете в любой момент запросить полное удаление данных и фото.
6. Для аналитики используются только обезличенные агрегированные данные.
7. Контакт: support@kindi.app`;

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const proceed = async () => {
    const e = emailSchema.safeParse(email);
    if (!e.success) { toast.error(e.error.errors[0].message); return; }
    const p = passSchema.safeParse(password);
    if (!p.success) { toast.error(p.error.errors[0].message); return; }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success('Аккаунт создан!');
        navigate('/baby-info');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Вход выполнен');
        const { data: prof } = await supabase.from('profiles').select('id').maybeSingle();
        if (prof) {
          const { data: baby } = await supabase.from('babies').select('*').eq('parent_id', prof.id).maybeSingle();
          if (baby) {
            localStorage.setItem('kindi_baby', JSON.stringify({
              id: baby.id, name: baby.name, birthDate: baby.birth_date, gender: baby.gender, photo: baby.photo_url
            }));
            navigate('/home');
            return;
          }
        }
        navigate('/baby-info');
      }
    } catch (err: any) {
      toast.error(err.message || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: `${window.location.origin}/` });
    if (result.error) toast.error('Ошибка входа через Google');
  };

  return (
    <div className="min-h-screen bg-card flex flex-col max-w-md mx-auto px-8 py-8">
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-2xl font-bold text-center text-foreground mb-2">
          {mode === 'signup' ? 'Создайте аккаунт' : 'Войдите в Kindi'}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          {mode === 'signup' ? 'Введите ваш email чтобы зарегистрироваться' : 'Введите email и пароль'}
        </p>

        <Input
          type="email"
          placeholder="email@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 h-12 rounded-xl"
        />
        <Input
          type="password"
          placeholder="Пароль (мин. 6 символов)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 h-12 rounded-xl"
        />

        <Button onClick={proceed} disabled={loading} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold">
          {loading ? 'Загрузка...' : (mode === 'signup' ? 'Зарегистрироваться' : 'Войти')}
        </Button>

        <button
          onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
          className="text-sm text-center mt-3 text-muted-foreground underline"
        >
          {mode === 'signup' ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Создать'}
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">или</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <Button variant="outline" onClick={googleSignIn} className="w-full h-12 rounded-xl bg-card border-border text-foreground font-medium">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Войти через Google
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-8">
          Регистрируясь, вы соглашаетесь с{' '}
          <Dialog>
            <DialogTrigger className="underline text-foreground">Условиями использования</DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Условия использования</DialogTitle></DialogHeader>
              <ScrollArea className="max-h-[60vh]"><p className="text-sm whitespace-pre-line">{TERMS}</p></ScrollArea>
            </DialogContent>
          </Dialog>
          {' '}и{' '}
          <Dialog>
            <DialogTrigger className="underline text-foreground">Политикой конфиденциальности</DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Политика конфиденциальности</DialogTitle></DialogHeader>
              <ScrollArea className="max-h-[60vh]"><p className="text-sm whitespace-pre-line">{PRIVACY}</p></ScrollArea>
            </DialogContent>
          </Dialog>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
