import type { Case } from '../types';
import { categoryConfig } from './categoryConfig';

interface Props {
  cases: Case[];
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ cases, onNavigate }: Props) {
  const statusCounts = {
    新規: cases.filter((c) => c.status === '新規').length,
    進行中: cases.filter((c) => c.status === '進行中').length,
    保留中: cases.filter((c) => c.status === '保留中').length,
    完了: cases.filter((c) => c.status === '完了').length,
  };

  const urgentCases = cases
    .filter((c) => c.nextActionDate && c.status !== '完了')
    .sort((a, b) => (a.nextActionDate! > b.nextActionDate! ? 1 : -1))
    .slice(0, 5);

  return (
    <div>
      <h2 className="section-title">ダッシュボード</h2>

      <div className="stats-grid">
        {(Object.entries(statusCounts) as [string, number][]).map(([status, count]) => (
          <div key={status} className={`stat-card stat-${status}`}>
            <div className="stat-number">{count}</div>
            <div className="stat-label">{status}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-row">
        <div className="dashboard-section">
          <h3>業務カテゴリ別件数</h3>
          <div className="category-grid">
            {(Object.entries(categoryConfig) as [string, typeof categoryConfig[keyof typeof categoryConfig]][]).map(
              ([key, cfg]) => (
                <div
                  key={key}
                  className="category-card"
                  style={{ borderLeftColor: cfg.color }}
                  onClick={() => onNavigate(key)}
                >
                  <span className="cat-icon">{cfg.icon}</span>
                  <div className="cat-info">
                    <div className="cat-label">{cfg.label}</div>
                    <div className="cat-count">
                      {cases.filter((c) => c.category === key).length}件
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h3>直近の対応予定</h3>
          {urgentCases.length === 0 ? (
            <p className="empty-msg">予定はありません</p>
          ) : (
            <ul className="urgent-list">
              {urgentCases.map((c) => (
                <li key={c.id} className="urgent-item">
                  <div className="urgent-date">{c.nextActionDate}</div>
                  <div className="urgent-title">{c.title}</div>
                  <div className="urgent-action">{c.nextAction}</div>
                  <span
                    className="status-badge"
                    style={{ background: categoryConfig[c.category].color }}
                  >
                    {categoryConfig[c.category].label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
