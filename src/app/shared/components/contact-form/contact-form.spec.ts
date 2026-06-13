import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactFormComponent } from './contact-form';
import { environment } from '../../../../environments/environment';

describe('ContactFormComponent', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('does not submit an invalid form', () => {
    const fixture = TestBed.createComponent(ContactFormComponent);
    fixture.detectChanges();
    const cmp = fixture.componentInstance as unknown as { submit: () => void };
    cmp.submit();
    http.expectNone(`${environment.apiBaseUrl}/contact_messages`);
  });

  it('posts to the contact_messages endpoint on submit', () => {
    const fixture = TestBed.createComponent(ContactFormComponent);
    const cmp = fixture.componentInstance as unknown as { form: { setValue: (v: object) => void }; submit: () => void };
    cmp.form.setValue({ name: 'Jane', email: 'jane@example.com', project_name: 'Acme', message: 'Hello there friend' });
    cmp.submit();
    const req = http.expectOne(`${environment.apiBaseUrl}/contact_messages`);
    expect(req.request.method).toBe('POST');
    req.flush({ contact_message: { id: 1, name: 'Jane', email: 'jane@example.com', message: 'Hello there friend', read_at: null, created_at: '' } });
  });
});
