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

  function projectPayload(id: number, title: string, techIds: number[]) {
    return {
      id,
      title,
      tagline: '',
      description: '',
      highlights: null,
      tech_stack: '',
      cover_image_url: null,
      live_url: null,
      repo_url: null,
      featured: false,
      position: id,
      published: true,
      project_start: null,
      project_end: null,
      technologies: techIds.map((tid) => ({
        id: tid,
        name: tid === 1 ? 'Angular' : 'TypeScript',
        slug: tid === 1 ? 'angular' : 'typescript',
        category: tid === 1 ? 'framework' : 'language',
      })),
      tags: [],
    };
  }

  it('lists per-project links for partial usage and "All projects" for ubiquitous techs', () => {
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
        projectPayload(10, 'IHM Used Parts', [1, 2]), // Angular + TypeScript
        projectPayload(11, 'SR Harvesting', [2]), //      TypeScript only
      ],
    });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Languages');
    expect(text).toContain('Frameworks');

    // TypeScript is in every project → the "All projects" phrase, no link list.
    expect(text).toContain('All projects');

    // Angular is in only one project → a direct link to that project.
    const link = fixture.nativeElement.querySelector('a[href="/projects/10"]') as HTMLAnchorElement | null;
    expect(link?.textContent).toContain('IHM Used Parts');
  });
});
