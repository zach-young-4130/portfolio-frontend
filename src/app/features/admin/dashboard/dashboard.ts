import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../../core/services/contact.service';
import { ProjectsService } from '../../../core/services/projects.service';
import { FaqService } from '../../../core/services/faq.service';
import { CommunityService } from '../../../core/services/community.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  private contactService = inject(ContactService);
  private projectsService = inject(ProjectsService);
  private faqService = inject(FaqService);
  private communityService = inject(CommunityService);
  private destroyRef = inject(DestroyRef);

  protected projectsCount = signal<number | null>(null);
  protected faqCount = signal<number | null>(null);
  protected communityCount = signal<number | null>(null);
  protected unreadCount = signal<number | null>(null);

  ngOnInit(): void {
    this.projectsService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.projectsCount.set(res.projects.length),
        error: () => this.projectsCount.set(0),
      });

    this.faqService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.faqCount.set(res.faq_items.length),
        error: () => this.faqCount.set(0),
      });

    this.communityService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.communityCount.set(res.community_items.length),
        error: () => this.communityCount.set(0),
      });

    this.contactService
      .listUnread()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.unreadCount.set(res.contact_messages.length),
        error: () => this.unreadCount.set(0),
      });
  }
}
