import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.siteUrl;
const DEFAULT_IMAGE = `${BASE_URL}/profile.png`;

export interface SeoConfig {
  title: string;
  description: string;
  image?: string;
  jsonLd?: object;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private titleService = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);
  private doc = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  set(config: SeoConfig): void {
    const fullTitle = `${config.title} | Zach Young`;
    const image = config.image ?? DEFAULT_IMAGE;
    const url = `${BASE_URL}${this.router.url.split('?')[0]}`;

    this.titleService.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    this.setCanonical(url);

    if (config.jsonLd) {
      this.setJsonLd(config.jsonLd);
    } else {
      this.clearJsonLd();
    }
  }

  private setCanonical(url: string): void {
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(data: object): void {
    const id = 'json-ld-schema';
    let script = this.doc.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.doc.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.text = JSON.stringify(data);
  }

  private clearJsonLd(): void {
    this.doc.getElementById('json-ld-schema')?.remove();
  }
}
