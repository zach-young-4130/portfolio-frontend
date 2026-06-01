export interface Technology {
  id: number;
  name: string;
  slug: string;
  category: string | null;
}

export interface TechnologyInput {
  name: string;
  slug: string;
  category?: string | null;
}
