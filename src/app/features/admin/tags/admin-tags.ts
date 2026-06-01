import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, OnInit, TemplateRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TagsService } from '../../../core/services/tags.service';
import { Tag } from '../../../core/models/tag.model';

@Component({
  selector: 'app-admin-tags',
  standalone: true,
  imports: [ReactiveFormsModule, NgbModalModule],
  templateUrl: './admin-tags.html',
  styleUrl: './admin-tags.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTagsComponent implements OnInit {
  private tagsService = inject(TagsService);
  private modalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  protected tags = signal<Tag[]>([]);
  protected editing = signal<Tag | null>(null);

  protected editModal = viewChild.required<TemplateRef<unknown>>('editModal');
  protected deleteModal = viewChild.required<TemplateRef<unknown>>('deleteModal');

  protected form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
  });

  ngOnInit(): void {
    this.refresh();
  }

  protected openNew(): void {
    this.editing.set(null);
    this.form.reset({ name: '', slug: '' });
    this.modalService.open(this.editModal(), { ariaLabelledBy: 'tag-modal-title' });
  }

  protected openEdit(tag: Tag): void {
    this.editing.set(tag);
    this.form.reset({ name: tag.name, slug: tag.slug });
    this.modalService.open(this.editModal(), { ariaLabelledBy: 'tag-modal-title' });
  }

  protected save(close: () => void): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = this.form.getRawValue();
    const current = this.editing();
    const op = current
      ? this.tagsService.update(current.id, data)
      : this.tagsService.create(data);
    op.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      close();
      this.refresh();
    });
  }

  protected confirmDelete(tag: Tag): void {
    this.editing.set(tag);
    this.modalService
      .open(this.deleteModal(), { ariaLabelledBy: 'delete-tag-modal-title' })
      .result.then(
        (confirmed) => {
          if (confirmed) {
            this.tagsService
              .remove(tag.id)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe(() => this.refresh());
          }
        },
        () => undefined,
      );
  }

  private refresh(): void {
    this.tagsService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.tags.set(res.tags));
  }
}
