import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from './SplashScreen';

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
    const lastLogin = localStorage.getItem('kindi_last_login');
    const baby = localStorage.getItem('kindi_baby');

    if (lastLogin && Date.now() - parseInt(lastLogin) < SIX_MONTHS_MS && baby) {
      navigate('/home');
    } else {
      localStorage.removeItem('kindi_last_login');
      navigate('/auth');
    }
  }, [navigate]);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return null;
};

export default Index;
