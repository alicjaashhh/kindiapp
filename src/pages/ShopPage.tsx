import { useState, useEffect } from 'react';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';

interface Product {
  name: string; age: string; price: string; emoji: string; url: string;
}

const products: Product[] = [
  { name: 'Подгузники Pampers Premium', age: '0-3', price: '1 290 ₽', emoji: '🧷', url: 'https://www.wildberries.ru/catalog/0/search.aspx?search=подгузники+pampers+newborn' },
  { name: 'Пелёнки одноразовые', age: '0-3', price: '650 ₽', emoji: '🧵', url: 'https://www.wildberries.ru/catalog/0/search.aspx?search=пелёнки+одноразовые+для+новорождённых' },
  { name: 'Бутылочка антиколиковая', age: '0-3', price: '890 ₽', emoji: '🍼', url: 'https://www.wildberries.ru/catalog/0/search.aspx?search=бутылочка+антиколиковая' },
  { name: 'Погремушка-мобиль', age: '3-6', price: '1 450 ₽', emoji: '🎀', url: 'https://www.wildberries.ru/catalog/0/search.aspx?search=погремушка+развивающая' },
  { name: 'Развивающий коврик', age: '3-6', price: '2 990 ₽', emoji: '🎨', url: 'https://www.wildberries.ru/catalog/0/search.aspx?search=развивающий+коврик' },
  { name: 'Прорезыватель силиконовый', age: '6-12', price: '350 ₽', emoji: '🦷', url: 'https://www.wildberries.ru/catalog/0/search.aspx?search=прорезыватель+для+зубов' },
  { name: 'Стульчик для кормления', age: '6-12', price: '4 990 ₽', emoji: '🪑', url: 'https://www.wildberries.ru/catalog/0/search.aspx?search=стульчик+для+кормления' },
  { name: 'Ходунки-каталка', age: '6-12', price: '3 290 ₽', emoji: '🚶', url: 'https://www.wildberries.ru/catalog/0/search.aspx?search=ходунки+каталка' },
  { name: 'Книжка с картинками', age: '1-2', price: '520 ₽', emoji: '📚', url: 'https://www.wildberries.ru/catalog/0/search.aspx?search=книжка+малышам+1+год' },
  { name: 'Сортер деревянный', age: '1-2', price: '890 ₽', emoji: '🔶', url: 'https://www.wildberries.ru/catalog/0/search.aspx?search=сортер+деревянный' },
  { name: 'Конструктор крупные блоки', age: '2-3', price: '1 290 ₽', emoji: '🧱', url: 'https://www.wildberries.ru/catalog/0/search.aspx?search=конструктор+для+малышей' },
  { name: 'Набор для рисования', age: '2-3', price: '780 ₽', emoji: '🖌️', url: 'https://www.wildberries.ru/catalog/0/search.aspx?search=пальчиковые+краски' },
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
        <p className="text-xs text-muted-foreground mb-3">Подобрано на Wildberries по возрасту</p>
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {ageFilters.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`whitespace-nowrap px-3 py-2 rounded-xl text-sm font-semibold ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>{f}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {filtered.map(p => (
            <div key={p.name} className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center text-center">
              <span className="text-4xl mb-2">{p.emoji}</span>
              <h3 className="font-semibold text-foreground text-sm leading-tight">{p.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{p.age} мес</p>
              <p className="font-bold text-foreground mt-1">{p.price}</p>
              <button onClick={() => window.open(p.url, '_blank', 'noopener,noreferrer')} className="mt-2 w-full py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold">
                Открыть на WB →
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
