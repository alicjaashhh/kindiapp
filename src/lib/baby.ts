import { supabase } from '@/integrations/supabase/client';

export interface LocalBaby {
  id: string;
  name: string;
  birthDate: string;
  gender?: string;
  photo?: string;
  weight?: number;
  height?: number;
}

export const getLocalBaby = (): LocalBaby | null => {
  const s = localStorage.getItem('kindi_baby');
  if (!s) return null;
  try { return JSON.parse(s); } catch { return null; }
};

export const saveLocalBaby = (b: LocalBaby) => {
  localStorage.setItem('kindi_baby', JSON.stringify(b));
};

export const getBabyId = async (): Promise<string | null> => {
  const local = getLocalBaby();
  if (local?.id) return local.id;
  // Fallback: fetch from DB
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: prof } = await supabase.from('profiles').select('id').eq('user_id', user.id).maybeSingle();
  if (!prof) return null;
  const { data: baby } = await supabase.from('babies').select('*').eq('parent_id', prof.id).maybeSingle();
  if (!baby) return null;
  saveLocalBaby({
    id: baby.id, name: baby.name, birthDate: baby.birth_date,
    gender: baby.gender || undefined, photo: baby.photo_url || undefined,
    weight: baby.weight || undefined, height: baby.height || undefined,
  });
  return baby.id;
};
