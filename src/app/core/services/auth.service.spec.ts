import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';

const sessionUrl = `${environment.apiBaseUrl}/session`;

describe('AuthService', () => {
  let service: AuthService;
  let tokens: TokenService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    tokens = TestBed.inject(TokenService);
    http = TestBed.inject(HttpTestingController);
    tokens.clear();
  });

  afterEach(() => http.verify());

  it('starts unauthenticated', () => {
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('stores token and currentUser on successful login', () => {
    service.login('a@b.com', 'pw').subscribe();
    const req = http.expectOne(sessionUrl);
    req.flush({ user: { id: 1, email: 'a@b.com' }, token: 'fake.jwt.token' });

    expect(service.currentUser()).toEqual({ id: 1, email: 'a@b.com' });
    expect(service.isAuthenticated()).toBe(true);
    expect(tokens.get()).toBe('fake.jwt.token');
  });

  it('clears token and currentUser on logout', () => {
    service.login('a@b.com', 'pw').subscribe();
    http.expectOne(sessionUrl).flush({ user: { id: 1, email: 'a@b.com' }, token: 'fake.jwt.token' });

    service.logout().subscribe();
    http.expectOne(sessionUrl).flush(null);

    expect(service.currentUser()).toBeNull();
    expect(tokens.get()).toBeNull();
  });
});
