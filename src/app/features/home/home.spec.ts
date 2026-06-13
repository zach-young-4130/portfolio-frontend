import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HomeComponent } from './home';

describe('HomeComponent', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function render() {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges(); // ngOnInit → GET projects + faq_items
    http.expectOne((r) => r.url.endsWith('/projects')).flush({ projects: [] });
    http.expectOne((r) => r.url.endsWith('/faq_items')).flush({ faq_items: [] });
    fixture.detectChanges();
    return fixture;
  }

  it('renders a downloadable résumé CTA at the bottom', () => {
    const fixture = render();
    const resume = fixture.nativeElement.querySelector('a[href="resume.pdf"]') as HTMLAnchorElement | null;
    expect(resume).toBeTruthy();
    expect(resume?.hasAttribute('download')).toBe(true);
    expect(resume?.getAttribute('aria-label')).toContain('résumé');
  });

  it('links to the Stack page from the closing CTA', () => {
    const fixture = render();
    const stackLink = fixture.nativeElement.querySelector('a[href="/stack"]') as HTMLAnchorElement | null;
    expect(stackLink?.textContent).toContain('Explore the Stack');
  });
});
