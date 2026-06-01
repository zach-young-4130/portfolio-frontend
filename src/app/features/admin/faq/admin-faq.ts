import { Component, ChangeDetectionStrategy, TemplateRef, inject, viewChild, Signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FaqService } from '../../../core/services/faq.service';
import { FaqItem } from '../../../core/models/faq-item.model';
import { BaseCrudComponent } from '../base-crud.component';

@Component({
  selector: 'app-admin-faq',
  standalone: true,
  imports: [ReactiveFormsModule, NgbModalModule],
  templateUrl: './admin-faq.html',
  styleUrl: './admin-faq.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminFaqComponent extends BaseCrudComponent<FaqItem> {
  private faqService = inject(FaqService);
  private fb = inject(FormBuilder);

  protected editModal = viewChild.required<TemplateRef<unknown>>('editModal');
  protected deleteModal = viewChild.required<TemplateRef<unknown>>('deleteModal');
  protected editModalAriaLabel = 'faq-modal-title';
  protected deleteModalAriaLabel = 'faq-delete-title';

  protected form = this.fb.nonNullable.group({
    question: ['', [Validators.required]],
    answer:   ['', [Validators.required]],
    position:  [0],
    published: [false],
  });

  protected loadList()                     { return this.faqService.list(); }
  protected createItem(data: unknown)      { return this.faqService.create(data as Partial<FaqItem>); }
  protected updateItem(id: number, data: unknown) { return this.faqService.update(id, data as Partial<FaqItem>); }
  protected removeItem(id: number)         { return this.faqService.remove(id); }

  protected resetForm(): void {
    this.form.reset({ question: '', answer: '', position: 0, published: false });
  }

  protected populateForm(item: FaqItem): void {
    this.form.reset({
      question:  item.question,
      answer:    item.answer,
      position:  item.position ?? 0,
      published: item.published,
    });
  }

  protected buildSaveData() { return this.form.getRawValue(); }
}
