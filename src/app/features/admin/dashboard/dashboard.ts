import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../../core/services/contact.service';
import { ProjectsService } from '../../../core/services/projects.service';
import { FaqService } from '../../../core/services/faq.service';
import { CommunityService } from '../../../core/services/community.service';
import { TechnologiesService } from '../../../core/services/technologies.service';
import { TagsService } from '../../../core/services/tags.service';

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
  private technologiesService = inject(TechnologiesService);
  private tagsService = inject(TagsService);
  private destroyRef = inject(DestroyRef);

  protected projectsCount = signal<number | null>(null);
  protected faqCount = signal<number | null>(null);
  protected communityCount = signal<number | null>(null);
  protected unreadCount = signal<number | null>(null);
  protected technologiesCount = signal<number | null>(null);
  protected tagsCount = signal<number | null>(null);

  ngOnInit(): void {
    this.projectsService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.projectsCount.set(res.projects.length), // ProjectsService keeps envelope
        error: () => this.projectsCount.set(0),
      });

    this.faqService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => this.faqCount.set(items.length),
        error: () => this.faqCount.set(0),
      });

    this.communityService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => this.communityCount.set(items.length),
        error: () => this.communityCount.set(0),
      });

    this.contactService
      .listUnread()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.unreadCount.set(res.contact_messages.length),
        error: () => this.unreadCount.set(0),
      });

    this.technologiesService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => this.technologiesCount.set(items.length),
        error: () => this.technologiesCount.set(0),
      });

    this.tagsService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => this.tagsCount.set(items.length),
        error: () => this.tagsCount.set(0),
      });
  }
}
