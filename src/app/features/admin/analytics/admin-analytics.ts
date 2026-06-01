import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

interface PageViewStats {
  total: number;
  by_country: Record<string, number>;
  by_city: Record<string, number>;
  recent: Array<{ id: number; path: string; city: string | null; region: string | null; country: string | null; created_at: string }>;
}

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-analytics.html',
  styleUrl: './admin-analytics.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAnalyticsComponent implements OnInit {
  private api = inject(ApiService);
  private destroyRef = inject(DestroyRef);

  protected stats = signal<PageViewStats | null>(null);
  protected loading = signal(true);

  protected entries(obj: Record<string, number>): [string, number][] {
    return Object.entries(obj);
  }

  ngOnInit(): void {
    this.api.get<PageViewStats>('page_views/stats')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => { this.stats.set(res); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
  }
}
