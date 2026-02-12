export interface ParsedEnvFields {
  apiEndpoint?: string;
  apiKey?: string;
}

const ENV_MAP: Record<string, keyof ParsedEnvFields> = {
  ANTHROPIC_BASE_URL: 'apiEndpoint',
  ANTHROPIC_AUTH_TOKEN: 'apiKey',
  ANTHROPIC_API_KEY: 'apiKey',
  OPENAI_BASE_URL: 'apiEndpoint',
  OPENAI_API_KEY: 'apiKey',
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
    const field = ENV_MAP[varName];

    if (field && value) {
      result[field] = value;
      found = true;
    }
  }

  return found ? result : null;
}
