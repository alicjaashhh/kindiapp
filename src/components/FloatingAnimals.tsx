import { motion } from 'framer-motion';

const animals = [
  { emoji: '🦘', x: '10%', y: '15%', delay: 0 },
  { emoji: '🐘', x: '85%', y: '35%', delay: 0.5 },
  { emoji: '🦒', x: '5%', y: '60%', delay: 1 },
  { emoji: '🐨', x: '90%', y: '75%', delay: 1.5 },
  { emoji: '🦁', x: '15%', y: '85%', delay: 0.8 },
];

const FloatingAnimals = () => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
    {animals.map((a, i) => (
      <motion.div
        key={i}
        className="absolute text-2xl opacity-20"
        style={{ left: a.x, top: a.y }}
        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: a.delay, ease: 'easeInOut' }}
      >
        {a.emoji}
      </motion.div>
    ))}
  </div>
);

export default FloatingAnimals;
