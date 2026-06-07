import { motion } from 'framer-motion';
import { BookTemplate, Clock } from 'lucide-react';

export default function TemplatePage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">Template Soal</h1>
        <p className="text-text-secondary mb-8">Gunakan template yang sudah tersedia.</p>

        <div className="card flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
            <Clock className="text-purple-500" size={32} />
          </div>
          <h2 className="text-xl font-heading font-semibold text-text-primary mb-2">
            Segera Hadir
          </h2>
          <p className="text-text-secondary max-w-sm">
            Fitur template sedang dalam pengembangan. Anda akan bisa menyimpan dan menggunakan
            kembali template kisi-kisi favorit Anda.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
