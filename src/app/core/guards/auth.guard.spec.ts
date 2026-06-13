import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('redirects to /admin/login when not authenticated', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never),
    ) as UrlTree;
    expect(result instanceof UrlTree).toBe(true);
    expect(result.toString()).toBe('/admin/login');
  });

  it('returns true when authenticated', () => {
    const auth = TestBed.inject(AuthService);
    auth.currentUser.set({ id: 1, email: 'a@b.com', name: null, avatar_url: null, role: 'admin' });
    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));
    expect(result).toBe(true);
  });
});
