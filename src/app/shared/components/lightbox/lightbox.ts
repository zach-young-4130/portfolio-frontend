import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  PLATFORM_ID,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  templateUrl: './lightbox.html',
  styleUrl: './lightbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightboxComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly closeBtn = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');

  protected readonly src = signal<string | null>(null);
  protected readonly alt = signal<string>('');

  // The control that opened the dialog, so focus can return to it on close.
  private returnFocusEl: HTMLElement | null = null;

  open(src: string, alt: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.returnFocusEl = (document.activeElement as HTMLElement) ?? null;
    }
    this.src.set(src);
    this.alt.set(alt);
    // Move focus into the dialog once the @if has rendered the overlay.
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.closeBtn()?.nativeElement.focus());
    }
  }

  protected close(): void {
    this.src.set(null);
    if (isPlatformBrowser(this.platformId)) {
      this.returnFocusEl?.focus();
      this.returnFocusEl = null;
    }
  }

  // Single-control focus trap: keep Tab / Shift+Tab on the close button so focus
  // can't escape to inert content behind the aria-modal dialog.
  protected trapFocus(event: Event): void {
    event.preventDefault();
    this.closeBtn()?.nativeElement.focus();
  }
}
