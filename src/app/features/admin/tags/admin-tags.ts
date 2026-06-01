import { Component, ChangeDetectionStrategy, TemplateRef, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TagsService } from '../../../core/services/tags.service';
import { Tag, TagInput } from '../../../core/models/tag.model';
import { BaseCrudComponent } from '../base-crud.component';

@Component({
  selector: 'app-admin-tags',
  standalone: true,
  imports: [ReactiveFormsModule, NgbModalModule],
  templateUrl: './admin-tags.html',
  styleUrl: './admin-tags.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTagsComponent extends BaseCrudComponent<Tag> {
  private tagsService = inject(TagsService);
  private fb = inject(FormBuilder);

  protected editModal = viewChild.required<TemplateRef<unknown>>('editModal');
  protected deleteModal = viewChild.required<TemplateRef<unknown>>('deleteModal');
  protected editModalAriaLabel = 'tag-modal-title';
  protected deleteModalAriaLabel = 'delete-tag-modal-title';

  protected form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
  });

  protected loadList()                     { return this.tagsService.list(); }
  protected createItem(data: unknown)      { return this.tagsService.create(data as TagInput); }
  protected updateItem(id: number, data: unknown) { return this.tagsService.update(id, data as Partial<TagInput>); }
  protected removeItem(id: number)         { return this.tagsService.remove(id); }

  protected resetForm(): void {
    this.form.reset({ name: '', slug: '' });
  }

  protected populateForm(item: Tag): void {
    this.form.reset({ name: item.name, slug: item.slug });
  }

  protected buildSaveData() { return this.form.getRawValue(); }
}
