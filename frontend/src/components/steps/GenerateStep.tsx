import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { generateQuestions } from '@/services/api';
import { Question, QuestionSettings } from '@/types';

interface GenerateStepProps {
  kisiKisi: string;
  settings: QuestionSettings;
  onDone: (questions: Question[]) => void;
  onBack: () => void;
}

export default function GenerateStep({ kisiKisi, settings, onDone, onBack }: GenerateStepProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const doGenerate = async () => {
    setStatus('loading');
    setError('');
    setProgress(0);

    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 90));
    }, 500);

    try {
      const questions = await generateQuestions(kisiKisi, settings);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => onDone(questions), 400);
    } catch (err: any) {
      clearInterval(interval);
      setStatus('error');
      setError(err.response?.data?.error || 'Gagal generate soal. Periksa koneksi dan coba lagi.');
    }
  };

  useEffect(() => {
    doGenerate();
  }, []);

  const totalSoal = settings.pgCount + settings.essayCount + settings.tfCount;

  return (
    <div className="card text-center py-12">
      {status !== 'error' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-primary bg-opacity-10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="text-primary" size={36} />
            </motion.div>
          </div>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-2">
            Sedang Membuat Soal...
          </h2>
          <p className="text-text-secondary mb-8">
            AI sedang menyiapkan {totalSoal} soal untuk {settings.subject} — {settings.classLevel}.<br />
            Mohon tunggu, ini biasanya 15–45 detik.
          </p>

          {/* Progress bar */}
          <div className="w-full max-w-xs mx-auto bg-border rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-text-secondary mt-2">{progress}%</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-red-500" size={36} />
          </div>
          <h2 className="text-xl font-heading font-bold text-text-primary mb-2">
            Gagal Generate Soal
          </h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-border text-text-secondary hover:bg-background transition-all"
            >
              <ArrowLeft size={18} /> Kembali
            </button>
            <button onClick={doGenerate} className="btn-primary flex items-center gap-2">
              <Sparkles size={18} /> Coba Lagi
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
