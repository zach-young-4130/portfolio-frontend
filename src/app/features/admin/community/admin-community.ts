import { Component, ChangeDetectionStrategy, TemplateRef, DestroyRef, inject, signal, viewChild, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CommunityService } from '../../../core/services/community.service';
import { TagsService } from '../../../core/services/tags.service';
import { CommunityItem } from '../../../core/models/community-item.model';
import { Tag } from '../../../core/models/tag.model';
import { BaseCrudComponent } from '../base-crud.component';
import { toggleSetItem } from '../../../shared/utils/signal-set';

@Component({
  selector: 'app-admin-community',
  standalone: true,
  imports: [ReactiveFormsModule, NgbModalModule],
  templateUrl: './admin-community.html',
  styleUrl: './admin-community.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCommunityComponent extends BaseCrudComponent<CommunityItem> implements OnInit {
  private communityService = inject(CommunityService);
  private tagsService = inject(TagsService);
  private fb = inject(FormBuilder);

  protected editModal = viewChild.required<TemplateRef<unknown>>('editModal');
  protected deleteModal = viewChild.required<TemplateRef<unknown>>('deleteModal');
  protected editModalAriaLabel = 'community-modal-title';
  protected deleteModalAriaLabel = 'community-delete-title';

  protected availableTags = signal<Tag[]>([]);
  protected selectedTagIds = signal<Set<number>>(new Set());

  protected form = this.fb.nonNullable.group({
    title:       ['', [Validators.required]],
    description: ['', [Validators.required]],
    url:         [''],
    role:        [''],
    year:        [''],
    position:    [0],
    published:   [false],
  });

  override ngOnInit(): void {
    super.ngOnInit();
    this.tagsService.list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tags) => this.availableTags.set(tags));
  }

  protected loadList()                     { return this.communityService.list(); }
  protected createItem(data: unknown)      { return this.communityService.create(data as Partial<CommunityItem>); }
  protected updateItem(id: number, data: unknown) { return this.communityService.update(id, data as Partial<CommunityItem>); }
  protected removeItem(id: number)         { return this.communityService.remove(id); }

  protected resetForm(): void {
    this.selectedTagIds.set(new Set());
    this.form.reset({ title: '', description: '', url: '', role: '', year: '', position: 0, published: false });
  }

  protected populateForm(item: CommunityItem): void {
    this.selectedTagIds.set(new Set(item.tags.map((t) => t.id)));
    this.form.reset({
      title:       item.title,
      description: item.description,
      url:         item.url ?? '',
      role:        item.role ?? '',
      year:        item.year ?? '',
      position:    item.position ?? 0,
      published:   item.published,
    });
  }

  protected buildSaveData() {
    return { ...this.form.getRawValue(), tag_ids: Array.from(this.selectedTagIds()) };
  }

  protected toggleTagId(id: number): void {
    toggleSetItem(this.selectedTagIds, id);
  }
}
