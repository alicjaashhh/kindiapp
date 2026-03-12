import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';

const articlesByAge: Record<string, { title: string; desc: string; emoji: string }[]> = {
  '0-3': [
    { title: 'Как наладить грудное вскармливание', desc: 'Советы консультантов по ГВ для первых дней жизни малыша.', emoji: '🤱' },
    { title: 'Колики: что делать', desc: 'Причины и способы облегчить состояние ребёнка.', emoji: '😢' },
    { title: 'Развитие в первый месяц', desc: 'Что умеет новорождённый и как стимулировать развитие.', emoji: '🧒' },
    { title: 'Купание малыша', desc: 'Температура воды, частота и безопасность.', emoji: '🛁' },
  ],
  '3-6': [
    { title: 'Первые игрушки', desc: 'Какие игрушки подходят для малыша 3-6 месяцев.', emoji: '🧸' },
    { title: 'Введение прикорма', desc: 'Когда и с чего начинать прикорм.', emoji: '🥄' },
    { title: 'Режим дня в 4 месяца', desc: 'Оптимальный распорядок сна и бодрствования.', emoji: '⏰' },
  ],
  '6-12': [
    { title: 'Ползание и первые шаги', desc: 'Как помочь малышу начать двигаться.', emoji: '🚶' },
    { title: 'Безопасность дома', desc: 'Чек-лист защиты от опасностей для ползунка.', emoji: '🏠' },
    { title: 'Прорезывание зубов', desc: 'Симптомы, средства и когда идти к врачу.', emoji: '🦷' },
  ],
  '1-3': [
    { title: 'Речь: первые слова', desc: 'Как стимулировать развитие речи у ребёнка.', emoji: '🗣️' },
    { title: 'Приучение к горшку', desc: 'Когда начинать и как это делать правильно.', emoji: '🚽' },
    { title: 'Игры для развития', desc: 'Развивающие занятия для малышей 1-3 лет.', emoji: '🎨' },
  ],
};

const ageTabs = ['0-3', '3-6', '6-12', '1-3'];
const ageLabels: Record<string, string> = { '0-3': '0-3 мес', '3-6': '3-6 мес', '6-12': '6-12 мес', '1-3': '1-3 года' };

const ArticlesPage = () => {
  const [activeAge, setActiveAge] = useState('0-3');

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <PageHeader title="Полезные статьи" showBack={false} />
      <div className="px-5 pb-24">
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          {ageTabs.map(t => (
            <button key={t} onClick={() => setActiveAge(t)} className={`whitespace-nowrap px-3 py-2 rounded-xl text-sm font-semibold ${activeAge === t ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>{ageLabels[t]}</button>
          ))}
        </div>
        <div className="space-y-3">
          {articlesByAge[activeAge].map((a, i) => (
            <motion.button
              key={a.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="w-full text-left bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
              onClick={() => {}}
            >
              <div className="flex gap-3">
                <span className="text-2xl">{a.emoji}</span>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{a.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ArticlesPage;
