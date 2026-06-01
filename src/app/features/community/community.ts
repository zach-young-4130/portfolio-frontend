import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommunityService } from '../../core/services/community.service';
import { CommunityItem } from '../../core/models/community-item.model';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [PageHeroComponent],
  templateUrl: './community.html',
  styleUrl: './community.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityComponent implements OnInit {
  private communityService = inject(CommunityService);
  private destroyRef = inject(DestroyRef);

  protected items = signal<CommunityItem[]>([]);
  protected loading = signal(true);

  ngOnInit(): void {
    this.communityService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.items.set(res.community_items);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
