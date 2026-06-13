import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProjectDetailComponent } from './project-detail';
import { ProjectData } from '../../../core/models/project.model';

function payload(overrides: Partial<ProjectData> = {}): ProjectData {
  return {
    id: 10,
    title: 'IHM Used Parts',
    tagline: 'Tagline',
    description: 'Description',
    highlights: 'Served 500,000+ parts.\nSub-second search.',
    tech_stack: 'Rails',
    cover_image_url: null,
    live_url: null,
    repo_url: null,
    featured: false,
    position: 1,
    published: true,
    project_start: '2023-01-01',
    project_end: '2025-04-01',
    technologies: [],
    tags: [],
    ...overrides,
  };
}

describe('ProjectDetailComponent', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function load(project: ProjectData): ComponentFixture<ProjectDetailComponent> {
    const fixture = TestBed.createComponent(ProjectDetailComponent);
    fixture.componentRef.setInput('id', '10');
    fixture.detectChanges(); // ngOnInit → GET projects/10
    http.expectOne((r) => r.url.endsWith('/projects/10')).flush({ project });
    fixture.detectChanges();
    return fixture;
  }

  it('renders the highlights list and the timeline when present', () => {
    const fixture = load(payload());
    const items = Array.from(
      fixture.nativeElement.querySelectorAll('.project-highlights li'),
    ).map((li) => (li as HTMLElement).textContent?.trim());
    expect(items).toContain('Served 500,000+ parts.');
    expect(items).toContain('Sub-second search.');
    expect(fixture.nativeElement.textContent).toContain('2023 – 2025');
  });

  it('omits the highlights list when none are provided', () => {
    const fixture = load(payload({ highlights: null }));
    expect(fixture.nativeElement.querySelector('.project-highlights')).toBeNull();
  });
});
