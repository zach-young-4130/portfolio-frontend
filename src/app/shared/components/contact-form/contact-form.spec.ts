import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactFormComponent } from './contact-form';

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

  it('disables submit when the form is invalid', () => {
    const fixture = TestBed.createComponent(ContactFormComponent);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('posts to /api/v1/contact_messages on submit', () => {
    const fixture = TestBed.createComponent(ContactFormComponent);
    const cmp = fixture.componentInstance as unknown as { form: { setValue: (v: object) => void }; submit: () => void };
    cmp.form.setValue({ name: 'Jane', email: 'jane@example.com', message: 'Hello there friend' });
    cmp.submit();
    const req = http.expectOne('http://localhost:5000/api/v1/contact_messages');
    expect(req.request.method).toBe('POST');
    req.flush({ contact_message: { id: 1, name: 'Jane', email: 'jane@example.com', message: 'Hello there friend', read_at: null, created_at: '' } });
  });
});
