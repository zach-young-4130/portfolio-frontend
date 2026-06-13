import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';
import { TechnologiesService } from '../../core/services/technologies.service';
import { ProjectsService } from '../../core/services/projects.service';
import { SeoService } from '../../core/services/seo.service';
import { Technology } from '../../core/models/technology.model';
import { Project } from '../../core/models/project.model';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero';
import { TechBadgeComponent } from '../../shared/components/tech-badge/tech-badge';

interface TechWithProjects {
  tech: Technology;
  projects: { id: number; title: string }[];
}

interface CategoryGroup {
  key: string;
  label: string;
  technologies: TechWithProjects[];
}

// Display order + plural labels for the technology categories. The `key` also
// drives the per-section accent color via the --cat-* CSS custom properties.
const CATEGORY_ORDER: ReadonlyArray<{ key: string; label: string }> = [
  { key: 'language', label: 'Languages' },
  { key: 'framework', label: 'Frameworks' },
  { key: 'platform', label: 'Platforms' },
  { key: 'tool', label: 'Tools' },
  { key: 'library', label: 'Libraries' },
  { key: 'other', label: 'Other' },
];

@Component({
  selector: 'app-stack',
  standalone: true,
  imports: [RouterLink, PageHeroComponent, TechBadgeComponent],
  templateUrl: './stack.html',
  styleUrl: './stack.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StackComponent implements OnInit {
  private technologiesService = inject(TechnologiesService);
  private projectsService = inject(ProjectsService);
  private destroyRef = inject(DestroyRef);

  protected groups = signal<CategoryGroup[]>([]);
  protected loading = signal(true);

  constructor() {
    inject(SeoService).set({
      title: 'Stack',
      description:
        'The full set of languages, frameworks, platforms, and tools Zach Young has shipped production software with — grouped by category and mapped to the projects that used them.',
    });
  }

  ngOnInit(): void {
    forkJoin({
      technologies: this.technologiesService.list(),
      projects: this.projectsService.list(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ technologies, projects }) => {
          this.groups.set(this.buildGroups(technologies, projects.projects));
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  // Buckets technologies into ordered category groups, and for each technology
  // resolves the projects that use it. Empty categories are dropped.
  private buildGroups(technologies: Technology[], projects: Project[]): CategoryGroup[] {
    return CATEGORY_ORDER.map(({ key, label }) => ({
      key,
      label,
      technologies: technologies
        .filter((tech) => (tech.category ?? 'other') === key)
        .map((tech) => ({
          tech,
          projects: projects
            .filter((p) => p.technologies.some((t) => t.id === tech.id))
            .map((p) => ({ id: p.id, title: p.title })),
        })),
    })).filter((group) => group.technologies.length > 0);
  }
}
