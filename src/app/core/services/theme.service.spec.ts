import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    TestBed.tick();
  });

  it('applies a theme class to the html root', () => {
    const root = document.documentElement;
    expect(root.classList.contains(`theme-${service.theme()}`)).toBe(true);
  });

  it('toggle flips between light and dark', () => {
    const initial = service.theme();
    service.toggle();
    TestBed.tick();
    expect(service.theme()).not.toBe(initial);
    service.toggle();
    TestBed.tick();
    expect(service.theme()).toBe(initial);
  });

  it('persists the theme in localStorage', () => {
    service.toggle();
    TestBed.tick();
    expect(localStorage.getItem('theme')).toBe(service.theme());
  });
});
