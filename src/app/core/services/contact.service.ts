import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ContactMessage, ContactMessageInput } from '../models/contact-message.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private api = inject(ApiService);

  send(data: ContactMessageInput) {
    return this.api.post<{ contact_message: ContactMessage }>('contact_messages', { contact_message: data });
  }

  listUnread() {
    return this.api.get<{ contact_messages: ContactMessage[] }>('contact_messages');
  }

  markRead(id: number) {
    return this.api.patch<{ contact_message: ContactMessage }>(`contact_messages/${id}`, {});
  }
}
