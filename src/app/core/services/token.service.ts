import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'portfolio.admin.token';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private platformId = inject(PLATFORM_ID);

  get(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(STORAGE_KEY);
  }

  set(token: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(STORAGE_KEY, token);
  }

  clear(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(STORAGE_KEY);
  }
}
