export interface ProjectData {
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
  project_start: string | null;
  project_end: string | null;
}

export class Project {
  readonly id: number;
  readonly title: string;
  readonly tagline: string;
  readonly description: string;
  readonly tech_stack: string;
  readonly cover_image_url: string | null;
  readonly live_url: string | null;
  readonly repo_url: string | null;
  readonly featured: boolean;
  readonly position: number | null;
  readonly published: boolean;
  readonly project_start: string | null;
  readonly project_end: string | null;
  readonly time_ago: string;

  constructor(data: ProjectData, now: Date = new Date()) {
    this.id = data.id;
    this.title = data.title;
    this.tagline = data.tagline;
    this.description = data.description;
    this.tech_stack = data.tech_stack;
    this.cover_image_url = data.cover_image_url;
    this.live_url = data.live_url;
    this.repo_url = data.repo_url;
    this.featured = data.featured;
    this.position = data.position;
    this.published = data.published;
    this.project_start = data.project_start;
    this.project_end = data.project_end;
    this.time_ago = Project.computeTimeAgo(now, data.project_end);
  }

  private static computeTimeAgo(now: Date, project_end: string | null): string {
    if (!project_end) return '';

    const days = Math.floor((now.getTime() - new Date(project_end).getTime()) / 86_400_000);

    if (days < 1) return 'today';
    if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;

    const months = Math.floor(days / 30.44);
    if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;

    const years = Math.floor(days / 365.25);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }
}
