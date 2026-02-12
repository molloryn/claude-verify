import { Moon, Sun, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/20 dark:border-slate-700/30">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/25">
          <ShieldCheck size={18} />
        </div>
        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Claude Code 真伪鉴定
        </h1>
      </div>
      <button
        onClick={() => setDark(!dark)}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="切换主题"
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}
