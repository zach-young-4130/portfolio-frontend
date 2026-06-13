import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StackComponent } from './stack';

describe('StackComponent', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('groups technologies by category and links each to the projects that use it', () => {
    const fixture = TestBed.createComponent(StackComponent);
    fixture.detectChanges(); // ngOnInit fires both GETs via forkJoin

    http.expectOne((r) => r.url.endsWith('/technologies')).flush({
      technologies: [
        { id: 1, name: 'Angular', slug: 'angular', category: 'framework' },
        { id: 2, name: 'TypeScript', slug: 'typescript', category: 'language' },
      ],
    });
    http.expectOne((r) => r.url.endsWith('/projects')).flush({
      projects: [
        {
          id: 10,
          title: 'IHM Used Parts',
          tagline: '',
          description: '',
          highlights: null,
          tech_stack: '',
          cover_image_url: null,
          live_url: null,
          repo_url: null,
          featured: false,
          position: 1,
          published: true,
          project_start: null,
          project_end: null,
          technologies: [{ id: 1, name: 'Angular', slug: 'angular', category: 'framework' }],
          tags: [],
        },
      ],
    });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Languages');
    expect(text).toContain('Frameworks');
    expect(text).toContain('Angular');
    expect(text).toContain('TypeScript');

    // Angular is used by IHM Used Parts → a project link is rendered for it.
    const link = fixture.nativeElement.querySelector('a[href="/projects/10"]') as HTMLAnchorElement | null;
    expect(link?.textContent).toContain('IHM Used Parts');
  });
});
