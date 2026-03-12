import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';

const products = [
  { name: 'Подгузники', age: '0-3', price: '990 ₽', emoji: '🧷' },
  { name: 'Погремушка', age: '3-6', price: '450 ₽', emoji: '🎀' },
  { name: 'Прорезыватель', age: '6-12', price: '350 ₽', emoji: '🦷' },
  { name: 'Стульчик для кормления', age: '6-12', price: '4 990 ₽', emoji: '🪑' },
  { name: 'Книжка с картинками', age: '1-2', price: '520 ₽', emoji: '📚' },
  { name: 'Развивающая игрушка', age: '2-3', price: '1 290 ₽', emoji: '🧩' },
];

const ageFilters = ['Все', '0-3', '3-6', '6-12', '1-2', '2-3'];

const ShopPage = () => {
  const [filter, setFilter] = useState('Все');
  const [babyName, setBabyName] = useState('малыша');

  useEffect(() => {
    const s = localStorage.getItem('kindi_baby');
    if (s) setBabyName(JSON.parse(s).name || 'малыша');
  }, []);

  const filtered = filter === 'Все' ? products : products.filter(p => p.age === filter);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <PageHeader title={`Товары для ${babyName}`} showBack={false} />
      <div className="px-5 pb-24">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {ageFilters.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`whitespace-nowrap px-3 py-2 rounded-xl text-sm font-semibold ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>{f}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {filtered.map(p => (
            <div key={p.name} className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center text-center">
              <span className="text-4xl mb-2">{p.emoji}</span>
              <h3 className="font-semibold text-foreground text-sm">{p.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{p.age} мес</p>
              <p className="font-bold text-foreground mt-1">{p.price}</p>
              <button onClick={() => window.open('https://google.com', '_blank')} className="mt-2 w-full py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold">
                Смотреть →
              </button>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ShopPage;
