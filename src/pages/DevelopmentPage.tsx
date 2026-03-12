import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import FloatingAnimals from '@/components/FloatingAnimals';
import PageHeader from '@/components/PageHeader';

const menuItems = [
  { emoji: '🍎', label: 'Еда', path: '/food' },
  { emoji: '😴', label: 'Сон', path: '/sleep' },
  { emoji: '🧸', label: 'Скилы месяца', path: '/skills' },
  { emoji: '📈', label: 'Скачки роста', path: '/growth' },
  { emoji: '🦷', label: 'Прорезывание зубов', path: '/teething' },
  { emoji: '💉', label: 'Вакцинации', path: '/vaccination' },
];

const DevelopmentPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      <FloatingAnimals />
      <PageHeader title="Развитие" showBack={false} />
      <div className="px-5 pb-24 space-y-3 relative z-10">
        {menuItems.map((item, i) => (
          <motion.button
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center gap-4 bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <span className="text-3xl">{item.emoji}</span>
            <span className="font-semibold text-foreground text-base">{item.label}</span>
          </motion.button>
        ))}
      </div>
      <BottomNav />
    </div>
  );
};

export default DevelopmentPage;
