import { motion } from 'framer-motion';
import type { Verdict } from '@/core/types';

interface ScoreGaugeProps {
  score: number;
  verdict: Verdict;
}

function getScoreColor(score: number): string {
  if (score >= 85) return '#22c55e';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

function getScoreLabel(score: number): string {
  if (score >= 85) return '极高可信';
  if (score >= 60) return '中等可信';
  return '偏低可信';
}

export function ScoreGauge({ score, verdict }: ScoreGaugeProps) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = verdict === 'pending' ? 0 : score / 100;
  const offset = circumference * (1 - progress);
  const color = verdict === 'pending' ? '#94a3b8' : getScoreColor(score);

  return (
    <div className="rounded-xl border border-slate-200/60 dark:border-slate-700/40 bg-white dark:bg-slate-800/60 p-5 flex flex-col items-center gap-3">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">可信度评分</span>
      <div className="relative w-[108px] h-[108px]">
        <svg width="108" height="108" viewBox="0 0 108 108" className="-rotate-90">
          <circle
            cx="54" cy="54" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            className="text-slate-100 dark:text-slate-700"
          />
          <motion.circle
            cx="54" cy="54" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-2xl font-bold tabular-nums"
            style={{ color }}
            key={score}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {verdict === 'pending' ? '--' : score}
          </motion.span>
        </div>
      </div>
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {verdict === 'pending' ? '等待验证' : getScoreLabel(score)}
      </span>
    </div>
  );
}
