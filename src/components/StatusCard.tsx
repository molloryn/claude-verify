import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Loader2, Clock } from 'lucide-react';
import type { AppStatus, Verdict } from '@/core/types';

interface StatusCardProps {
  status: AppStatus;
  verdict: Verdict;
  title: string;
  subtitle: string;
}

function getConfig(status: AppStatus, verdict: Verdict) {
  if (status === 'testing') {
    return {
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
      icon: <Loader2 size={20} className="animate-spin text-blue-500" />,
      iconBg: 'bg-blue-100 dark:bg-blue-900',
    };
  }
  if (status === 'idle') {
    return {
      bg: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700',
      icon: <Clock size={20} className="text-slate-400" />,
      iconBg: 'bg-slate-100 dark:bg-slate-800',
    };
  }
  if (verdict === 'genuine') {
    return {
      bg: 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800',
      icon: <CheckCircle size={20} className="text-green-500" />,
      iconBg: 'bg-green-100 dark:bg-green-900',
    };
  }
  if (verdict === 'suspected') {
    return {
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      icon: <AlertTriangle size={20} className="text-amber-500" />,
      iconBg: 'bg-amber-100 dark:bg-amber-900',
    };
  }
  if (verdict === 'likely_fake') {
    return {
      bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800',
      icon: <XCircle size={20} className="text-red-500" />,
      iconBg: 'bg-red-100 dark:bg-red-900',
    };
  }
  // fail status without verdict
  return {
    bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800',
    icon: <XCircle size={20} className="text-red-500" />,
    iconBg: 'bg-red-100 dark:bg-red-900',
  };
}

export function StatusCard({ status, verdict, title, subtitle }: StatusCardProps) {
  const config = getConfig(status, verdict);

  return (
    <div className={`mx-6 mt-4 rounded-xl border p-4 flex items-center gap-4 transition-colors duration-500 ${config.bg}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${status}-${verdict}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.iconBg}`}
        >
          {config.icon}
        </motion.div>
      </AnimatePresence>
      <div className="min-w-0">
        <div className="font-semibold text-slate-800 dark:text-slate-100">{title}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</div>
      </div>
    </div>
  );
}
