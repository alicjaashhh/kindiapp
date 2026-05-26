import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart3, ShoppingBag, BookOpen, User } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  const tabs = [
    { icon: Home, label: t('home'), id: 'home', path: '/home' },
    { icon: BarChart3, label: t('development'), id: 'development', path: '/development' },
    { icon: ShoppingBag, label: t('shop'), id: 'shop', path: '/shop' },
    { icon: BookOpen, label: t('articles'), id: 'articles', path: '/articles' },
    { icon: User, label: t('account'), id: 'account', path: '/account' },
  ];

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith('/account')) return 'account';
    if (path.startsWith('/development') || path.startsWith('/food') || path.startsWith('/sleep') || path.startsWith('/skills') || path.startsWith('/growth') || path.startsWith('/teething') || path.startsWith('/vaccination')) return 'development';
    if (path.startsWith('/shop') || path.startsWith('/gifts')) return 'shop';
    if (path.startsWith('/articles')) return 'articles';
    if (path === '/home') return 'home';
    return '';
  };

  const activeTab = getActiveTab();

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2 pb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
              activeTab === tab.id ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
