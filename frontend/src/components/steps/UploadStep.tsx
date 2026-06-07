import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadFile } from '@/services/api';

interface UploadStepProps {
  kisiKisi: string;
  onChange: (text: string) => void;
  onNext: () => void;
}

export default function UploadStep({ kisiKisi, onChange, onNext }: UploadStepProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'upload' | 'manual'>('upload');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setError('');
    setUploadedFile(file);

    try {
      const result = await uploadFile(file);
      onChange(result.extractedText);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal membaca file. Coba lagi.');
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const canContinue = kisiKisi.trim().length >= 10;

  return (
    <div className="card">
      <h2 className="text-xl font-heading font-bold text-text-primary mb-2">
        Masukkan Kisi-Kisi
      </h2>
      <p className="text-text-secondary mb-6">
        Upload file PDF/DOCX atau ketik langsung kisi-kisi pelajaran Anda.
      </p>

      {/* Mode Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('upload')}
          className={`flex-1 py-3 rounded-xl font-heading font-semibold text-sm transition-all
            ${mode === 'upload' ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:bg-border'}`}
        >
          📎 Upload File
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`flex-1 py-3 rounded-xl font-heading font-semibold text-sm transition-all
            ${mode === 'manual' ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:bg-border'}`}
        >
          ✏️ Ketik Manual
        </button>
      </div>

      {mode === 'upload' ? (
        <div>
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
              ${isDragActive ? 'border-primary bg-blue-50' : 'border-border hover:border-primary hover:bg-blue-50/30'}`}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <div>
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-text-secondary">Membaca file...</p>
              </div>
            ) : uploadedFile ? (
              <div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FileText className="text-green-600" size={28} />
                </div>
                <p className="font-semibold text-text-primary">{uploadedFile.name}</p>
                <p className="text-sm text-green-600 mt-1">✅ Berhasil dibaca</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setUploadedFile(null); onChange(''); }}
                  className="mt-3 text-xs text-text-secondary hover:text-red-500 flex items-center gap-1 mx-auto"
                >
                  <X size={12} /> Hapus
                </button>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Upload className="text-primary" size={28} />
                </div>
                <p className="font-heading font-semibold text-text-primary mb-1">
                  Seret file ke sini atau klik untuk memilih
                </p>
                <p className="text-sm text-text-secondary">PDF atau DOCX, maks 10MB</p>
              </div>
            )}
          </div>

          {/* Preview extracted text */}
          {kisiKisi && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Teks yang berhasil dibaca:
              </label>
              <textarea
                value={kisiKisi}
                onChange={(e) => onChange(e.target.value)}
                rows={6}
                className="input-base resize-none text-sm"
                placeholder="Teks kisi-kisi akan muncul di sini..."
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Ketik atau tempel kisi-kisi di bawah ini:
          </label>
          <textarea
            value={kisiKisi}
            onChange={(e) => onChange(e.target.value)}
            rows={10}
            className="input-base resize-none"
            placeholder="Contoh:&#10;Kompetensi Dasar: Memahami konsep fotosintesis pada tumbuhan&#10;Materi: Proses fotosintesis, organel yang terlibat, faktor yang mempengaruhi&#10;Indikator: Siswa dapat menjelaskan tahapan reaksi terang dan reaksi gelap..."
          />
          <p className="text-xs text-text-secondary mt-1">{kisiKisi.length} karakter</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm"
        >
          <AlertCircle size={16} />
          {error}
        </motion.div>
      )}

      {/* Next Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="btn-primary flex items-center gap-2"
        >
          Lanjut <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
