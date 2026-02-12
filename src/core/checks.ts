import type { CheckConfig, CheckInput, CheckResult } from './types';

function parseJsonSafe(text: string): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  if (!text || !text.trim()) return { ok: false, error: 'empty' };
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

function findSignatureValue(value: unknown, signatureKeys: Set<string>, depth: number): string {
  if (depth > 6) return '';
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findSignatureValue(item, signatureKeys, depth + 1);
      if (found) return found;
    }
  }
  if (value && typeof value === 'object') {
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (signatureKeys.has(key.toLowerCase()) && typeof val === 'string' && val.trim()) {
        return val;
      }
      const found = findSignatureValue(val, signatureKeys, depth + 1);
      if (found) return found;
    }
  }
  return '';
}

export function extractSignatureFromResponse(rawText: string): { value: string; source: string } {
  const parsed = parseJsonSafe(rawText);
  if (!parsed.ok) return { value: '', source: '' };
  const signatureKeys = new Set(['signature', 'sig', 'x-claude-signature', 'x_signature', 'xsignature']);
  const result = findSignatureValue(parsed.value, signatureKeys, 0);
  if (result) return { value: result, source: '响应JSON' };
  return { value: '', source: '' };
}

export const checksConfig: CheckConfig[] = [
  {
    id: 'signature',
    label: 'Signature 长度检测',
    weight: 12,
    evaluate: (input: CheckInput) => {
      const length = input.signature.trim().length;
      const min = input.signatureMin;
      return { pass: length >= min, detail: `${input.signatureSource}长度 ${length}，阈值 ${min}` };
    },
  },
  {
    id: 'answerIdentity',
    label: '身份回答检测',
    weight: 12,
    evaluate: (input: CheckInput) => {
      const keywords = ['claude code', 'cli', '命令行', 'command', 'terminal'];
      const text = input.answerText.toLowerCase();
      const pass = keywords.some((k) => text.includes(k));
      return { pass, detail: pass ? '包含关键身份词' : '未发现关键身份词' };
    },
  },
  {
    id: 'thinkingOutput',
    label: 'Thinking 输出检测',
    weight: 14,
    evaluate: (input: CheckInput) => {
      const text = input.thinkingText.trim();
      if (!text) return { pass: false, detail: '响应中无 thinking 内容' };
      return { pass: true, detail: `检测到 thinking 输出（${text.length} 字符）` };
    },
  },
  {
    id: 'thinkingIdentity',
    label: 'Thinking 身份检测',
    weight: 8,
    evaluate: (input: CheckInput) => {
      if (!input.thinkingText.trim()) return { pass: false, detail: '未提供 thinking 文本' };
      const keywords = ['claude code', 'cli', '命令行', 'command', 'tool'];
      const text = input.thinkingText.toLowerCase();
      const pass = keywords.some((k) => text.includes(k));
      return { pass, detail: pass ? '包含 Claude Code/CLI 相关词' : '未发现关键词' };
    },
  },
  {
    id: 'responseStructure',
    label: '响应结构检测',
    weight: 14,
    evaluate: (input: CheckInput) => {
      const parsed = parseJsonSafe(input.responseJson);
      if (!parsed.ok) return { pass: false, detail: 'JSON 无法解析' };
      const data = parsed.value as Record<string, unknown>;
      const usage = data.usage as Record<string, unknown> | undefined;
      const hasId = 'id' in data;
      const hasCacheCreation = 'cache_creation' in data || (usage != null && 'cache_creation' in usage);
      const hasServiceTier = 'service_tier' in data || (usage != null && 'service_tier' in usage);
      const missing: string[] = [];
      if (!hasId) missing.push('id');
      if (!hasCacheCreation) missing.push('cache_creation');
      if (!hasServiceTier) missing.push('service_tier');
      return { pass: hasId && hasCacheCreation, detail: missing.length === 0 ? '关键字段齐全' : `缺少字段：${missing.join(', ')}` };
    },
  },
  {
    id: 'systemPrompt',
    label: '系统提示词检测',
    weight: 10,
    evaluate: (input: CheckInput) => {
      const risky = ['system prompt', 'ignore previous', 'override', '越权'];
      const text = `${input.answerText} ${input.thinkingText}`.toLowerCase();
      const hit = risky.some((k) => text.includes(k));
      return { pass: !hit, detail: hit ? '疑似提示词注入' : '未发现异常提示词' };
    },
  },
  {
    id: 'toolSupport',
    label: '工具支持检测',
    weight: 12,
    evaluate: (input: CheckInput) => {
      const keywords = ['file', 'command', 'bash', 'shell', 'read', 'write', 'execute', '编辑', '读取', '写入', '执行'];
      const text = input.answerText.toLowerCase();
      const pass = keywords.some((k) => text.includes(k));
      return { pass, detail: pass ? '包含工具能力描述' : '未出现工具能力词' };
    },
  },
  {
    id: 'multiTurn',
    label: '多轮对话检测',
    weight: 10,
    evaluate: (input: CheckInput) => {
      const keywords = ['claude code', 'cli', 'command line', '工具'];
      const text = `${input.answerText}\n${input.thinkingText}`.toLowerCase();
      const hits = keywords.filter((k) => text.includes(k)).length;
      const pass = hits >= 2;
      return { pass, detail: pass ? '多处确认身份' : '确认次数偏少' };
    },
  },
  {
    id: 'config',
    label: 'Output Config 检测',
    weight: 10,
    evaluate: (input: CheckInput) => {
      const parsed = parseJsonSafe(input.responseJson);
      if (!parsed.ok) return { pass: false, detail: 'JSON 无法解析' };
      const data = parsed.value as Record<string, unknown>;
      const usage = data.usage as Record<string, unknown> | undefined;
      const hasCacheCreation = 'cache_creation' in data || (usage != null && 'cache_creation' in usage);
      const hasServiceTier = 'service_tier' in data || (usage != null && 'service_tier' in usage);
      const pass = hasCacheCreation || hasServiceTier;
      return { pass, detail: pass ? '配置字段存在' : '未发现配置字段' };
    },
  },
];

export function evaluateChecks(input: CheckInput, mode: 'quick' | 'full'): { results: CheckResult[]; score: number } {
  let activeChecks = mode === 'quick'
    ? checksConfig.filter((c) => c.id !== 'thinkingIdentity')
    : [...checksConfig];

  if (input.skipIdentityChecks) {
    activeChecks = activeChecks.filter(
      (c) => c.id !== 'answerIdentity' && c.id !== 'thinkingIdentity' && c.id !== 'multiTurn'
    );
  }

  const results: CheckResult[] = activeChecks.map((c) => {
    const outcome = c.evaluate(input);
    return { id: c.id, label: c.label, weight: c.weight, pass: outcome.pass, detail: outcome.detail };
  });

  const totalWeight = results.reduce((sum, r) => sum + r.weight, 0);
  const gainedWeight = results.filter((r) => r.pass).reduce((sum, r) => sum + r.weight, 0);
  const score = totalWeight > 0 ? Math.round((gainedWeight / totalWeight) * 100) : 0;

  return { results, score };
}

export function getVerdict(score: number): 'genuine' | 'suspected' | 'likely_fake' {
  if (score >= 85) return 'genuine';
  if (score >= 60) return 'suspected';
  return 'likely_fake';
}
// --- PLACEHOLDER_MORE_CHECKS ---
