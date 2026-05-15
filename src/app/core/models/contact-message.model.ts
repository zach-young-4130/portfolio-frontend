export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  read_at: string | null;
  created_at: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  message: string;
}
