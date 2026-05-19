export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  email: string;
  name: string | null;
  avatar_url: string | null;
  role: UserRole;
}
