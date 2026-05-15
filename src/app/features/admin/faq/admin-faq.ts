import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, OnInit, TemplateRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FaqService } from '../../../core/services/faq.service';
import { FaqItem } from '../../../core/models/faq-item.model';

@Component({
  selector: 'app-admin-faq',
  standalone: true,
  imports: [ReactiveFormsModule, NgbModalModule],
  templateUrl: './admin-faq.html',
  styleUrl: './admin-faq.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFaqComponent implements OnInit {
  private faqService = inject(FaqService);
  private modalService = inject(NgbModal);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  protected items = signal<FaqItem[]>([]);
  protected editing = signal<FaqItem | null>(null);

  protected editModal = viewChild.required<TemplateRef<unknown>>('editModal');
  protected deleteModal = viewChild.required<TemplateRef<unknown>>('deleteModal');

  protected form = this.fb.nonNullable.group({
    question: ['', [Validators.required]],
    answer: ['', [Validators.required]],
    position: [0],
    published: [false],
  });

  ngOnInit(): void {
    this.refresh();
  }

  protected openNew(): void {
    this.editing.set(null);
    this.form.reset({ question: '', answer: '', position: 0, published: false });
    this.modalService.open(this.editModal(), { ariaLabelledBy: 'faq-modal-title' });
  }

  protected openEdit(item: FaqItem): void {
    this.editing.set(item);
    this.form.reset({
      question: item.question,
      answer: item.answer,
      position: item.position ?? 0,
      published: item.published,
    });
    this.modalService.open(this.editModal(), { ariaLabelledBy: 'faq-modal-title' });
  }

  protected save(close: () => void): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const data = this.form.getRawValue();
    const current = this.editing();
    const op = current ? this.faqService.update(current.id, data) : this.faqService.create(data);
    op.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      close();
      this.refresh();
    });
  }

  protected confirmDelete(item: FaqItem): void {
    this.editing.set(item);
    this.modalService
      .open(this.deleteModal(), { ariaLabelledBy: 'faq-delete-title' })
      .result.then(
        (confirmed) => {
          if (confirmed) {
            this.faqService
              .remove(item.id)
              .pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe(() => this.refresh());
          }
        },
        () => undefined,
      );
  }

  private refresh(): void {
    this.faqService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.items.set(res.faq_items));
  }
}
