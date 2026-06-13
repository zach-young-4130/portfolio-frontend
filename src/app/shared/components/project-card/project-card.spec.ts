import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProjectCardComponent } from './project-card';
import { Project } from '../../../core/models/project.model';

const project = new Project({
  id: 1,
  title: 'Awesome',
  tagline: 'A nice tagline',
  description: 'Some description',
  highlights: null,
  tech_stack: 'Rails, Angular',
  cover_image_url: null,
  live_url: 'https://example.com',
  repo_url: null,
  featured: true,
  position: 1,
  published: true,
  project_start: '2024-06-01',
  project_end: '2024-12-15',
  technologies: [],
  tags: [],
});

describe('ProjectCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the title and per-action aria-labels include the project title', () => {
    const fixture = TestBed.createComponent(ProjectCardComponent);
    fixture.componentRef.setInput('project', project);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Awesome');

    const liveLink = fixture.nativeElement.querySelector('a[aria-label*="Awesome"]') as HTMLAnchorElement | null;
    expect(liveLink).toBeTruthy();
  });
});
