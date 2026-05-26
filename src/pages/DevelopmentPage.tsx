import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import FloatingAnimals from '@/components/FloatingAnimals';
import PageHeader from '@/components/PageHeader';
import { useI18n } from '@/lib/i18n';

const DevelopmentPage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const menuItems = [
    { emoji: '🍎', label: t('food'), path: '/food' },
    { emoji: '😴', label: t('sleep'), path: '/sleep' },
    { emoji: '🧸', label: t('skills'), path: '/skills' },
    { emoji: '📈', label: t('growth'), path: '/growth' },
    { emoji: '🦷', label: t('teeth'), path: '/teething' },
    { emoji: '💉', label: t('vaccines'), path: '/vaccination' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative">
      <FloatingAnimals />
      <PageHeader title={t('development')} showBack={false} />
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
