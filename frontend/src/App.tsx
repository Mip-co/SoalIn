import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FileText, BookTemplate, HelpCircle, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import DashboardPage from '@/pages/DashboardPage';
import GeneratePage from '@/pages/GeneratePage';
import TemplatePage from '@/pages/TemplatePage';
import BantuanPage from '@/pages/BantuanPage';

type ActivePage = 'dashboard' | 'generate' | 'template' | 'bantuan';

const menuItems = [
  { id: 'dashboard' as ActivePage, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'generate' as ActivePage, label: 'Generate Soal', icon: FileText },
  { id: 'template' as ActivePage, label: 'Template', icon: BookTemplate },
  { id: 'bantuan' as ActivePage, label: 'Bantuan', icon: HelpCircle },
];

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  const pageComponents: Record<ActivePage, React.ReactNode> = {
    dashboard: <DashboardPage onNavigate={setActivePage} />,
    generate: <GeneratePage />,
    template: <TemplatePage />,
    bantuan: <BantuanPage />,
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="text-white" size={22} />
            </div>
            <div>
              <p className="font-heading font-bold text-text-primary text-sm">Pembuat Soal</p>
              <p className="text-xs text-text-secondary">untuk Guru</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={cn(
                  'sidebar-item w-full text-left',
                  activePage === item.id && 'sidebar-item-active'
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-text-secondary text-center">
            Dibuat dengan ❤️ untuk guru Indonesia
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {pageComponents[activePage]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
