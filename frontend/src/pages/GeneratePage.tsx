import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Settings, Sparkles, Eye } from 'lucide-react';
import UploadStep from '@/components/steps/UploadStep';
import SettingsStep from '@/components/steps/SettingsStep';
import GenerateStep from '@/components/steps/GenerateStep';
import PreviewStep from '@/components/steps/PreviewStep';
import { Question, QuestionSettings } from '@/types';

type Step = 'upload' | 'settings' | 'generate' | 'preview';

const STEPS = [
  { id: 'upload', label: 'Kisi-Kisi', icon: Upload },
  { id: 'settings', label: 'Pengaturan', icon: Settings },
  { id: 'generate', label: 'Generate', icon: Sparkles },
  { id: 'preview', label: 'Preview', icon: Eye },
];

const DEFAULT_SETTINGS: QuestionSettings = {
  pgCount: 5,
  essayCount: 3,
  tfCount: 2,
  classLevel: 'SMA Kelas 10',
  difficulty: 'Sedang',
  subject: '',
};

export default function GeneratePage() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [kisiKisi, setKisiKisi] = useState('');
  const [settings, setSettings] = useState<QuestionSettings>(DEFAULT_SETTINGS);
  const [questions, setQuestions] = useState<Question[]>([]);

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const goNext = () => {
    const steps: Step[] = ['upload', 'settings', 'generate', 'preview'];
    const idx = steps.indexOf(currentStep);
    if (idx < steps.length - 1) setCurrentStep(steps[idx + 1]);
  };

  const goBack = () => {
    const steps: Step[] = ['upload', 'settings', 'generate', 'preview'];
    const idx = steps.indexOf(currentStep);
    if (idx > 0) setCurrentStep(steps[idx - 1]);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-text-primary mb-1">
          Generate Soal
        </h1>
        <p className="text-text-secondary">Ikuti langkah-langkah berikut untuk membuat soal.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isDone = idx < stepIndex;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${isActive ? 'bg-primary text-white' : isDone ? 'bg-green-500 text-white' : 'bg-border text-text-secondary'}`}
                >
                  <Icon size={18} />
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 mt-[-1rem] transition-all ${idx < stepIndex ? 'bg-green-500' : 'bg-border'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === 'upload' && (
            <UploadStep
              kisiKisi={kisiKisi}
              onChange={setKisiKisi}
              onNext={goNext}
            />
          )}
          {currentStep === 'settings' && (
            <SettingsStep
              settings={settings}
              onChange={setSettings}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {currentStep === 'generate' && (
            <GenerateStep
              kisiKisi={kisiKisi}
              settings={settings}
              onDone={(qs) => { setQuestions(qs); goNext(); }}
              onBack={goBack}
            />
          )}
          {currentStep === 'preview' && (
            <PreviewStep
              questions={questions}
              setQuestions={setQuestions}
              kisiKisi={kisiKisi}
              settings={settings}
              onBack={goBack}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
