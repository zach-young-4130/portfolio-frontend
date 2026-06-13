import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('prefixes GET with /api/v1/', () => {
    service.get('projects').subscribe();
    const req = http.expectOne(`${environment.apiBaseUrl}/projects`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('prefixes POST with /api/v1/', () => {
    service.post('projects', { foo: 1 }).subscribe();
    const req = http.expectOne(`${environment.apiBaseUrl}/projects`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ foo: 1 });
    req.flush({});
  });

  it('prefixes PATCH and DELETE with /api/v1/', () => {
    service.patch('projects/1', { x: 1 }).subscribe();
    service.delete('projects/1').subscribe();
    const patch = http.expectOne((r) => r.method === 'PATCH');
    expect(patch.request.url).toBe(`${environment.apiBaseUrl}/projects/1`);
    patch.flush({});
    const del = http.expectOne((r) => r.method === 'DELETE');
    expect(del.request.url).toBe(`${environment.apiBaseUrl}/projects/1`);
    del.flush({});
  });
});
