import React, { useState } from 'react';
import { Case, CaseCategory, CaseStatus } from '../types';
import { categoryConfig } from './CategoryConfig';
import CaseForm from './CaseForm';

interface Props {
  cases: Case[];
  filterCategory?: CaseCategory;
  onAdd: (c: Case) => void;
  onUpdate: (c: Case) => void;
}

const CaseList: React.FC<Props> = ({ cases, filterCategory, onAdd, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editCase, setEditCase] = useState<Case | null>(null);
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'すべて'>('すべて');
  const [search, setSearch] = useState('');

  const filtered = cases
    .filter(c => !filterCategory || c.category === filterCategory)
    .filter(c => statusFilter === 'すべて' || c.status === statusFilter)
    .filter(c =>
      search === '' ||
      c.title.includes(search) ||
      c.clientName.includes(search) ||
      c.description.includes(search)
    );

  const handleEdit = (c: Case) => {
    setEditCase(c);
    setShowForm(true);
  };

  const handleSave = (c: Case) => {
    if (editCase) {
      onUpdate(c);
    } else {
      onAdd(c);
    }
    setShowForm(false);
    setEditCase(null);
  };

  const title = filterCategory
    ? `${categoryConfig[filterCategory].icon} ${categoryConfig[filterCategory].label}`
    : 'すべての案件';

  return (
    <div className="case-list">
      <div className="list-header">
        <h2 className="section-title">{title}</h2>
        <button className="btn-primary" onClick={() => { setEditCase(null); setShowForm(true); }}>
          + 新規案件登録
        </button>
      </div>

      {filterCategory && (
        <p className="category-desc">{categoryConfig[filterCategory].description}</p>
      )}

      <div className="filter-row">
        <input
          className="search-input"
          placeholder="案件名・依頼者名で検索..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="status-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as CaseStatus | 'すべて')}
        >
          {['すべて', '新規', '進行中', '保留中', '完了'].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">案件がありません</div>
      ) : (
        <div className="cases-grid">
          {filtered.map(c => (
            <div key={c.id} className="case-card" onClick={() => handleEdit(c)}>
              <div className="case-card-header">
                <span
                  className="case-category-dot"
                  style={{ background: categoryConfig[c.category].color }}
                  title={categoryConfig[c.category].label}
                >
                  {categoryConfig[c.category].icon}
                </span>
                <span className={`case-status status-${c.status}`}>{c.status}</span>
              </div>
              <div className="case-title">{c.title}</div>
              <div className="case-client">依頼者: {c.clientName}</div>
              <div className="case-desc">{c.description}</div>
              {c.nextAction && (
                <div className="case-next">
                  <span className="next-label">次のアクション:</span> {c.nextAction}
                  {c.nextActionDate && <span className="next-date"> ({c.nextActionDate})</span>}
                </div>
              )}
              <div className="case-updated">更新: {c.updatedAt}</div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <CaseForm
          initial={editCase}
          defaultCategory={filterCategory}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditCase(null); }}
        />
      )}
    </div>
  );
};

export default CaseList;
