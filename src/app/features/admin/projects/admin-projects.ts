import { Component, ChangeDetectionStrategy, TemplateRef, inject, signal, viewChild, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsService } from '../../../core/services/projects.service';
import { TechnologiesService } from '../../../core/services/technologies.service';
import { TagsService } from '../../../core/services/tags.service';
import { Project } from '../../../core/models/project.model';
import { Technology } from '../../../core/models/technology.model';
import { Tag } from '../../../core/models/tag.model';
import { BaseCrudComponent } from '../base-crud.component';
import { toggleSetItem } from '../../../shared/utils/signal-set';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [ReactiveFormsModule, NgbModalModule],
  templateUrl: './admin-projects.html',
  styleUrl: './admin-projects.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProjectsComponent extends BaseCrudComponent<Project> implements OnInit {
  private projectsService = inject(ProjectsService);
  private technologiesService = inject(TechnologiesService);
  private tagsService = inject(TagsService);
  private fb = inject(FormBuilder);

  protected editModal = viewChild.required<TemplateRef<unknown>>('editModal');
  protected deleteModal = viewChild.required<TemplateRef<unknown>>('deleteModal');
  protected editModalAriaLabel = 'project-modal-title';
  protected deleteModalAriaLabel = 'delete-modal-title';

  protected availableTechnologies = signal<Technology[]>([]);
  protected availableTags = signal<Tag[]>([]);
  protected selectedTechIds = signal<Set<number>>(new Set());
  protected selectedTagIds = signal<Set<number>>(new Set());

  protected form = this.fb.nonNullable.group({
    title:           ['', [Validators.required]],
    tagline:         ['', [Validators.required]],
    description:     ['', [Validators.required]],
    tech_stack:      ['', [Validators.required]],
    cover_image_url: [''],
    live_url:        [''],
    repo_url:        [''],
    featured:        [false],
    position:        [0],
    published:       [false],
  });

  override ngOnInit(): void {
    super.ngOnInit();
    this.technologiesService.list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((techs) => this.availableTechnologies.set(techs));
    this.tagsService.list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tags) => this.availableTags.set(tags));
  }

  protected loadList() {
    return this.projectsService.list().pipe(map((res) => res.projects));
  }

  protected createItem(data: unknown) { return this.projectsService.create(data as any); }
  protected updateItem(id: number, data: unknown) { return this.projectsService.update(id, data as any); }
  protected removeItem(id: number) { return this.projectsService.remove(id); }

  protected resetForm(): void {
    this.selectedTechIds.set(new Set());
    this.selectedTagIds.set(new Set());
    this.form.reset({
      title: '', tagline: '', description: '', tech_stack: '',
      cover_image_url: '', live_url: '', repo_url: '',
      featured: false, position: 0, published: false,
    });
  }

  protected populateForm(project: Project): void {
    this.selectedTechIds.set(new Set(project.technologies.map((t) => t.id)));
    this.selectedTagIds.set(new Set(project.tags.map((t) => t.id)));
    this.form.reset({
      title:           project.title,
      tagline:         project.tagline,
      description:     project.description,
      tech_stack:      project.tech_stack,
      cover_image_url: project.cover_image_url ?? '',
      live_url:        project.live_url ?? '',
      repo_url:        project.repo_url ?? '',
      featured:        project.featured,
      position:        project.position ?? 0,
      published:       project.published,
    });
  }

  protected buildSaveData() {
    return {
      ...this.form.getRawValue(),
      technology_ids: Array.from(this.selectedTechIds()),
      tag_ids:        Array.from(this.selectedTagIds()),
    };
  }

  protected toggleTechId(id: number): void { toggleSetItem(this.selectedTechIds, id); }
  protected toggleTagId(id: number): void  { toggleSetItem(this.selectedTagIds, id);  }
}
