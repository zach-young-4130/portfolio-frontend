import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { ContactService } from '../../../core/services/contact.service';
import { ContactMessage } from '../../../core/models/contact-message.model';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-messages.html',
  styleUrl: './admin-messages.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMessagesComponent implements OnInit {
  private contactService = inject(ContactService);
  private destroyRef = inject(DestroyRef);

  protected messages = signal<ContactMessage[]>([]);
  protected loading = signal(true);

  ngOnInit(): void {
    this.refresh();
  }

  protected markRead(message: ContactMessage): void {
    this.contactService
      .markRead(message.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refresh());
  }

  private refresh(): void {
    this.contactService
      .listUnread()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.messages.set(res.contact_messages);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
