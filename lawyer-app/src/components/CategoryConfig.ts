import { CaseCategory } from '../types';

interface CategoryInfo {
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const categoryConfig: Record<CaseCategory, CategoryInfo> = {
  court: {
    label: '裁判・訴訟',
    icon: '⚖️',
    color: '#c0392b',
    description: '刑事・民事・離婚・相続・交通事故・労働問題などの裁判対応',
  },
  consultation: {
    label: '法律相談',
    icon: '💬',
    color: '#2980b9',
    description: '契約・労働・相続・日常トラブルへのアドバイス',
  },
  negotiation: {
    label: '交渉・示談',
    icon: '🤝',
    color: '#27ae60',
    description: '示談交渉・慰謝料請求・離婚協議など裁判外交渉',
  },
  documents: {
    label: '書類・契約書',
    icon: '📄',
    color: '#8e44ad',
    description: '契約書作成・チェック・利用規約・予防法務',
  },
  criminal: {
    label: '刑事弁護',
    icon: '🔒',
    color: '#d35400',
    description: '逮捕・被疑者・被告人の権利保護・弁護活動',
  },
  corporate: {
    label: '企業法務',
    icon: '🏢',
    color: '#16a085',
    description: 'M&A・知財・労働・コンプライアンス・海外取引',
  },
};
