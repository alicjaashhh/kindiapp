import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Article { title: string; desc: string; emoji: string; body: string; expert: string; expertName: string; }

const articlesByAge: Record<string, Article[]> = {
  '0-3': [
    {
      title: 'Как наладить грудное вскармливание', desc: 'Советы консультантов по ГВ для первых дней жизни.', emoji: '🤱',
      body: 'Прикладывайте малыша к груди по требованию, не менее 8-12 раз в сутки. Следите за правильным захватом: рот широко открыт, нижняя губа вывернута, виден ареол сверху. Не докармливайте смесью без необходимости — это снижает лактацию.',
      expertName: 'Анна Петрова, консультант АКЕВ',
      expert: 'В первые недели важно установить контакт «кожа к коже» и кормить именно по требованию. Молоко приходит на 3-5 сутки, до этого молозиво полностью покрывает потребности малыша.'
    },
    {
      title: 'Колики: что делать', desc: 'Причины и способы облегчить состояние ребёнка.', emoji: '😢',
      body: 'Колики появляются на 2-3 неделе и проходят к 3-4 месяцам. Помогает: выкладывание на живот, тёплая пелёнка, массаж по часовой стрелке вокруг пупка, ношение «столбиком» после кормления.',
      expertName: 'Др. Комаровский',
      expert: 'Колики — норма. Главное правило: маме сохранять спокойствие. Лекарства редко эффективнее времени и любящих рук.'
    },
    {
      title: 'Развитие в первый месяц', desc: 'Что умеет новорождённый.', emoji: '🧒',
      body: 'Малыш фиксирует взгляд на лице мамы с расстояния 20-25 см, реагирует на громкие звуки, держит головку лёжа на животе несколько секунд, активно сосёт.',
      expertName: 'Невролог Е. Иванова',
      expert: 'Не сравнивайте малыша с другими. Развитие индивидуально, важна тенденция к появлению новых навыков, а не точные сроки.'
    },
  ],
  '3-6': [
    {
      title: 'Введение прикорма', desc: 'Когда и с чего начинать.', emoji: '🥄',
      body: 'ВОЗ рекомендует начинать прикорм с 6 месяцев. Первые продукты: овощные пюре (кабачок, брокколи), безмолочные каши (гречка, рис). Вводить по 1 продукту в 5-7 дней, начиная с 1 чайной ложки.',
      expertName: 'Педиатр И. Соколова',
      expert: 'Не торопитесь с прикормом до 6 месяцев — пищеварительная система ещё не готова. Идеальный маркер готовности: удвоение веса от рождения и интерес к еде взрослых.'
    },
    {
      title: 'Первые игрушки', desc: 'Какие игрушки подходят для 3-6 месяцев.', emoji: '🧸',
      body: 'Подходят: погремушки с разной фактурой, мобили, развивающие коврики, прорезыватели. Все игрушки должны быть из безопасных материалов, без мелких деталей.',
      expertName: 'Психолог М. Лебедева',
      expert: 'Лучшая «игрушка» — мама. Контакт глаз, разговоры, тактильные игры важнее любых дорогих игрушек.'
    },
  ],
  '6-12': [
    {
      title: 'Прорезывание зубов', desc: 'Симптомы и средства.', emoji: '🦷',
      body: 'Первые зубы (нижние резцы) появляются обычно в 6-8 месяцев. Симптомы: обильное слюнотечение, желание грызть, беспокойство, иногда повышение температуры. Помогают: охлаждённые прорезыватели, гели с лидокаином (по назначению врача).',
      expertName: 'Стоматолог В. Орлова',
      expert: 'Сроки прорезывания варьируются от 3 до 14 месяцев. Не нужно паниковать, если зубы запаздывают — это часто наследственное.'
    },
    {
      title: 'Безопасность дома', desc: 'Чек-лист для ползунка.', emoji: '🏠',
      body: 'Закройте розетки, уберите мелкие предметы, поставьте заглушки на углы мебели, закрепите шкафы к стене, уберите бытовую химию выше 1.5 м, поставьте ограничители на окна.',
      expertName: 'Травматолог С. Жуков',
      expert: 'Самые частые травмы — падения и проглатывание мелочей. Простой тест: всё, что проходит через рулон от туалетной бумаги, опасно для малыша.'
    },
  ],
  '1-3': [
    {
      title: 'Речь: первые слова', desc: 'Как стимулировать развитие речи.', emoji: '🗣️',
      body: 'Говорите с малышом простыми фразами, читайте книги, пойте песенки, описывайте свои действия. Не сюсюкайте — используйте правильные слова. Откажитесь от соски после 1 года.',
      expertName: 'Логопед О. Васильева',
      expert: 'До 2 лет нормально иметь словарь от 20 до 200 слов — разброс огромный. Тревожный знак: ребёнок не понимает обращённую речь.'
    },
    {
      title: 'Истерики: что делать', desc: 'Кризис 2 лет.', emoji: '😤',
      body: 'Истерики — нормальный этап. Не наказывайте, но и не уступайте. Останьтесь рядом, говорите спокойно. После — обнимите и обсудите чувства.',
      expertName: 'Психолог Л. Петрановская',
      expert: 'Истерика — это перегруз нервной системы, а не манипуляция. Ваше спокойствие — главный регулятор для ребёнка.'
    },
  ],
};

const ageTabs = ['0-3', '3-6', '6-12', '1-3'];
const ageLabels: Record<string, string> = { '0-3': '0-3 мес', '3-6': '3-6 мес', '6-12': '6-12 мес', '1-3': '1-3 года' };

const ArticlesPage = () => {
  const [activeAge, setActiveAge] = useState('0-3');
  const [open, setOpen] = useState<Article | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <PageHeader title="Полезные статьи" showBack={false} />
      <div className="px-5 pb-24">
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
          {ageTabs.map(t => (
            <button key={t} onClick={() => setActiveAge(t)} className={`whitespace-nowrap px-3 py-2 rounded-xl text-sm font-semibold ${activeAge === t ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>{ageLabels[t]}</button>
          ))}
        </div>
        <div className="space-y-3">
          {articlesByAge[activeAge].map((a, i) => (
            <motion.button key={a.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setOpen(a)}
              className="w-full text-left bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md">
              <div className="flex gap-3">
                <span className="text-2xl">{a.emoji}</span>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{a.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="flex gap-2 items-center"><span className="text-2xl">{open?.emoji}</span>{open?.title}</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-2">
            <p className="text-sm text-foreground leading-relaxed">{open?.body}</p>
            <div className="mt-4 p-3 rounded-xl bg-muted">
              <p className="text-xs font-bold text-foreground mb-1">💬 Мнение специалиста — {open?.expertName}</p>
              <p className="text-xs text-foreground italic">«{open?.expert}»</p>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <BottomNav />
    </div>
  );
};

export default ArticlesPage;
