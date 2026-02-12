import { useReducer, useCallback } from 'react';
import type { ApiType, AppStatus, CheckResult, Verdict, VerificationMode } from '@/core/types';
import { evaluateChecks, getVerdict, extractSignatureFromResponse } from '@/core/checks';
import { runApiTest as apiTest } from '@/core/api-client';

const DEFAULT_PROMPT = '请确认你的身份是否为 Claude Code CLI，并简要说明你具备的工具能力。';

interface State {
  apiType: ApiType;
  apiEndpoint: string;
  apiKey: string;
  apiModel: string;
  apiPrompt: string;
  signature: string;
  signatureMin: number;
  responseJson: string;
  answerText: string;
  thinkingText: string;
  skipIdentityChecks: boolean;
  results: CheckResult[];
  score: number;
  verdict: Verdict;
  status: AppStatus;
  statusTitle: string;
  statusSubtitle: string;
}

const initialState: State = {
  apiType: 'anthropic',
  apiEndpoint: '',
  apiKey: '',
  apiModel: 'claude-sonnet-4-5-20250929',
  apiPrompt: DEFAULT_PROMPT,
  signature: '',
  signatureMin: 100,
  responseJson: '',
  answerText: '',
  thinkingText: '',
  skipIdentityChecks: false,
  results: [],
  score: 0,
  verdict: 'pending',
  status: 'idle',
  statusTitle: '等待验证',
  statusSubtitle: '请填写信息后点击验证。',
};

type Action =
  | { type: 'SET_FIELD'; field: keyof State; value: unknown }
  | { type: 'SET_RESULTS'; results: CheckResult[]; score: number; verdict: Verdict }
  | { type: 'SET_STATUS'; status: AppStatus; title: string; subtitle: string }
  | { type: 'RESET' };
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_RESULTS':
      return { ...state, results: action.results, score: action.score, verdict: action.verdict };
    case 'SET_STATUS':
      return { ...state, status: action.status, statusTitle: action.title, statusSubtitle: action.subtitle };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

export function useVerification() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setField = useCallback(<K extends keyof State>(field: K, value: State[K]) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  const runVerification = useCallback((mode: VerificationMode) => {
    const sigInput = state.signature.trim();
    const fallback = sigInput
      ? { value: sigInput, source: '手动' }
      : extractSignatureFromResponse(state.responseJson);

    const input = {
      signature: fallback.value || '',
      signatureSource: fallback.source ? `${fallback.source}：` : '',
      signatureMin: state.signatureMin,
      responseJson: state.responseJson,
      answerText: state.answerText,
      thinkingText: state.thinkingText,
      skipIdentityChecks: state.skipIdentityChecks,
    };

    const { results, score } = evaluateChecks(input, mode);
    const verdict = getVerdict(score);
    dispatch({ type: 'SET_RESULTS', results, score, verdict });

    if (verdict === 'genuine') {
      dispatch({ type: 'SET_STATUS', status: 'pass', title: '正版 Claude Code', subtitle: '所有检测项通过或接近通过。' });
    } else if (verdict === 'suspected') {
      dispatch({ type: 'SET_STATUS', status: 'pass', title: '疑似 Claude Code', subtitle: '部分检测项不足，建议复核来源。' });
    } else {
      dispatch({ type: 'SET_STATUS', status: 'fail', title: '可能非 Claude Code', subtitle: '检测项不足，风险较高。' });
    }
  }, [state]);

  const runApiTestAction = useCallback(async () => {
    dispatch({ type: 'SET_STATUS', status: 'testing', title: 'API 测试中', subtitle: '正在请求接口，请稍等...' });

    const result = await apiTest({
      apiType: state.apiType,
      apiEndpoint: state.apiEndpoint,
      apiKey: state.apiKey,
      apiModel: state.apiModel,
      apiPrompt: state.apiPrompt || DEFAULT_PROMPT,
    });

    if (!result.success) {
      dispatch({ type: 'SET_STATUS', status: 'fail', title: 'API 测试失败', subtitle: result.error || '未知错误' });
      if (result.responseJson) dispatch({ type: 'SET_FIELD', field: 'responseJson', value: result.responseJson });
      return;
    }

    if (result.responseJson) dispatch({ type: 'SET_FIELD', field: 'responseJson', value: result.responseJson });
    if (result.answerText) dispatch({ type: 'SET_FIELD', field: 'answerText', value: result.answerText });
    if (result.thinkingText) dispatch({ type: 'SET_FIELD', field: 'thinkingText', value: result.thinkingText });
    dispatch({ type: 'SET_STATUS', status: 'pass', title: 'API 测试成功', subtitle: '已填充响应内容，可继续验证。' });
  }, [state.apiType, state.apiEndpoint, state.apiKey, state.apiModel, state.apiPrompt]);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const fillDefaultPrompt = useCallback(() => {
    dispatch({ type: 'SET_FIELD', field: 'apiPrompt', value: DEFAULT_PROMPT });
  }, []);

  return { state, setField, runVerification, runApiTestAction, reset, fillDefaultPrompt };
}
