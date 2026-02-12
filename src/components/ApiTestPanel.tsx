import { useState } from 'react';
import { ChevronDown, ChevronUp, Zap } from 'lucide-react';
import type { ApiType } from '@/core/types';

const ANTHROPIC_MODELS = [
  'claude-sonnet-4-5-20250929',
  'claude-sonnet-4-5-20250929-thinking',
  'claude-haiku-4-5',
  'claude-haiku-4-5-20251001',
  'claude-haiku-4-5-20251001-thinking',
  'claude-opus-4-5-20251101',
  'claude-opus-4-5-20251101-thinking',
  'claude-opus-4-6',
  'claude-opus-4-6-20260206',
  'claude-opus-4-6-thinking',
];

const OPENAI_MODELS = [
  'gpt-5.2-codex',
  'gpt-5.3-codex',
];

interface ApiTestPanelProps {
  apiType: ApiType;
  apiEndpoint: string;
  apiKey: string;
  apiModel: string;
  apiPrompt: string;
  skipIdentityChecks: boolean;
  testing: boolean;
  onFieldChange: (field: string, value: unknown) => void;
  onTest: () => void;
  onFillPrompt: () => void;
}

export function ApiTestPanel({
  apiType, apiEndpoint, apiKey, apiModel, apiPrompt,
  skipIdentityChecks, testing, onFieldChange, onTest, onFillPrompt,
}: ApiTestPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const handleEndpointPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (apiType !== 'anthropic') return;
    const text = e.clipboardData.getData('text/plain').trim().replace(/\/+$/, '');
    if (text && !text.endsWith('/v1/messages')) {
      e.preventDefault();
      onFieldChange('apiEndpoint', text + '/v1/messages');
    }
  };

  return (
    <div className="rounded-xl border border-slate-200/60 dark:border-slate-700/40 bg-gradient-to-br from-slate-50/80 to-blue-50/40 dark:from-slate-800/60 dark:to-blue-950/20 p-4">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <Zap size={16} className="text-blue-500" />
          内置测试提示词工具
        </span>
        {collapsed ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronUp size={18} className="text-slate-400" />}
      </button>

      {!collapsed && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">API 类型</span>
              <select
                value={apiType}
                onChange={(e) => onFieldChange('apiType', e.target.value)}
                className="input-field"
              >
                <option value="anthropic">Anthropic Messages</option>
                <option value="openai">OpenAI Compatible</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">API 接口地址</span>
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => onFieldChange('apiEndpoint', e.target.value)}
                onPaste={handleEndpointPaste}
                placeholder="https://api.xxx.com/v1/messages"
                className="input-field"
              />
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">API Key</span>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => onFieldChange('apiKey', e.target.value)}
                placeholder="粘贴你的 API Key"
                className="input-field"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">模型（可选）</span>
              <input
                type="text"
                list="model-options"
                value={apiModel}
                onChange={(e) => onFieldChange('apiModel', e.target.value)}
                placeholder="选择或输入模型名称"
                className="input-field"
              />
              <datalist id="model-options">
                {(apiType === 'anthropic' ? ANTHROPIC_MODELS : OPENAI_MODELS).map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">测试提示词</span>
            <textarea
              value={apiPrompt}
              onChange={(e) => onFieldChange('apiPrompt', e.target.value)}
              rows={3}
              className="input-field resize-y"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={skipIdentityChecks}
              onChange={(e) => onFieldChange('skipIdentityChecks', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 accent-blue-600"
            />
            若提示词不是"身份确认类"，跳过身份检测项
          </label>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              提示：浏览器可能会遇到跨域限制，如失败可使用本地代理。
            </span>
            <div className="flex gap-2">
              <button
                onClick={onFillPrompt}
                className="px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                填充默认提示词
              </button>
              <button
                onClick={onTest}
                disabled={testing}
                className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all active:scale-[0.97] disabled:opacity-50"
              >
                {testing ? '测试中...' : '内置测试'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
