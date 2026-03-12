import { useState } from 'react';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import PageHeader from '@/components/PageHeader';

const skillsByAge: Record<string, { label: string; skills: string[] }> = {
  '0-3': { label: '0-3 месяца', skills: ['Удерживает голову', 'Следит за предметами', 'Улыбается в ответ', 'Реагирует на звуки', 'Поднимает голову лёжа на животе', 'Гулит'] },
  '3-6': { label: '3-6 месяцев', skills: ['Переворачивается', 'Хватает игрушки', 'Смеётся', 'Узнаёт родителей', 'Тянет предметы в рот', 'Держит голову уверенно'] },
  '6-12': { label: '6-12 месяцев', skills: ['Сидит без поддержки', 'Ползает', 'Встаёт у опоры', 'Говорит «мама»/«папа»', 'Машет «пока»', 'Берёт мелкие предметы'] },
  '1-2': { label: '1-2 года', skills: ['Ходит самостоятельно', 'Говорит 10+ слов', 'Пьёт из чашки', 'Рисует каракули', 'Строит башню из кубиков', 'Показывает части тела'] },
  '2-3': { label: '2-3 года', skills: ['Говорит предложениями', 'Бегает', 'Одевается с помощью', 'Знает цвета', 'Считает до 5', 'Играет с другими детьми'] },
};

const SkillsPage = () => {
  const [activeAge, setActiveAge] = useState('0-3');
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const stored = localStorage.getItem('kindi_skills');
    return stored ? JSON.parse(stored) : {};
  });

  const toggle = (skill: string) => {
    const key = `${activeAge}:${skill}`;
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    localStorage.setItem('kindi_skills', JSON.stringify(next));
  };

  const current = skillsByAge[activeAge];

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <PageHeader title="Скилы месяца" />
      <div className="px-5 pb-24">
        {/* Age tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {Object.entries(skillsByAge).map(([key, val]) => (
            <button key={key} onClick={() => setActiveAge(key)} className={`whitespace-nowrap px-3 py-2 rounded-xl text-sm font-semibold ${activeAge === key ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>
              {val.label}
            </button>
          ))}
        </div>

        {/* Skills checklist */}
        <div className="space-y-2 mt-4">
          {current.skills.map((skill, i) => {
            const key = `${activeAge}:${skill}`;
            return (
              <motion.button
                key={skill}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => toggle(skill)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${checked[key] ? 'bg-primary/10 border-primary' : 'bg-card border-border'}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${checked[key] ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                  {checked[key] && <span className="text-primary-foreground text-xs">✓</span>}
                </div>
                <span className={`text-sm font-medium ${checked[key] ? 'text-foreground' : 'text-muted-foreground'}`}>{skill}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Graph placeholder */}
        <div className="mt-6 bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-sm text-muted-foreground">📊 График «Ваш малыш vs средние показатели» — скоро</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default SkillsPage;
