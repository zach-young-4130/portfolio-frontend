import { Injectable, inject, PLATFORM_ID, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';

const BOT_PATTERN = /bot|crawl|spider|GPTBot|ClaudeBot|anthropic|openai|lighthouse|pingdom|curl|wget/i;

@Injectable({ providedIn: 'root' })
export class TrackingService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (BOT_PATTERN.test(navigator.userAgent)) return;

    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((event) => {
      const path = event.urlAfterRedirects.split('?')[0];
      if (path.startsWith('/admin')) return;

      this.http.post(`${environment.apiBaseUrl}/page_views`, {
        page_view: { path, referrer: document.referrer || null },
      }).subscribe({ error: () => {} });
    });
  }
}
