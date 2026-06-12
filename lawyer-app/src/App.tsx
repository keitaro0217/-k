import React, { useState } from 'react';
import './App.css';
import { Case, CaseCategory, ConsultationNote } from './types';
import { initialCases, initialConsultations } from './data/initialData';
import { categoryConfig } from './components/CategoryConfig';
import Dashboard from './components/Dashboard';
import CaseList from './components/CaseList';
import ConsultationList from './components/ConsultationList';

type Tab = 'dashboard' | CaseCategory | 'all-cases';

const navItems: { id: Tab; icon: string; label: string }[] = [
  { id: 'dashboard', icon: '🏠', label: 'ダッシュボード' },
  { id: 'all-cases', icon: '📋', label: 'すべての案件' },
  { id: 'court', icon: '⚖️', label: '裁判・訴訟' },
  { id: 'consultation', icon: '💬', label: '法律相談' },
  { id: 'negotiation', icon: '🤝', label: '交渉・示談' },
  { id: 'documents', icon: '📄', label: '書類・契約書' },
  { id: 'criminal', icon: '🔒', label: '刑事弁護' },
  { id: 'corporate', icon: '🏢', label: '企業法務' },
];

const App: React.FC = () => {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [consultations, setConsultations] = useState<ConsultationNote[]>(initialConsultations);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const addCase = (c: Case) => setCases(prev => [c, ...prev]);
  const updateCase = (c: Case) => setCases(prev => prev.map(p => (p.id === c.id ? c : p)));
  const addConsultation = (n: ConsultationNote) => setConsultations(prev => [n, ...prev]);

  const renderContent = () => {
    if (tab === 'dashboard') {
      return <Dashboard cases={cases} onNavigate={t => setTab(t as Tab)} />;
    }
    if (tab === 'consultation') {
      return <ConsultationList notes={consultations} onAdd={addConsultation} />;
    }
    if (tab === 'all-cases') {
      return <CaseList cases={cases} onAdd={addCase} onUpdate={updateCase} />;
    }
    return (
      <CaseList
        cases={cases}
        filterCategory={tab as CaseCategory}
        onAdd={addCase}
        onUpdate={updateCase}
      />
    );
  };

  return (
    <div className={`app ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">⚖️</span>
          {sidebarOpen && <span className="logo-text">法律事務所管理</span>}
        </div>
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
          {sidebarOpen ? '◀' : '▶'}
        </button>
        <nav className="sidebar-nav">
          {navItems.map(item => {
            const isCategory = !['dashboard', 'all-cases'].includes(item.id);
            const count = isCategory
              ? cases.filter(c => c.category === item.id && c.status !== '完了').length
              : null;
            return (
              <button
                key={item.id}
                className={`nav-item ${tab === item.id ? 'active' : ''}`}
                onClick={() => setTab(item.id)}
                style={
                  isCategory && tab === item.id
                    ? { borderLeftColor: categoryConfig[item.id as CaseCategory].color }
                    : undefined
                }
              >
                <span className="nav-icon">{item.icon}</span>
                {sidebarOpen && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {count !== null && count > 0 && (
                      <span className="nav-badge">{count}</span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
        {sidebarOpen && (
          <div className="sidebar-footer">
            <div className="total-cases">総案件数: {cases.length}件</div>
            <div className="active-cases">
              進行中: {cases.filter(c => c.status === '進行中').length}件
            </div>
          </div>
        )}
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="top-bar-title">
            {navItems.find(n => n.id === tab)?.icon}{' '}
            {navItems.find(n => n.id === tab)?.label}
          </div>
          <div className="top-bar-date">
            {new Date().toLocaleDateString('ja-JP', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </div>
        </header>
        <div className="content-area">{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;
