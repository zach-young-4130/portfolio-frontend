import {
  Directive,
  ElementRef,
  DestroyRef,
  inject,
  input,
  afterNextRender,
} from '@angular/core';

@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective {
  private element = inject<ElementRef<HTMLElement>>(ElementRef);
  private destroyRef = inject(DestroyRef);

  readonly factor = input(0.3, { alias: 'appParallax' });

  constructor() {
    afterNextRender(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const el = this.element.nativeElement;
      let ticking = false;

      const update = () => {
        const rect = el.getBoundingClientRect();
        const viewportH = window.innerHeight;
        const sectionCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportH / 2;
        const factor = this.factor();
        const raw = (sectionCenter - viewportCenter) * -factor;
        const max = viewportH * factor;
        const offset = Math.max(-max, Math.min(max, raw));
        el.style.transform = `translate3d(0, ${Math.round(offset)}px, 0)`;
        ticking = false;
      };

      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      });

      update();
    });
  }
}
