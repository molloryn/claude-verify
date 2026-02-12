import { motion } from 'framer-motion';
import type { Verdict } from '@/core/types';

interface ResultBadgeProps {
  verdict: Verdict;
}

const verdictConfig: Record<Verdict, { label: string; bg: string; text: string; border: string }> = {
  genuine: { label: '正版 Claude Code', bg: 'bg-green-50 dark:bg-green-950/40', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
  suspected: { label: '疑似 Claude Code', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  likely_fake: { label: '可能非 Claude Code', bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
  pending: { label: '未验证', bg: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700' },
};

export function ResultBadge({ verdict }: ResultBadgeProps) {
  const config = verdictConfig[verdict];

  return (
    <div className="rounded-xl border border-slate-200/60 dark:border-slate-700/40 bg-white dark:bg-slate-800/60 p-5">
      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">鉴定结果</div>
      <motion.div
        key={verdict}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border} transition-colors duration-500`}
      >
        {verdict === 'genuine' && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
        {verdict === 'suspected' && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
        {verdict === 'likely_fake' && <span className="w-2 h-2 rounded-full bg-red-500" />}
        {config.label}
      </motion.div>
    </div>
  );
}
