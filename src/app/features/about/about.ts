import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, PageHeroComponent],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  constructor() {
    inject(SeoService).set({
      title: 'About Zach Young',
      description: 'Senior full-stack engineer based in Cape Girardeau, Missouri. 10+ years of professional experience, 2× Paratriathlon National Champion, and USA representative at the ITU World Championship.',
    });
  }

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
