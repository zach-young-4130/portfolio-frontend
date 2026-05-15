import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NavbarComponent } from './navbar';

describe('NavbarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('has accessible labels on icon-only theme toggle', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const toggle = fixture.nativeElement.querySelector(
      'button[aria-label*="theme"]',
    ) as HTMLButtonElement | null;
    expect(toggle).toBeTruthy();
  });

  it('renders public nav links', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const links = Array.from(fixture.nativeElement.querySelectorAll('a.nav-link')) as HTMLAnchorElement[];
    const labels = links.map((a) => a.textContent?.trim());
    expect(labels).toContain('Projects');
    expect(labels).toContain('FAQ');
    expect(labels).toContain('Community');
    expect(labels).toContain('Contact');
  });
});
