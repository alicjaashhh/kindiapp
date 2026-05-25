import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from './SplashScreen';
import { supabase } from '@/integrations/supabase/client';
import { getBabyId } from '@/lib/baby';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  const handleSplashFinish = useCallback(async () => {
    setShowSplash(false);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }
    const id = await getBabyId();
    navigate(id ? '/home' : '/baby-info');
  }, [navigate]);

  if (showSplash) return <SplashScreen onFinish={handleSplashFinish} />;
  return null;
};

export default Index;
