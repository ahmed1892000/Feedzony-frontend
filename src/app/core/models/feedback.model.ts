export interface Feedback {
  id: number;
  businessName: string;
  customerName: string;
  email: string;
  rating: number;
  category: string;
  comment: string;
  createdAt: string;
}

export type NewFeedback = Omit<Feedback, 'id' | 'createdAt'>;
