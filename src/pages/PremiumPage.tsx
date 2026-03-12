import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';

const benefits = [
  { emoji: '🤖', title: 'ИИ-рекомендации', desc: 'Персональные советы на каждый день' },
  { emoji: '📚', title: 'Все статьи', desc: 'Доступ ко всем материалам без ограничений' },
  { emoji: '👩‍⚕️', title: 'Консультации', desc: 'Чат с педиатром (скоро)' },
  { emoji: '📊', title: 'Аналитика', desc: 'Расширенные графики развития' },
];

const PremiumPage = () => (
  <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
    <PageHeader title="Премиум" />
    <div className="px-5 pb-24">
      <div className="text-center mb-6">
        <span className="text-5xl">⭐</span>
        <h2 className="font-bold text-xl text-foreground mt-3">Kindi Premium</h2>
        <p className="text-sm text-muted-foreground mt-1">Всё лучшее для вашего малыша</p>
      </div>
      <div className="space-y-3 mb-6">
        {benefits.map(b => (
          <div key={b.title} className="flex gap-3 items-start bg-card border border-border rounded-2xl p-4">
            <span className="text-2xl">{b.emoji}</span>
            <div>
              <h3 className="font-semibold text-foreground text-sm">{b.title}</h3>
              <p className="text-xs text-muted-foreground">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => toast.info('Тестовая оплата — Stripe будет подключён позже')} className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-base">
        Оформить подписку — 299 ₽/мес
      </button>
    </div>
    <BottomNav />
  </div>
);

export default PremiumPage;
