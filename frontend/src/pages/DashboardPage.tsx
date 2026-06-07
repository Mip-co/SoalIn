import { motion } from 'framer-motion';
import { FileText, Zap, Download, ArrowRight } from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (page: 'dashboard' | 'generate' | 'template' | 'bantuan') => void;
}

const steps = [
  {
    icon: FileText,
    title: 'Upload atau Ketik Kisi-Kisi',
    desc: 'Upload file PDF/DOCX atau ketik langsung kisi-kisi pelajaran',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Zap,
    title: 'Atur & Generate Soal',
    desc: 'Pilih jenis soal, jumlah, kelas, dan tingkat kesulitan',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Download,
    title: 'Download Soal DOCX',
    desc: 'Preview, edit, lalu download soal siap pakai dalam format Word',
    color: 'bg-pink-100 text-pink-600',
  },
];

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
          Selamat Datang 👋
        </h1>
        <p className="text-text-secondary text-lg">
          Buat soal ujian berkualitas dalam hitungan menit dengan bantuan AI.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card bg-primary text-white mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-heading font-bold mb-1">Mulai Buat Soal Sekarang</h2>
            <p className="text-white text-opacity-80 text-sm">
              Upload kisi-kisi dan biarkan AI yang bekerja untuk Anda
            </p>
          </div>
          <button
            onClick={() => onNavigate('generate')}
            className="flex items-center gap-2 bg-white text-primary font-heading font-semibold
                       px-6 py-3 rounded-2xl hover:bg-opacity-90 transition-all whitespace-nowrap"
          >
            Mulai <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>

      {/* Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-heading font-bold text-text-primary mb-4">
          Cara Penggunaan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="card">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${step.color}`}>
                  <Icon size={24} />
                </div>
                <div className="text-xs font-semibold text-text-secondary mb-1">
                  LANGKAH {idx + 1}
                </div>
                <h3 className="font-heading font-semibold text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
