import { Technology } from './technology.model';
import { Tag } from './tag.model';

export interface ProjectData {
  id: number;
  title: string;
  tagline: string;
  description: string;
  highlights: string | null;
  tech_stack: string;
  cover_image_url: string | null;
  live_url: string | null;
  repo_url: string | null;
  featured: boolean;
  position: number | null;
  published: boolean;
  project_start: string | null;
  project_end: string | null;
  technologies: Technology[];
  tags: Tag[];
}

export class Project {
  readonly id: number;
  readonly title: string;
  readonly tagline: string;
  readonly description: string;
  readonly highlights: string | null;
  readonly highlightList: string[];
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
  readonly timeline: string;
  readonly technologies: Technology[];
  readonly tags: Tag[];

  constructor(data: ProjectData, now: Date = new Date()) {
    this.id = data.id;
    this.title = data.title;
    this.tagline = data.tagline;
    this.description = data.description;
    this.highlights = data.highlights ?? null;
    this.highlightList = Project.parseHighlights(data.highlights);
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
    this.timeline = Project.computeTimeline(data.project_start, data.project_end);
    this.technologies = data.technologies ?? [];
    this.tags = data.tags ?? [];
  }

  // Splits the newline-separated highlights string into trimmed, non-empty lines.
  private static parseHighlights(highlights: string | null): string[] {
    if (!highlights) return [];
    return highlights
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  // Renders a compact "start – end" year range, with "Present" for ongoing work.
  private static computeTimeline(start: string | null, end: string | null): string {
    // Use UTC: the API sends date-only strings (YYYY-MM-DD) which parse as UTC
    // midnight; getFullYear() would shift to the prior year in negative-offset
    // timezones.
    const startYear = start ? new Date(start).getUTCFullYear() : null;
    const endYear = end ? new Date(end).getUTCFullYear() : null;
    if (startYear && endYear) {
      return startYear === endYear ? `${startYear}` : `${startYear} – ${endYear}`;
    }
    if (startYear) return `${startYear} – Present`;
    if (endYear) return `${endYear}`;
    return '';
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
