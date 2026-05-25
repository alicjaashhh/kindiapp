import { useEffect, useState } from 'react';
import kangarooLogo from '@/assets/kangaroo-splash.png';

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
  const [stopBounce, setStopBounce] = useState(false);

  useEffect(() => {
    const stopTimer = setTimeout(() => setStopBounce(true), 1800);
    const fadeTimer = setTimeout(() => setFadeOut(true), 2700);
    const finishTimer = setTimeout(() => onFinish(), 3200);
    return () => {
      clearTimeout(stopTimer);
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
          src={kangarooLogo}
          alt="Kindi"
          className={`w-36 h-36 object-contain relative z-10 ${stopBounce ? '' : 'animate-kangaroo-bounce'}`}
        />
        <span className="mt-4 text-3xl font-extrabold tracking-wide relative z-10" style={{ color: '#5D4037' }}>
          KINDI
        </span>
      </div>
    </div>
  );
};

export default SplashScreen;
