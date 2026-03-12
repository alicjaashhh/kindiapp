import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';

const AccountPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('cis');
  const [baby, setBaby] = useState<any>(null);

  useEffect(() => {
    const s = localStorage.getItem('kindi_baby');
    if (s) setBaby(JSON.parse(s));
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email || '');
    });
    const r = localStorage.getItem('kindi_region');
    if (r) setRegion(r);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('kindi_baby');
    localStorage.removeItem('kindi_last_login');
    navigate('/auth');
  };

  const handleRegionChange = (r: string) => {
    setRegion(r);
    localStorage.setItem('kindi_region', r);
    toast.success('Регион обновлён');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <PageHeader title="Аккаунт" showBack={false} />
      <div className="px-5 pb-24 space-y-5">
        {/* Parent */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="font-bold text-foreground mb-3">👤 Профиль родителя</h3>
          <p className="text-sm text-muted-foreground">Email: <span className="text-foreground">{email || '—'}</span></p>
          <div className="mt-3">
            <p className="text-sm font-medium text-foreground mb-2">Регион</p>
            <div className="flex gap-2">
              {[{ k: 'cis', l: 'СНГ' }, { k: 'europe', l: 'Европа' }, { k: 'usa', l: 'США' }].map(r => (
                <button key={r.k} onClick={() => handleRegionChange(r.k)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${region === r.k ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>{r.l}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Baby */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="font-bold text-foreground mb-3">👶 Профиль ребёнка</h3>
          {baby ? (
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>Имя: <span className="text-foreground">{baby.name}</span></p>
              <p>Дата рождения: <span className="text-foreground">{baby.birthDate}</span></p>
              <p>Пол: <span className="text-foreground">{baby.gender === 'boy' ? 'Мальчик' : baby.gender === 'girl' ? 'Девочка' : 'Не указано'}</span></p>
            </div>
          ) : <p className="text-sm text-muted-foreground">Данные не заполнены</p>}
        </div>

        {/* Settings */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="font-bold text-foreground mb-3">⚙️ Настройки</h3>
          <p className="text-sm text-muted-foreground">Язык: Русский (скоро)</p>
          <p className="text-sm text-muted-foreground mt-1">Напоминания: включены (скоро)</p>
        </div>

        {/* Premium */}
        <button onClick={() => navigate('/premium')} className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-base">
          ⭐ Премиум
        </button>

        {/* Logout */}
        <button onClick={handleLogout} className="w-full py-3 rounded-2xl border border-destructive text-destructive font-bold text-base">
          Выйти из аккаунта
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default AccountPage;
