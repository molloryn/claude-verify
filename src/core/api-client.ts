import type { ApiConfig, ApiTestResult, ApiType } from './types';

function parseJsonSafe(text: string): { ok: true; value: Record<string, unknown> } | { ok: false; error: string } {
  if (!text || !text.trim()) return { ok: false, error: 'empty' };
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

function buildApiRequest(config: ApiConfig): { url: string; options: RequestInit } {
  if (config.apiType === 'openai') {
    return {
      url: config.apiEndpoint,
      options: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.apiModel,
          messages: [{ role: 'user', content: config.apiPrompt }],
          temperature: 0,
        }),
      },
    };
  }
  return {
    url: config.apiEndpoint,
    options: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'interleaved-thinking-2025-05-14',
      },
      body: JSON.stringify({
        model: config.apiModel,
        max_tokens: 1024,
        messages: [{ role: 'user', content: config.apiPrompt }],
        thinking: { budget_tokens: 1024, type: 'enabled' },
      }),
    },
  };
}
function extractAnswerText(apiType: ApiType, data: Record<string, unknown>): string {
  if (apiType === 'anthropic') {
    if (Array.isArray(data.content)) {
      return (data.content as Array<{ type: string; text?: string }>)
        .filter((item) => item.type === 'text')
        .map((item) => item.text)
        .join('\n');
    }
    return (data.text as string) || '';
  }
  const choices = data.choices as Array<{ message?: { content?: string }; text?: string }> | undefined;
  const choice = choices?.[0];
  return (choice?.message?.content || choice?.text) ?? '';
}

function extractThinkingText(apiType: ApiType, data: Record<string, unknown>): string {
  if (apiType === 'anthropic' && Array.isArray(data.content)) {
    return (data.content as Array<{ type: string; thinking?: string; text?: string }>)
      .filter((item) => item.type === 'thinking')
      .map((item) => item.thinking || item.text)
      .filter(Boolean)
      .join('\n');
  }
  if (data.thinking) return String(data.thinking);
  return '';
}

export async function runApiTest(config: ApiConfig): Promise<ApiTestResult> {
  if (!config.apiEndpoint || !config.apiKey) {
    return { success: false, error: 'API 信息不完整，请填写接口地址和 API Key。' };
  }
  if (!config.apiModel) {
    return { success: false, error: '缺少模型名称，请填写模型名称。' };
  }

  try {
    const { url, options } = buildApiRequest(config);
    const response = await fetch(url, options);
    const rawText = await response.text();
    const json = parseJsonSafe(rawText);

    if (!response.ok) {
      return { success: false, error: `状态码 ${response.status}，请检查接口/Key/CORS`, statusCode: response.status };
    }
    if (!json.ok) {
      return { success: false, error: '接口返回内容无法解析为 JSON。', responseJson: rawText };
    }

    const responseJson = JSON.stringify(json.value, null, 2);
    const answerText = extractAnswerText(config.apiType, json.value);
    const thinkingText = extractThinkingText(config.apiType, json.value);

    return { success: true, responseJson, answerText, thinkingText };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
