import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, OnInit, TemplateRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CommunityService } from '../../../core/services/community.service';
import { TagsService } from '../../../core/services/tags.service';
import { CommunityItem } from '../../../core/models/community-item.model';
import { Tag } from '../../../core/models/tag.model';

@Component({
  selector: 'app-admin-community',
  standalone: true,
  imports: [ReactiveFormsModule, NgbModalModule],
  templateUrl: './admin-community.html',
  styleUrl: './admin-community.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCommunityComponent implements OnInit {
  private communityService = inject(CommunityService);
  private tagsService = inject(TagsService);
  private modalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  protected items = signal<CommunityItem[]>([]);
  protected editing = signal<CommunityItem | null>(null);
  protected availableTags = signal<Tag[]>([]);
  protected selectedTagIds = signal<Set<number>>(new Set());

  protected editModal = viewChild.required<TemplateRef<unknown>>('editModal');
  protected deleteModal = viewChild.required<TemplateRef<unknown>>('deleteModal');

  protected form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    url: [''],
    role: [''],
    year: [''],
    position: [0],
    published: [false],
  });

  ngOnInit(): void {
    this.refresh();
    this.tagsService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.availableTags.set(res.tags));
  }

  protected toggleTagId(id: number): void {
    const next = new Set(this.selectedTagIds());
    next.has(id) ? next.delete(id) : next.add(id);
    this.selectedTagIds.set(next);
  }

  protected openNew(): void {
    this.editing.set(null);
    this.selectedTagIds.set(new Set());
    this.form.reset({ title: '', description: '', url: '', role: '', year: '', position: 0, published: false });
    this.modalService.open(this.editModal(), { ariaLabelledBy: 'community-modal-title' });
  }

  protected openEdit(item: CommunityItem): void {
    this.editing.set(item);
    this.selectedTagIds.set(new Set(item.tags.map((t) => t.id)));
    this.form.reset({
      title: item.title,
      description: item.description,
      url: item.url ?? '',
      role: item.role ?? '',
      year: item.year ?? '',
      position: item.position ?? 0,
      published: item.published,
    });
    this.modalService.open(this.editModal(), { ariaLabelledBy: 'community-modal-title' });
  }

  protected save(close: () => void): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = {
      ...this.form.getRawValue(),
      tag_ids: Array.from(this.selectedTagIds()),
    };
    const current = this.editing();
    const op = current ? this.communityService.update(current.id, data) : this.communityService.create(data);
    op.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      close();
      this.refresh();
    });
  }

  protected confirmDelete(item: CommunityItem): void {
    this.editing.set(item);
    this.modalService
      .open(this.deleteModal(), { ariaLabelledBy: 'community-delete-title' })
      .result.then(
        (confirmed) => {
          if (confirmed) {
            this.communityService
              .remove(item.id)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe(() => this.refresh());
          }
        },
        () => undefined,
      );
  }

  private refresh(): void {
    this.communityService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.items.set(res.community_items));
  }
}
