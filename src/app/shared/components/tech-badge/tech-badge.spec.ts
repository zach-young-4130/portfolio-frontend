import { TestBed } from '@angular/core/testing';
import { TechBadgeComponent } from './tech-badge';
import { Technology } from '../../../core/models/technology.model';

function render(tech: Technology): HTMLElement {
  const fixture = TestBed.createComponent(TechBadgeComponent);
  fixture.componentRef.setInput('tech', tech);
  fixture.detectChanges();
  return fixture.nativeElement.querySelector('span.tech-badge') as HTMLElement;
}

describe('TechBadgeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TechBadgeComponent] }).compileComponents();
  });

  it('renders the technology name', () => {
    const span = render({ id: 1, name: 'Angular', slug: 'angular', category: 'framework' });
    expect(span.textContent?.trim()).toBe('Angular');
  });

  it('applies the category edge-color modifier class', () => {
    const span = render({ id: 2, name: 'TypeScript', slug: 'typescript', category: 'language' });
    expect(span.classList).toContain('tech-badge--language');
  });

  it('falls back to the neutral edge when category is null', () => {
    const span = render({ id: 3, name: 'Mystery', slug: 'mystery', category: null });
    expect(span.classList).toContain('tech-badge--other');
  });
});
