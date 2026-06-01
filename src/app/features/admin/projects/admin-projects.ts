import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, OnInit, TemplateRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsService } from '../../../core/services/projects.service';
import { TechnologiesService } from '../../../core/services/technologies.service';
import { TagsService } from '../../../core/services/tags.service';
import { Project } from '../../../core/models/project.model';
import { Technology } from '../../../core/models/technology.model';
import { Tag } from '../../../core/models/tag.model';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [ReactiveFormsModule, NgbModalModule],
  templateUrl: './admin-projects.html',
  styleUrl: './admin-projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProjectsComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  private technologiesService = inject(TechnologiesService);
  private tagsService = inject(TagsService);
  private modalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  protected projects = signal<Project[]>([]);
  protected editing = signal<Project | null>(null);
  protected availableTechnologies = signal<Technology[]>([]);
  protected availableTags = signal<Tag[]>([]);
  protected selectedTechIds = signal<Set<number>>(new Set());
  protected selectedTagIds = signal<Set<number>>(new Set());

  protected editModal = viewChild.required<TemplateRef<unknown>>('editModal');
  protected deleteModal = viewChild.required<TemplateRef<unknown>>('deleteModal');

  protected form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    tagline: ['', [Validators.required]],
    description: ['', [Validators.required]],
    tech_stack: ['', [Validators.required]],
    cover_image_url: [''],
    live_url: [''],
    repo_url: [''],
    featured: [false],
    position: [0],
    published: [false],
  });

  ngOnInit(): void {
    this.refresh();
    this.technologiesService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.availableTechnologies.set(res.technologies));
    this.tagsService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.availableTags.set(res.tags));
  }

  protected openNew(): void {
    this.editing.set(null);
    this.selectedTechIds.set(new Set());
    this.selectedTagIds.set(new Set());
    this.form.reset({
      title: '',
      tagline: '',
      description: '',
      tech_stack: '',
      cover_image_url: '',
      live_url: '',
      repo_url: '',
      featured: false,
      position: 0,
      published: false,
    });
    this.modalService.open(this.editModal(), { ariaLabelledBy: 'project-modal-title' });
  }

  protected openEdit(project: Project): void {
    this.editing.set(project);
    this.selectedTechIds.set(new Set(project.technologies.map((t) => t.id)));
    this.selectedTagIds.set(new Set(project.tags.map((t) => t.id)));
    this.form.reset({
      title: project.title,
      tagline: project.tagline,
      description: project.description,
      tech_stack: project.tech_stack,
      cover_image_url: project.cover_image_url ?? '',
      live_url: project.live_url ?? '',
      repo_url: project.repo_url ?? '',
      featured: project.featured,
      position: project.position ?? 0,
      published: project.published,
    });
    this.modalService.open(this.editModal(), { ariaLabelledBy: 'project-modal-title' });
  }

  protected toggleTechId(id: number): void {
    const next = new Set(this.selectedTechIds());
    next.has(id) ? next.delete(id) : next.add(id);
    this.selectedTechIds.set(next);
  }

  protected toggleTagId(id: number): void {
    const next = new Set(this.selectedTagIds());
    next.has(id) ? next.delete(id) : next.add(id);
    this.selectedTagIds.set(next);
  }

  protected save(close: () => void): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = {
      ...this.form.getRawValue(),
      technology_ids: Array.from(this.selectedTechIds()),
      tag_ids: Array.from(this.selectedTagIds()),
    };
    const current = this.editing();
    const op = current
      ? this.projectsService.update(current.id, data)
      : this.projectsService.create(data);
    op.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      close();
      this.refresh();
    });
  }

  protected confirmDelete(project: Project): void {
    this.editing.set(project);
    this.modalService
      .open(this.deleteModal(), { ariaLabelledBy: 'delete-modal-title' })
      .result.then(
        (confirmed) => {
          if (confirmed) {
            this.projectsService
              .remove(project.id)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe(() => this.refresh());
          }
        },
        () => undefined,
      );
  }

  private refresh(): void {
    this.projectsService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.projects.set(res.projects));
  }
}
