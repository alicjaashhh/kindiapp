import { useNavigate, useLocation } from 'react-router-dom';
import { User, BarChart3, ShoppingBag, BookOpen } from 'lucide-react';

const tabs = [
  { icon: User, label: 'Аккаунт', id: 'account', path: '/account' },
  { icon: BarChart3, label: 'Развитие', id: 'development', path: '/development' },
  { icon: ShoppingBag, label: 'Магазин', id: 'shop', path: '/shop' },
  { icon: BookOpen, label: 'Статьи', id: 'articles', path: '/articles' },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
