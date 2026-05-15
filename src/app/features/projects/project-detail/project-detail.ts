import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, computed, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProjectsService } from '../../../core/services/projects.service';
import { Project } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink],
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

  protected techList = computed(() => {
    const p = this.project();
    return p
      ? p.tech_stack
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
  });

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
