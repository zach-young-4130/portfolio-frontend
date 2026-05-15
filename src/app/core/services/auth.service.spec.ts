import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('starts unauthenticated', () => {
    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('sets currentUser on successful login', () => {
    service.login('a@b.com', 'pw').subscribe();
    const req = http.expectOne('http://localhost:5000/api/v1/session');
    req.flush({ user: { id: 1, email: 'a@b.com' } });
    expect(service.currentUser()).toEqual({ id: 1, email: 'a@b.com' });
    expect(service.isAuthenticated()).toBe(true);
  });

  it('clears currentUser on logout', () => {
    service.login('a@b.com', 'pw').subscribe();
    http.expectOne('http://localhost:5000/api/v1/session').flush({ user: { id: 1, email: 'a@b.com' } });

    service.logout().subscribe();
    http.expectOne('http://localhost:5000/api/v1/session').flush(null);
    expect(service.currentUser()).toBeNull();
  });
});
