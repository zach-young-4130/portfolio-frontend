import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProjectCardComponent } from './project-card';
import { Project } from '../../../core/models/project.model';

const project: Project = {
  id: 1,
  title: 'Awesome',
  tagline: 'A nice tagline',
  description: 'Some description',
  tech_stack: 'Rails, Angular',
  cover_image_url: null,
  live_url: 'https://example.com',
  repo_url: null,
  featured: true,
  position: 1,
  published: true,
};

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
