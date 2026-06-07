import { useState, useRef } from 'react';
import { X, Download, FileText, Upload } from 'lucide-react';
import { QuestionSettings, ExportMetadata } from '@/types';

interface ExportModalProps {
  settings: QuestionSettings;
  onExport: (metadata: ExportMetadata, includeAnswerKey: boolean, templateFile?: File) => void;
  onClose: () => void;
  isLoading: boolean;
}

export default function ExportModal({ settings, onExport, onClose, isLoading }: ExportModalProps) {
  const [meta, setMeta] = useState<ExportMetadata>({
    schoolName: '',
    subject: settings.subject,
    classLevel: settings.classLevel,
    date: new Date().toISOString().split('T')[0],
    teacherName: '',
    duration: '90 menit',
  });
  const [includeAnswerKey, setIncludeAnswerKey] = useState(false);
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof ExportMetadata, value: string) =>
    setMeta((prev) => ({ ...prev, [key]: value }));

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.docx')) {
      alert('Hanya file .docx yang didukung untuk template kop sekolah');
      return;
    }
    setTemplateFile(file);
  };

  const handleSubmit = () => {
    // Jika tidak ada template, nama sekolah wajib diisi
    if (!templateFile && !meta.schoolName.trim()) {
      alert('Nama sekolah harus diisi (atau upload template kop sekolah)');
      return;
    }
    onExport(meta, includeAnswerKey, templateFile || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-surface">
          <h3 className="font-heading font-bold text-text-primary text-lg">Download Soal DOCX</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-background text-text-secondary">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Template Kop Sekolah */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Template Kop Sekolah <span className="text-xs text-text-secondary">(opsional)</span>
            </label>

            {templateFile ? (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="text-green-600" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-700 truncate">{templateFile.name}</p>
                  <p className="text-xs text-green-600">Kop sekolah akan digunakan sebagai header</p>
                </div>
                <button
                  onClick={() => { setTemplateFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="p-1 rounded-lg hover:bg-green-200 text-green-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border hover:border-primary hover:bg-blue-50/30
                           rounded-xl p-4 flex items-center gap-3 transition-all text-left"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Upload className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Upload kop sekolah (.docx)</p>
                  <p className="text-xs text-text-secondary">Soal akan disisipkan di bawah kop sekolah</p>
                </div>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".docx"
              className="hidden"
              onChange={handleTemplateUpload}
            />

            {!templateFile && (
              <p className="text-xs text-text-secondary mt-2 px-1">
                💡 Tidak upload kop? Header akan dibuat otomatis dari data di bawah ini.
              </p>
            )}
          </div>

          <div className="border-t border-border" />

          {/* Form metadata — selalu tampil tapi jadi opsional jika ada template */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Nama Sekolah {!templateFile && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={meta.schoolName}
              onChange={(e) => update('schoolName', e.target.value)}
              className="input-base"
              placeholder={templateFile ? 'Opsional jika sudah ada di kop' : 'SMA Negeri 1 Jakarta'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Nama Guru</label>
            <input
              type="text"
              value={meta.teacherName || ''}
              onChange={(e) => update('teacherName', e.target.value)}
              className="input-base"
              placeholder="Opsional"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Tanggal</label>
              <input
                type="date"
                value={meta.date}
                onChange={(e) => update('date', e.target.value)}
                className="input-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Durasi</label>
              <input
                type="text"
                value={meta.duration || ''}
                onChange={(e) => update('duration', e.target.value)}
                className="input-base"
                placeholder="90 menit"
              />
            </div>
          </div>

          {/* Include Answer Key */}
          <label className="flex items-center gap-3 p-4 bg-background rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={includeAnswerKey}
              onChange={(e) => setIncludeAnswerKey(e.target.checked)}
              className="w-5 h-5 accent-primary"
            />
            <div>
              <p className="font-medium text-text-primary text-sm">Sertakan Kunci Jawaban</p>
              <p className="text-xs text-text-secondary">Jawaban ditampilkan di bawah setiap soal</p>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border flex gap-3 sticky bottom-0 bg-surface">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-border text-text-secondary hover:bg-background">
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Download size={18} /> Download</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
