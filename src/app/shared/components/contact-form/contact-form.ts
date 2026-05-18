import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from '../../../core/services/contact.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent {
  private fb = inject(FormBuilder);
  private contactService = inject(ContactService);
  private destroyRef = inject(DestroyRef);

  protected sent = signal(false);
  protected submitting = signal(false);
  protected errorMessage = signal<string | null>(null);

  private hideSentTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideErrorTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.hideSentTimeout) clearTimeout(this.hideSentTimeout);
      if (this.hideErrorTimeout) clearTimeout(this.hideErrorTimeout);
    });
  }

  protected form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    project_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.errorMessage.set(null);
    this.contactService
      .send(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.sent.set(true);
          this.submitting.set(false);
          this.form.reset();
          if (this.hideSentTimeout) clearTimeout(this.hideSentTimeout);
          this.hideSentTimeout = setTimeout(() => this.sent.set(false), 30_000);
        },
        error: () => {
          this.errorMessage.set('We could not send your message. Please try again.');
          this.submitting.set(false);
          if (this.hideErrorTimeout) clearTimeout(this.hideErrorTimeout);
          this.hideErrorTimeout = setTimeout(() => this.errorMessage.set(null), 30_000);
        },
      });
  }
}
