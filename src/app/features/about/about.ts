import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, PageHeroComponent],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  protected lightboxSrc = signal<string | null>(null);
  protected lightboxAlt = signal<string>('');

  protected openLightbox(src: string, alt: string): void {
    this.lightboxSrc.set(src);
    this.lightboxAlt.set(alt);
  }

  protected closeLightbox(): void {
    this.lightboxSrc.set(null);
  }
}
