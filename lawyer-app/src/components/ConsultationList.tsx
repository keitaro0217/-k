import React, { useState } from 'react';
import { ConsultationNote } from '../types';

interface Props {
  notes: ConsultationNote[];
  onAdd: (n: ConsultationNote) => void;
}

const ConsultationList: React.FC<Props> = ({ notes, onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<ConsultationNote>>({});

  const set = (k: keyof ConsultationNote, v: string) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName || !form.topic) return;
    onAdd({
      id: `con-${Date.now()}`,
      clientName: form.clientName!,
      date: form.date || new Date().toISOString().slice(0, 10),
      topic: form.topic!,
      advice: form.advice || '',
      followUp: form.followUp,
    });
    setForm({});
    setShowForm(false);
  };

  return (
    <div className="consultation-list">
      <div className="list-header">
        <h2 className="section-title">💬 法律相談メモ</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ 相談記録を追加</button>
      </div>
      <p className="category-desc">
        契約・労働・相続・日常トラブルなど、相談内容とアドバイスを記録します。
      </p>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>相談記録を追加</h3>
            <form onSubmit={handleSubmit}>
              <label>相談者名 *
                <input value={form.clientName || ''} onChange={e => set('clientName', e.target.value)} required />
              </label>
              <label>相談日
                <input type="date" value={form.date || ''} onChange={e => set('date', e.target.value)} />
              </label>
              <label>相談内容 *
                <input value={form.topic || ''} onChange={e => set('topic', e.target.value)} required />
              </label>
              <label>アドバイス内容
                <textarea value={form.advice || ''} onChange={e => set('advice', e.target.value)} rows={4} />
              </label>
              <label>フォローアップ事項
                <input value={form.followUp || ''} onChange={e => set('followUp', e.target.value)} />
              </label>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>キャンセル</button>
                <button type="submit" className="btn-primary">保存</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="consultation-grid">
        {notes.length === 0 ? (
          <div className="empty-state">相談記録がありません</div>
        ) : (
          notes.map(n => (
            <div key={n.id} className="consultation-card">
              <div className="con-header">
                <span className="con-client">{n.clientName}</span>
                <span className="con-date">{n.date}</span>
              </div>
              <div className="con-topic">{n.topic}</div>
              <div className="con-advice">
                <span className="con-label">アドバイス:</span> {n.advice}
              </div>
              {n.followUp && (
                <div className="con-followup">
                  <span className="con-label">フォロー:</span> {n.followUp}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsultationList;
