export interface ParsedEnvFields {
  apiEndpoint?: string;
  apiKey?: string;
  apiType?: 'anthropic' | 'openai';
}

type FieldKey = 'apiEndpoint' | 'apiKey';

const ENV_MAP: Record<string, { field: FieldKey; type: 'anthropic' | 'openai' }> = {
  ANTHROPIC_BASE_URL: { field: 'apiEndpoint', type: 'anthropic' },
  ANTHROPIC_AUTH_TOKEN: { field: 'apiKey', type: 'anthropic' },
  ANTHROPIC_API_KEY: { field: 'apiKey', type: 'anthropic' },
  OPENAI_BASE_URL: { field: 'apiEndpoint', type: 'openai' },
  OPENAI_API_KEY: { field: 'apiKey', type: 'openai' },
};

const EXPORT_RE = /^\s*export\s+(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/;

export function parseEnvExports(text: string): ParsedEnvFields | null {
  const result: ParsedEnvFields = {};
  let found = false;

  for (const line of text.split('\n')) {
    const match = line.match(EXPORT_RE);
    if (!match) continue;

    const varName = match[1];
    const value = match[2] ?? match[3] ?? match[4] ?? '';
    const mapping = ENV_MAP[varName];

    if (mapping && value) {
      result[mapping.field] = value;
      result.apiType = mapping.type;
      found = true;
    }
  }

  // Auto-append /v1/messages for Anthropic base URLs
  if (result.apiType === 'anthropic' && result.apiEndpoint) {
    const url = result.apiEndpoint.replace(/\/+$/, '');
    if (!url.endsWith('/v1/messages')) {
      result.apiEndpoint = url + '/v1/messages';
    }
  }

  return found ? result : null;
}
