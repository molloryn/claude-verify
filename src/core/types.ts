export type VerificationMode = 'quick' | 'full';

export type Verdict = 'genuine' | 'suspected' | 'likely_fake' | 'pending';

export type ApiType = 'anthropic' | 'openai';

export type AppStatus = 'idle' | 'testing' | 'pass' | 'fail';

export interface CheckInput {
  signature: string;
  signatureSource: string;
  signatureMin: number;
  responseJson: string;
  answerText: string;
  thinkingText: string;
  skipIdentityChecks: boolean;
}

export interface CheckResult {
  id: string;
  label: string;
  weight: number;
  pass: boolean;
  detail: string;
}

export interface CheckConfig {
  id: string;
  label: string;
  weight: number;
  evaluate: (input: CheckInput) => { pass: boolean; detail: string };
}

export interface ApiConfig {
  apiType: ApiType;
  apiEndpoint: string;
  apiKey: string;
  apiModel: string;
  apiPrompt: string;
}

export interface ApiTestResult {
  success: boolean;
  responseJson?: string;
  answerText?: string;
  thinkingText?: string;
  error?: string;
  statusCode?: number;
}
