import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProjectsService } from '../../../core/services/projects.service';
import { Project } from '../../../core/models/project.model';
import { LightboxComponent } from '../../../shared/components/lightbox/lightbox';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, LightboxComponent],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  private destroyRef = inject(DestroyRef);

  id = input.required<string>();

  protected project = signal<Project | null>(null);
  protected notFound = signal(false);

  ngOnInit(): void {
    const numericId = Number(this.id());
    if (!Number.isFinite(numericId)) {
      this.notFound.set(true);
      return;
    }
    this.projectsService
      .get(numericId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.project.set(res.project),
        error: () => this.notFound.set(true),
      });
  }
}
