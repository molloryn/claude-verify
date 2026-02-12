import { useState, useRef } from 'react';
import { ClipboardPaste } from 'lucide-react';
import { parseEnvExports } from '@/core/parse-env';

interface EnvImportCardProps {
  onFieldChange: (field: string, value: unknown) => void;
}

type Feedback = 'idle' | 'success' | 'error';

export function EnvImportCard({ onFieldChange }: EnvImportCardProps) {
  const [feedback, setFeedback] = useState<Feedback>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const showFeedback = (type: 'success' | 'error') => {
    clearTimeout(timerRef.current);
    setFeedback(type);
    timerRef.current = setTimeout(() => setFeedback('idle'), 2000);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData('text/plain');
    const parsed = parseEnvExports(text);

    if (!parsed) {
      showFeedback('error');
      return;
    }

    e.preventDefault();
    if (parsed.apiType) onFieldChange('apiType', parsed.apiType);
    if (parsed.apiEndpoint) onFieldChange('apiEndpoint', parsed.apiEndpoint);
    if (parsed.apiKey) onFieldChange('apiKey', parsed.apiKey);
    showFeedback('success');
  };

  const borderColor =
    feedback === 'success'
      ? 'border-green-400 dark:border-green-500'
      : feedback === 'error'
        ? 'border-red-400 dark:border-red-500'
        : 'border-slate-200/60 dark:border-slate-700/40';

  return (
    <div className={`rounded-xl border ${borderColor} bg-gradient-to-br from-slate-50/80 to-emerald-50/40 dark:from-slate-800/60 dark:to-emerald-950/20 p-4 transition-colors duration-300`}>
      <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 mb-3">
        <ClipboardPaste size={16} className="text-emerald-500" />
        快速导入配置
      </span>
      <textarea
        onPaste={handlePaste}
        rows={3}
        placeholder={'粘贴 export 语句即可自动填充，例如：\nexport ANTHROPIC_BASE_URL="https://..."\nexport ANTHROPIC_AUTH_TOKEN="sk-..."'}
        className={`input-field w-full text-sm transition-colors duration-300 ${
          feedback === 'success'
            ? 'border-green-400 dark:border-green-500'
            : feedback === 'error'
              ? 'border-red-400 dark:border-red-500'
              : ''
        }`}
      />
      {feedback === 'success' && (
        <p className="text-xs text-green-600 dark:text-green-400 mt-1.5">已成功导入配置</p>
      )}
      {feedback === 'error' && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">未识别到有效的环境变量</p>
      )}
    </div>
  );
}
