import { useState } from 'react';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';

const gifts: Record<string, { name: string; emoji: string; gender: string[] }[]> = {
  '0-6': [
    { name: 'Мобиль на кроватку', emoji: '🎠', gender: ['all'] },
    { name: 'Набор пелёнок', emoji: '🧵', gender: ['all'] },
    { name: 'Погремушка-грызунок', emoji: '🍩', gender: ['all'] },
  ],
  '6-12': [
    { name: 'Интерактивная книжка', emoji: '📖', gender: ['all'] },
    { name: 'Каталка-ходунки', emoji: '🚗', gender: ['boy', 'all'] },
    { name: 'Кукла-неваляшка', emoji: '🪆', gender: ['girl', 'all'] },
  ],
  '12-24': [
    { name: 'Сортер', emoji: '🔶', gender: ['all'] },
    { name: 'Машинка', emoji: '🏎️', gender: ['boy', 'all'] },
    { name: 'Кукольный домик', emoji: '🏠', gender: ['girl', 'all'] },
  ],
  '24-36': [
    { name: 'Конструктор', emoji: '🧱', gender: ['all'] },
    { name: 'Набор для рисования', emoji: '🎨', gender: ['all'] },
    { name: 'Велосипед', emoji: '🚲', gender: ['all'] },
  ],
};

const ageLabels: Record<string, string> = { '0-6': '0-6 мес', '6-12': '6-12 мес', '12-24': '1-2 года', '24-36': '2-3 года' };

const GiftIdeasPage = () => {
  const [ageFilter, setAgeFilter] = useState('0-6');
  const [genderFilter, setGenderFilter] = useState('all');

  const filtered = (gifts[ageFilter] || []).filter(g => g.gender.includes(genderFilter) || g.gender.includes('all'));

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative overflow-hidden">
      <PageHeader title="Идеи для подарков" />
      {/* Falling gifts animation */}
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="absolute text-2xl pointer-events-none" style={{ left: `${15 + i * 15}%` }}
          initial={{ y: -40, opacity: 0 }} animate={{ y: ['0%', '100vh'], opacity: [1, 0] }}
          transition={{ duration: 4, delay: i * 0.5, repeat: Infinity }}>🎁</motion.div>
      ))}
      <div className="px-5 pb-24 relative z-10">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {Object.keys(gifts).map(k => (
            <button key={k} onClick={() => setAgeFilter(k)} className={`whitespace-nowrap px-3 py-2 rounded-xl text-sm font-semibold ${ageFilter === k ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>{ageLabels[k]}</button>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          {[{ k: 'all', l: '🌟 Все' }, { k: 'boy', l: '👦 Мальчик' }, { k: 'girl', l: '👧 Девочка' }].map(g => (
            <button key={g.k} onClick={() => setGenderFilter(g.k)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${genderFilter === g.k ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>{g.l}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(g => (
            <div key={g.name} className="bg-card border border-border rounded-2xl p-4 text-center">
              <span className="text-4xl">{g.emoji}</span>
              <h3 className="font-semibold text-foreground text-sm mt-2">{g.name}</h3>
              <button onClick={() => window.open('https://google.com', '_blank')} className="mt-2 w-full py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold">Купить →</button>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default GiftIdeasPage;
