import { useEffect, useState } from 'react';
import kindiLogo from '@/assets/kindi-logo.png';

interface SplashScreenProps {
  onFinish: () => void;
}

const circles = [
  { size: 80, color: '#FFB800', className: 'animate-circle-1' },
  { size: 60, color: '#FFA500', className: 'animate-circle-2' },
  { size: 50, color: '#FFD54F', className: 'animate-circle-3' },
  { size: 70, color: '#FFB800', className: 'animate-circle-4' },
  { size: 40, color: '#FFF3CC', className: 'animate-circle-5' },
  { size: 55, color: '#FFA500', className: 'animate-circle-6' },
];

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2500);
    const finishTimer = setTimeout(() => onFinish(), 3000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-card ${fadeOut ? 'animate-splash-fade-out' : ''}`}>
      <div className="relative flex flex-col items-center">
        {circles.map((c, i) => (
          <div
            key={i}
            className={`absolute rounded-full opacity-0 ${c.className}`}
            style={{
              width: c.size,
              height: c.size,
              backgroundColor: c.color,
              top: '50%',
              left: '50%',
              marginTop: -c.size / 2,
              marginLeft: -c.size / 2,
            }}
          />
        ))}
        <img
          src={kindiLogo}
          alt="Kindi"
          className="w-32 h-32 animate-kangaroo-bounce relative z-10"
        />
        <span className="mt-4 text-3xl font-extrabold tracking-wide relative z-10" style={{ color: '#5D4037' }}>
          KINDI
        </span>
      </div>
    </div>
  );
};

export default SplashScreen;
