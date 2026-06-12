import React, { useState } from 'react';
import { Case, CaseCategory, CaseStatus } from '../types';
import { categoryConfig } from './CategoryConfig';

interface Props {
  initial: Case | null;
  defaultCategory?: CaseCategory;
  onSave: (c: Case) => void;
  onCancel: () => void;
}

const CaseForm: React.FC<Props> = ({ initial, defaultCategory, onSave, onCancel }) => {
  const [form, setForm] = useState<Case>(
    initial || {
      id: `case-${Date.now()}`,
      title: '',
      clientId: '',
      clientName: '',
      category: defaultCategory || 'consultation',
      status: '新規',
      description: '',
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      nextAction: '',
      nextActionDate: '',
    }
  );

  const set = (key: keyof Case, value: string) =>
    setForm(f => ({ ...f, [key]: value, updatedAt: new Date().toISOString().slice(0, 10) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.clientName) return;
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{initial ? '案件を編集' : '新規案件登録'}</h3>
        <form onSubmit={handleSubmit}>
          <label>案件名 *
            <input value={form.title} onChange={e => set('title', e.target.value)} required />
          </label>
          <label>依頼者名 *
            <input value={form.clientName} onChange={e => set('clientName', e.target.value)} required />
          </label>
          <label>業務カテゴリ
            <select value={form.category} onChange={e => set('category', e.target.value)}>
              {(Object.keys(categoryConfig) as CaseCategory[]).map(k => (
                <option key={k} value={k}>
                  {categoryConfig[k].icon} {categoryConfig[k].label}
                </option>
              ))}
            </select>
          </label>
          <label>ステータス
            <select value={form.status} onChange={e => set('status', e.target.value)}>
              {(['新規', '進行中', '保留中', '完了'] as CaseStatus[]).map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>案件概要
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
            />
          </label>
          <label>次のアクション
            <input value={form.nextAction || ''} onChange={e => set('nextAction', e.target.value)} />
          </label>
          <label>対応予定日
            <input
              type="date"
              value={form.nextActionDate || ''}
              onChange={e => set('nextActionDate', e.target.value)}
            />
          </label>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>キャンセル</button>
            <button type="submit" className="btn-primary">保存</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaseForm;
