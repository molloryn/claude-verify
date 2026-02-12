import type { VerificationMode } from '@/core/types';

interface FooterProps {
  onReset: () => void;
  onVerify: (mode: VerificationMode) => void;
  testing: boolean;
}

export function Footer({ onReset, onVerify, testing }: FooterProps) {
  return (
    <footer className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/20 dark:border-slate-700/30">
      <button
        onClick={onReset}
        className="px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        关闭
      </button>
      <button
        onClick={() => onVerify('quick')}
        disabled={testing}
        className="px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
      >
        快速验证
      </button>
      <button
        onClick={() => onVerify('full')}
        disabled={testing}
        className="shimmer px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all active:scale-[0.97] disabled:opacity-50"
      >
        完整验证
      </button>
    </footer>
  );
}
