export type CaseStatus = '新規' | '進行中' | '保留中' | '完了';

export type CaseCategory =
  | 'court'
  | 'consultation'
  | 'negotiation'
  | 'documents'
  | 'criminal'
  | 'corporate';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface Case {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  category: CaseCategory;
  status: CaseStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
  nextAction?: string;
  nextActionDate?: string;
}

export interface ConsultationNote {
  id: string;
  clientName: string;
  date: string;
  topic: string;
  advice: string;
  followUp?: string;
}
