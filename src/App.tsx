import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StatusCard } from '@/components/StatusCard';
import { ApiTestPanel } from '@/components/ApiTestPanel';
import { EnvImportCard } from '@/components/EnvImportCard';
import { ManualInputForm } from '@/components/ManualInputForm';
import { ResultBadge } from '@/components/ResultBadge';
import { ScoreGauge } from '@/components/ScoreGauge';
import { ChecksList } from '@/components/ChecksList';
import { useVerification } from '@/hooks/use-verification';

export default function App() {
  const { state, setField, runVerification, runApiTestAction, reset, fillDefaultPrompt } = useVerification();
  const testing = state.status === 'testing';

  const handleFieldChange = (field: string, value: unknown) => {
    setField(field as Parameters<typeof setField>[0], value as never);
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1200px] mx-auto glass rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/30 overflow-hidden"
      >
        <Header />
        <StatusCard
          status={state.status}
          verdict={state.verdict}
          title={state.statusTitle}
          subtitle={state.statusSubtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-5 p-6">
          <div className="flex flex-col gap-4">
            <EnvImportCard onFieldChange={handleFieldChange} />
            <ApiTestPanel
              apiType={state.apiType}
              apiEndpoint={state.apiEndpoint}
              apiKey={state.apiKey}
              apiModel={state.apiModel}
              apiPrompt={state.apiPrompt}
              skipIdentityChecks={state.skipIdentityChecks}
              testing={testing}
              onFieldChange={handleFieldChange}
              onTest={runApiTestAction}
              onFillPrompt={fillDefaultPrompt}
            />
            <ManualInputForm
              signature={state.signature}
              signatureMin={state.signatureMin}
              responseJson={state.responseJson}
              answerText={state.answerText}
              thinkingText={state.thinkingText}
              onFieldChange={handleFieldChange}
            />
          </div>
          <div className="flex flex-col gap-4">
            <ResultBadge verdict={state.verdict} />
            <ScoreGauge score={state.score} verdict={state.verdict} />
            <ChecksList results={state.results} />
          </div>
        </div>

        <Footer onReset={reset} onVerify={runVerification} testing={testing} />
      </motion.div>
    </div>
  );
}
