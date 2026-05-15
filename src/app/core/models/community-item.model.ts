export interface CommunityItem {
  id: number;
  title: string;
  description: string;
  url: string | null;
  role: string | null;
  year: string | null;
  position: number | null;
  published: boolean;
}
