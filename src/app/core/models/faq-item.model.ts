export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  position: number | null;
  published: boolean;
}
