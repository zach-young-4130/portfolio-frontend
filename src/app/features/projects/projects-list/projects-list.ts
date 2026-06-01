import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProjectsService } from '../../../core/services/projects.service';
import { SeoService } from '../../../core/services/seo.service';
import { Project } from '../../../core/models/project.model';
import { ProjectCardComponent } from '../../../shared/components/project-card/project-card';
import { PageHeroComponent } from '../../../shared/components/page-hero/page-hero';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [ProjectCardComponent, PageHeroComponent],
  templateUrl: './projects-list.html',
  styleUrl: './projects-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsListComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    inject(SeoService).set({
      title: 'Projects',
      description: 'Progressive web applications built with Ruby on Rails and Angular spanning e-commerce, ag-tech, ed-tech, fin-tech, and AI platforms.',
    });
  }

  protected projects = signal<Project[]>([]);
  protected loading = signal(true);

  ngOnInit(): void {
    this.projectsService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.projects.set(res.projects);
          this.loading.set(false);
        },
        error: () => { 
          this.loading.set(false); },
      });
  }
}
