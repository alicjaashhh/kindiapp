-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  region TEXT DEFAULT 'cis',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create babies table
CREATE TABLE public.babies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT,
  weight DECIMAL,
  height DECIMAL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.babies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own babies" ON public.babies FOR SELECT
  USING (parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own babies" ON public.babies FOR INSERT
  WITH CHECK (parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own babies" ON public.babies FOR UPDATE
  USING (parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own babies" ON public.babies FOR DELETE
  USING (parent_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- Create baby_events table
CREATE TABLE public.baby_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  baby_id UUID REFERENCES public.babies(id) ON DELETE CASCADE NOT NULL,
  event_date DATE NOT NULL DEFAULT CURRENT_DATE,
  event_type TEXT NOT NULL CHECK (event_type IN ('feeding', 'sleep', 'growth', 'teething', 'vaccination', 'skill')),
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.baby_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own baby events" ON public.baby_events FOR SELECT
  USING (baby_id IN (SELECT b.id FROM public.babies b JOIN public.profiles p ON b.parent_id = p.id WHERE p.user_id = auth.uid()));
CREATE POLICY "Users can insert own baby events" ON public.baby_events FOR INSERT
  WITH CHECK (baby_id IN (SELECT b.id FROM public.babies b JOIN public.profiles p ON b.parent_id = p.id WHERE p.user_id = auth.uid()));
CREATE POLICY "Users can update own baby events" ON public.baby_events FOR UPDATE
  USING (baby_id IN (SELECT b.id FROM public.babies b JOIN public.profiles p ON b.parent_id = p.id WHERE p.user_id = auth.uid()));
CREATE POLICY "Users can delete own baby events" ON public.baby_events FOR DELETE
  USING (baby_id IN (SELECT b.id FROM public.babies b JOIN public.profiles p ON b.parent_id = p.id WHERE p.user_id = auth.uid()));

-- Create recommendations table
CREATE TABLE public.recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  baby_id UUID REFERENCES public.babies(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  recommendation_text TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('ai', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recommendations" ON public.recommendations FOR SELECT
  USING (baby_id IN (SELECT b.id FROM public.babies b JOIN public.profiles p ON b.parent_id = p.id WHERE p.user_id = auth.uid()));
CREATE POLICY "Users can insert own recommendations" ON public.recommendations FOR INSERT
  WITH CHECK (baby_id IN (SELECT b.id FROM public.babies b JOIN public.profiles p ON b.parent_id = p.id WHERE p.user_id = auth.uid()));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email) VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();