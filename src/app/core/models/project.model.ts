export interface Project {
  id: number;
  title: string;
  tagline: string;
  description: string;
  tech_stack: string;
  cover_image_url: string | null;
  live_url: string | null;
  repo_url: string | null;
  featured: boolean;
  position: number | null;
  published: boolean;
}
