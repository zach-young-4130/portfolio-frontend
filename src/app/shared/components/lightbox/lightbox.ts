import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  templateUrl: './lightbox.html',
  styleUrl: './lightbox.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightboxComponent {
  protected readonly src = signal<string | null>(null);
  protected readonly alt = signal<string>('');

  open(src: string, alt: string): void {
    this.src.set(src);
    this.alt.set(alt);
  }

  protected close(): void {
    this.src.set(null);
  }
}
