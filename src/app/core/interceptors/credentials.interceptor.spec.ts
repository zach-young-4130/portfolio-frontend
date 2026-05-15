import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { credentialsInterceptor } from './credentials.interceptor';

describe('credentialsInterceptor', () => {
  let http: HttpClient;
  let testCtrl: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([credentialsInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    testCtrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => testCtrl.verify());

  it('sets withCredentials on outgoing requests', () => {
    http.get('/anything').subscribe();
    const req = testCtrl.expectOne('/anything');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });
});
