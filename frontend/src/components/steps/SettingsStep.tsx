import { ArrowLeft, ArrowRight } from 'lucide-react';
import { QuestionSettings, DifficultyLevel } from '@/types';

interface SettingsStepProps {
  settings: QuestionSettings;
  onChange: (s: QuestionSettings) => void;
  onNext: () => void;
  onBack: () => void;
}

const CLASS_LEVELS = [
  'SD Kelas 1', 'SD Kelas 2', 'SD Kelas 3', 'SD Kelas 4', 'SD Kelas 5', 'SD Kelas 6',
  'SMP Kelas 7', 'SMP Kelas 8', 'SMP Kelas 9',
  'SMA Kelas 10', 'SMA Kelas 11', 'SMA Kelas 12',
  'SMK Kelas 10', 'SMK Kelas 11', 'SMK Kelas 12',
];

const DIFFICULTIES: DifficultyLevel[] = ['Mudah', 'Sedang', 'Sulit'];

function CounterInput({
  label,
  value,
  onChange,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max: number;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-background rounded-xl">
      <span className="font-medium text-text-primary">{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-9 h-9 rounded-xl bg-border text-text-primary font-bold hover:bg-primary hover:text-white transition-all"
        >
          −
        </button>
        <span className="w-8 text-center font-heading font-bold text-text-primary text-lg">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-9 h-9 rounded-xl bg-border text-text-primary font-bold hover:bg-primary hover:text-white transition-all"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function SettingsStep({ settings, onChange, onNext, onBack }: SettingsStepProps) {
  const totalQuestions = settings.pgCount + settings.essayCount + settings.tfCount;
  const canContinue = totalQuestions > 0 && settings.subject.trim().length > 0;

  const update = (key: keyof QuestionSettings, value: any) =>
    onChange({ ...settings, [key]: value });

  return (
    <div className="card">
      <h2 className="text-xl font-heading font-bold text-text-primary mb-2">
        Pengaturan Soal
      </h2>
      <p className="text-text-secondary mb-6">
        Sesuaikan jenis dan jumlah soal yang ingin digenerate.
      </p>

      {/* Subject */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Mata Pelajaran <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={settings.subject}
          onChange={(e) => update('subject', e.target.value)}
          className="input-base"
          placeholder="Contoh: Biologi, Matematika, Sejarah..."
        />
      </div>

      {/* Class Level */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-text-secondary mb-2">Kelas</label>
        <select
          value={settings.classLevel}
          onChange={(e) => update('classLevel', e.target.value)}
          className="input-base"
        >
          {CLASS_LEVELS.map((cl) => (
            <option key={cl} value={cl}>{cl}</option>
          ))}
        </select>
      </div>

      {/* Difficulty */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Tingkat Kesulitan
        </label>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => update('difficulty', d)}
              className={`flex-1 py-3 rounded-xl font-heading font-semibold text-sm transition-all
                ${settings.difficulty === d
                  ? 'bg-primary text-white'
                  : 'bg-background text-text-secondary hover:border-primary border border-border'
                }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Question Counts */}
      <div className="mb-2">
        <label className="block text-sm font-medium text-text-secondary mb-3">
          Jumlah Soal
        </label>
        <div className="space-y-3">
          <CounterInput
            label="🔤 Pilihan Ganda"
            value={settings.pgCount}
            onChange={(v) => update('pgCount', v)}
            max={50}
          />
          <CounterInput
            label="✍️ Essay"
            value={settings.essayCount}
            onChange={(v) => update('essayCount', v)}
            max={20}
          />
          <CounterInput
            label="✅ Benar / Salah"
            value={settings.tfCount}
            onChange={(v) => update('tfCount', v)}
            max={30}
          />
        </div>
      </div>

      {/* Total */}
      <div className="mt-4 p-3 bg-blue-50 rounded-xl text-center">
        <span className="text-primary font-heading font-bold">Total: {totalQuestions} soal</span>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-border text-text-secondary hover:bg-background transition-all">
          <ArrowLeft size={18} /> Kembali
        </button>
        <button onClick={onNext} disabled={!canContinue} className="btn-primary flex-1 flex items-center justify-center gap-2">
          Generate Soal <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
