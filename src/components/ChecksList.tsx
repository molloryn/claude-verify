import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { CheckResult } from '@/core/types';

interface ChecksListProps {
  results: CheckResult[];
}

export function ChecksList({ results }: ChecksListProps) {
  return (
    <div className="rounded-xl border border-slate-200/60 dark:border-slate-700/40 bg-white dark:bg-slate-800/60 p-5">
      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">检测项</div>
      {results.length === 0 ? (
        <div className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">
          点击验证后显示检测结果
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {results.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-colors ${
                item.pass
                  ? 'bg-green-50/60 dark:bg-green-950/20 border-green-200/60 dark:border-green-800/40'
                  : 'bg-red-50/60 dark:bg-red-950/20 border-red-200/60 dark:border-red-800/40'
              }`}
            >
              <div className="min-w-0">
                <div className="font-medium text-slate-700 dark:text-slate-200">{item.label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.detail}</div>
              </div>
              <div className={`flex items-center gap-1 shrink-0 text-xs font-medium ${
                item.pass ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
              }`}>
                {item.pass ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                {item.pass ? '通过' : '未通过'}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
