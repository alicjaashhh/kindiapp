import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Camera } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getLocalBaby, saveLocalBaby } from '@/lib/baby';
import { useI18n } from '@/lib/i18n';

const AccountPage = () => {
  const navigate = useNavigate();
  const { t, lang, region, setRegion } = useI18n();
  const [email, setEmail] = useState('');
  const [baby, setBaby] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBaby(getLocalBaby());
    supabase.auth.getUser().then(({ data }) => { if (data.user) setEmail(data.user.email || ''); });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('kindi_baby');
    navigate('/auth');
  };

  const handleRegionChange = (r: string) => {
    setRegion(r);
    toast.success(r === 'cis' ? 'Регион обновлён' : 'Region updated');
  };

  const handleSaveBaby = async () => {
    if (!baby?.id) return;
    const { error } = await supabase.from('babies').update({
      name: baby.name, birth_date: baby.birthDate, gender: baby.gender,
      weight: baby.weight ? Number(baby.weight) : null, height: baby.height ? Number(baby.height) : null,
      photo_url: baby.photo || null,
    }).eq('id', baby.id);
    if (error) { toast.error('Ошибка сохранения'); return; }
    saveLocalBaby(baby);
    toast.success(lang === 'ru' ? 'Сохранено' : 'Saved');
    setEditing(false);
  };

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !baby?.id) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const path = `${user.id}/${Date.now()}.${f.name.split('.').pop()}`;
    const { error: upErr } = await supabase.storage.from('baby-photos').upload(path, f, { upsert: true });
    if (upErr) { toast.error('Ошибка загрузки'); return; }
    const { data } = supabase.storage.from('baby-photos').getPublicUrl(path);
    setBaby({ ...baby, photo: data.publicUrl });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <PageHeader title={t('account')} showBack={false} />
      <div className="px-5 pb-24 space-y-5">
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="font-bold text-foreground mb-3">👤 {t('parentProfile')}</h3>
          <p className="text-sm text-muted-foreground">Email: <span className="text-foreground">{email || '—'}</span></p>
          <div className="mt-3">
            <p className="text-sm font-medium mb-2">{t('region')}</p>
            <div className="flex gap-2">
              {[{ k: 'cis', l: 'СНГ' }, { k: 'europe', l: 'Europe' }, { k: 'usa', l: 'USA' }].map(r => (
                <button key={r.k} onClick={() => handleRegionChange(r.k)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${region === r.k ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{r.l}</button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">{t('language')}: {lang === 'ru' ? 'Русский' : 'English'}</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-foreground">👶 {t('babyProfile')}</h3>
            <button onClick={() => editing ? handleSaveBaby() : setEditing(true)} className="text-xs font-bold text-primary">
              {editing ? t('save') : t('edit')}
            </button>
          </div>
          {!baby ? (
            <p className="text-sm text-muted-foreground">—</p>
          ) : !editing ? (
            <div className="flex gap-3 items-center">
              {baby.photo ? (
                <img src={baby.photo} alt="" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl">👶</div>
              )}
              <div className="text-sm space-y-0.5 text-muted-foreground">
                <p>{t('name')}: <span className="text-foreground font-semibold">{baby.name}</span></p>
                <p>{t('birth')}: <span className="text-foreground">{baby.birthDate}</span></p>
                <p>{t('gender')}: <span className="text-foreground">{baby.gender === 'boy' ? t('boy') : baby.gender === 'girl' ? t('girl') : '—'}</span></p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <button onClick={() => fileRef.current?.click()} className="relative w-20 h-20 rounded-full bg-muted overflow-hidden">
                  {baby.photo ? <img src={baby.photo} className="w-full h-full object-cover" alt="" /> : <Camera className="w-6 h-6 m-auto" />}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} className="hidden" />
              </div>
              <div><Label>{t('name')}</Label><Input value={baby.name} onChange={e => setBaby({ ...baby, name: e.target.value })} /></div>
              <div><Label>{t('birth')}</Label><Input type="date" value={baby.birthDate?.split('T')[0]} onChange={e => setBaby({ ...baby, birthDate: e.target.value })} /></div>
              <div>
                <Label>{t('gender')}</Label>
                <div className="flex gap-2 mt-1">
                  {['boy', 'girl'].map(g => (
                    <button key={g} onClick={() => setBaby({ ...baby, gender: g })} className={`flex-1 py-2 rounded-xl text-sm ${baby.gender === g ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {g === 'boy' ? t('boy') : t('girl')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>{t('weight')}</Label><Input type="number" value={baby.weight || ''} onChange={e => setBaby({ ...baby, weight: e.target.value })} /></div>
                <div><Label>{t('height')}</Label><Input type="number" value={baby.height || ''} onChange={e => setBaby({ ...baby, height: e.target.value })} /></div>
              </div>
            </div>
          )}
        </div>

        <button onClick={() => navigate('/premium')} className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold">
          ⭐ {t('premium')}
        </button>
        <button onClick={handleLogout} className="w-full py-3 rounded-2xl border border-destructive text-destructive font-bold">
          {t('logout')}
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default AccountPage;
