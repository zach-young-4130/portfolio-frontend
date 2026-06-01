import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ProjectsService } from '../../../core/services/projects.service';
import { SeoService } from '../../../core/services/seo.service';
import { Project } from '../../../core/models/project.model';
import { ProjectCardComponent } from '../../../shared/components/project-card/project-card';
import { PageHeroComponent } from '../../../shared/components/page-hero/page-hero';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [ProjectCardComponent, PageHeroComponent, FormsModule],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsListComponent {
  private projectsService = inject(ProjectsService);
  private destroyRef = inject(DestroyRef);

  protected query = signal('');
  protected projects = signal<Project[]>([]);
  protected loading = signal(true);

  constructor() {
    inject(SeoService).set({
      title: 'Projects',
      description: 'Progressive web applications built with Ruby on Rails and Angular spanning e-commerce, ag-tech, ed-tech, fin-tech, and AI platforms.',
    });

    toObservable(this.query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.loading.set(true)),
      switchMap((q) => this.projectsService.list(q ? { q } : undefined)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (res) => {
        this.projects.set(res.projects);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected clearSearch(): void {
    this.query.set('');
  }
}
