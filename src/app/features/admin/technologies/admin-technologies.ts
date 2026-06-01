import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, OnInit, TemplateRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TechnologiesService } from '../../../core/services/technologies.service';
import { Technology } from '../../../core/models/technology.model';

const CATEGORIES = ['language', 'framework', 'tool', 'platform', 'library'] as const;

@Component({
  selector: 'app-admin-technologies',
  standalone: true,
  imports: [ReactiveFormsModule, NgbModalModule],
  templateUrl: './admin-technologies.html',
  styleUrl: './admin-technologies.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTechnologiesComponent implements OnInit {
  private technologiesService = inject(TechnologiesService);
  private modalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  protected technologies = signal<Technology[]>([]);
  protected editing = signal<Technology | null>(null);
  protected readonly categories = CATEGORIES;

  protected editModal = viewChild.required<TemplateRef<unknown>>('editModal');
  protected deleteModal = viewChild.required<TemplateRef<unknown>>('deleteModal');

  protected form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    category: [''],
  });

  ngOnInit(): void {
    this.refresh();
  }

  protected openNew(): void {
    this.editing.set(null);
    this.form.reset({ name: '', slug: '', category: '' });
    this.modalService.open(this.editModal(), { ariaLabelledBy: 'tech-modal-title' });
  }

  protected openEdit(technology: Technology): void {
    this.editing.set(technology);
    this.form.reset({
      name: technology.name,
      slug: technology.slug,
      category: technology.category ?? '',
    });
    this.modalService.open(this.editModal(), { ariaLabelledBy: 'tech-modal-title' });
  }

  protected save(close: () => void): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const data = { ...raw, category: raw.category || null };
    const current = this.editing();
    const op = current
      ? this.technologiesService.update(current.id, data)
      : this.technologiesService.create({ name: data.name, slug: data.slug, category: data.category });
    op.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      close();
      this.refresh();
    });
  }

  protected confirmDelete(technology: Technology): void {
    this.editing.set(technology);
    this.modalService
      .open(this.deleteModal(), { ariaLabelledBy: 'delete-tech-modal-title' })
      .result.then(
        (confirmed) => {
          if (confirmed) {
            this.technologiesService
              .remove(technology.id)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe(() => this.refresh());
          }
        },
        () => undefined,
      );
  }

  private refresh(): void {
    this.technologiesService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.technologies.set(res.technologies));
  }
}
