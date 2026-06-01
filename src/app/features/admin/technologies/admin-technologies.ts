import { Component, ChangeDetectionStrategy, TemplateRef, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TechnologiesService } from '../../../core/services/technologies.service';
import { Technology, TechnologyInput } from '../../../core/models/technology.model';
import { BaseCrudComponent } from '../base-crud.component';

const CATEGORIES = ['language', 'framework', 'tool', 'platform', 'library'] as const;

@Component({
  selector: 'app-admin-technologies',
  standalone: true,
  imports: [ReactiveFormsModule, NgbModalModule],
  templateUrl: './admin-technologies.html',
  styleUrl: './admin-technologies.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTechnologiesComponent extends BaseCrudComponent<Technology> {
  private technologiesService = inject(TechnologiesService);
  private fb = inject(FormBuilder);

  protected editModal = viewChild.required<TemplateRef<unknown>>('editModal');
  protected deleteModal = viewChild.required<TemplateRef<unknown>>('deleteModal');
  protected editModalAriaLabel = 'tech-modal-title';
  protected deleteModalAriaLabel = 'delete-tech-modal-title';
  protected readonly categories = CATEGORIES;

  protected form = this.fb.nonNullable.group({
    name:     ['', [Validators.required]],
    slug:     ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    category: [''],
  });

  protected loadList()                     { return this.technologiesService.list(); }
  protected createItem(data: unknown)      { return this.technologiesService.create(data as TechnologyInput); }
  protected updateItem(id: number, data: unknown) { return this.technologiesService.update(id, data as Partial<TechnologyInput>); }
  protected removeItem(id: number)         { return this.technologiesService.remove(id); }

  protected resetForm(): void {
    this.form.reset({ name: '', slug: '', category: '' });
  }

  protected populateForm(item: Technology): void {
    this.form.reset({ name: item.name, slug: item.slug, category: item.category ?? '' });
  }

  protected buildSaveData(): TechnologyInput {
    const raw = this.form.getRawValue();
    return { name: raw.name, slug: raw.slug, category: raw.category || null };
  }
}
