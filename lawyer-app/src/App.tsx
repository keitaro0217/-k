import { useState } from 'react';
import type { Case, CaseCategory, ConsultationNote } from './types';
import { categoryConfig } from './components/categoryConfig';
import { initialCases, initialConsultations } from './data/initialData';
import Dashboard from './components/Dashboard';
import CaseList from './components/CaseList';
import ConsultationList from './components/ConsultationList';
import './app.css';

type Tab = 'dashboard' | 'all-cases' | CaseCategory;

const NAV: { id: Tab; icon: string; label: string }[] = [
  { id: 'dashboard', icon: '🏠', label: 'ダッシュボード' },
  { id: 'all-cases', icon: '📋', label: 'すべての案件' },
  { id: 'court', icon: '⚖️', label: '裁判・訴訟' },
  { id: 'consultation', icon: '💬', label: '法律相談' },
  { id: 'negotiation', icon: '🤝', label: '交渉・示談' },
  { id: 'documents', icon: '📄', label: '書類・契約書' },
  { id: 'criminal', icon: '🔒', label: '刑事弁護' },
  { id: 'corporate', icon: '🏢', label: '企業法務' },
];

const CATEGORY_KEYS = new Set<string>([
  'court', 'consultation', 'negotiation', 'documents', 'criminal', 'corporate',
]);

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [consultations, setConsultations] = useState<ConsultationNote[]>(initialConsultations);
  const [open, setOpen] = useState(true);

  const addCase = (c: Case) => setCases((prev) => [c, ...prev]);
  const updateCase = (c: Case) => setCases((prev) => prev.map((p) => (p.id === c.id ? c : p)));
  const addConsultation = (n: ConsultationNote) => setConsultations((prev) => [n, ...prev]);

  const renderContent = () => {
    if (tab === 'dashboard') return <Dashboard cases={cases} onNavigate={(t) => setTab(t as Tab)} />;
    if (tab === 'consultation') return <ConsultationList notes={consultations} onAdd={addConsultation} />;
    if (tab === 'all-cases') return <CaseList cases={cases} onAdd={addCase} onUpdate={updateCase} />;
    return (
      <CaseList
        cases={cases}
        filterCategory={tab as CaseCategory}
        onAdd={addCase}
        onUpdate={updateCase}
      />
    );
  };

  const current = NAV.find((n) => n.id === tab);

  return (
    <div className={`app ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">⚖️</span>
          {open && <span className="logo-text">法律事務所管理</span>}
        </div>
        <button className="sidebar-toggle" onClick={() => setOpen((v) => !v)}>
          {open ? '◀' : '▶'}
        </button>
        <nav className="sidebar-nav">
          {NAV.map((item) => {
            const isCat = CATEGORY_KEYS.has(item.id);
            const badge = isCat
              ? cases.filter((c) => c.category === item.id && c.status !== '完了').length
              : 0;
            const color = isCat ? categoryConfig[item.id as CaseCategory].color : undefined;
            return (
              <button
                key={item.id}
                className={`nav-item ${tab === item.id ? 'active' : ''}`}
                style={tab === item.id && color ? { borderLeftColor: color } : undefined}
                onClick={() => setTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {open && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {badge > 0 && <span className="nav-badge">{badge}</span>}
                  </>
                )}
              </button>
            );
          })}
        </nav>
        {open && (
          <div className="sidebar-footer">
            <div>総案件数: {cases.length}件</div>
            <div>進行中: {cases.filter((c) => c.status === '進行中').length}件</div>
          </div>
        )}
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-title">
            {current?.icon} {current?.label}
          </div>
          <div className="top-bar-date">
            {new Date().toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>
        <div className="content-area">{renderContent()}</div>
      </main>
    </div>
  );
}
