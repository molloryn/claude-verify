interface ManualInputFormProps {
  signature: string;
  signatureMin: number;
  responseJson: string;
  answerText: string;
  thinkingText: string;
  onFieldChange: (field: string, value: unknown) => void;
}

export function ManualInputForm({
  signature, signatureMin, responseJson, answerText, thinkingText, onFieldChange,
}: ManualInputFormProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Signature（签名）</span>
        <textarea
          value={signature}
          onChange={(e) => onFieldChange('signature', e.target.value)}
          placeholder="粘贴签名内容..."
          rows={2}
          className="input-field resize-y"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">签名长度最小阈值</span>
          <input
            type="number"
            value={signatureMin}
            onChange={(e) => onFieldChange('signatureMin', parseInt(e.target.value, 10) || 100)}
            className="input-field"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">响应 JSON</span>
          <textarea
            value={responseJson}
            onChange={(e) => onFieldChange('responseJson', e.target.value)}
            placeholder='粘贴响应 JSON，例如 {"id":"...","service_tier":"..."}'
            rows={2}
            className="input-field resize-y"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">回答文本（assistant response）</span>
        <textarea
          value={answerText}
          onChange={(e) => onFieldChange('answerText', e.target.value)}
          placeholder="粘贴助手的回答内容..."
          rows={3}
          className="input-field resize-y"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Thinking 文本（可选）</span>
        <textarea
          value={thinkingText}
          onChange={(e) => onFieldChange('thinkingText', e.target.value)}
          placeholder="粘贴 thinking 内容..."
          rows={3}
          className="input-field resize-y"
        />
      </label>
    </div>
  );
}
