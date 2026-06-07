import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    q: 'Format file apa yang bisa diupload?',
    a: 'Anda bisa mengupload file PDF (.pdf) atau Word (.docx). Ukuran maksimal file adalah 10MB.',
  },
  {
    q: 'Berapa lama proses generate soal?',
    a: 'Biasanya membutuhkan 15-45 detik tergantung jumlah soal dan panjang kisi-kisi yang Anda berikan.',
  },
  {
    q: 'Apakah soal yang dihasilkan bisa diedit?',
    a: 'Ya! Setelah soal di-generate, Anda bisa mengedit teks soal, jawaban, dan bahkan menghapus atau meng-generate ulang soal tertentu.',
  },
  {
    q: 'Dalam format apa soal bisa didownload?',
    a: 'Soal bisa didownload dalam format Microsoft Word (.docx) yang siap dicetak.',
  },
  {
    q: 'Apakah data kisi-kisi saya disimpan?',
    a: 'Tidak. Semua data hanya diproses sementara di memory server dan langsung dihapus setelah selesai. Kami tidak menyimpan data Anda.',
  },
  {
    q: 'Berapa jumlah soal maksimal yang bisa digenerate?',
    a: 'Anda bisa membuat hingga 50 soal pilihan ganda, 20 essay, dan 30 benar/salah dalam satu sesi.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card mb-3 cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex items-center justify-between">
        <span className="font-heading font-semibold text-text-primary">{q}</span>
        <ChevronDown
          size={18}
          className={`text-text-secondary transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </div>
      {open && <p className="mt-3 text-text-secondary text-sm leading-relaxed">{a}</p>}
    </div>
  );
}

export default function BantuanPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">Bantuan</h1>
        <p className="text-text-secondary mb-8">Pertanyaan yang sering ditanyakan.</p>

        {faqs.map((faq, idx) => (
          <FaqItem key={idx} {...faq} />
        ))}
      </motion.div>
    </div>
  );
}
