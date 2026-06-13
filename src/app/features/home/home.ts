import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  PLATFORM_ID,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsService } from '../../core/services/projects.service';
import { FaqService } from '../../core/services/faq.service';
import { SeoService } from '../../core/services/seo.service';
import { Project } from '../../core/models/project.model';
import { FaqItem } from '../../core/models/faq-item.model';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card';
import { ContactFormComponent } from '../../shared/components/contact-form/contact-form';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    NgbAccordionModule,
    ProjectCardComponent,
    ContactFormComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  private faqService = inject(FaqService);
  private seoService = inject(SeoService);
  private destroyRef = inject(DestroyRef);
  private platformId = inject(PLATFORM_ID);

  protected scrollToContent(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const next = document.querySelector('.hero')?.nextElementSibling as HTMLElement | null;
    if (!next) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    next.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  constructor() {
    this.seoService.set({
      title: 'Zach Young — Full-Stack Software Engineer',
      description: 'Senior full-stack engineer with 10+ years shipping production applications across ag-tech, e-commerce, ed-tech, fin-tech, and AI. Specializing in Ruby on Rails and Angular.',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Zach Young',
        jobTitle: 'Senior Full-Stack Software Engineer',
        url: environment.siteUrl,
        image: `${environment.siteUrl}/profile.png`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Cape Girardeau',
          addressRegion: 'MO',
          addressCountry: 'US',
        },
        knowsAbout: ['Ruby on Rails', 'Angular', 'TypeScript', 'JavaScript', 'PostgreSQL', 'Hotwire', 'Turbo', 'Stimulus', 'Node.js'],
        alumniOf: 'Southeast Missouri State University',
        award: ['2× National Champion — Paratriathlon', '3rd Place — ITU World Championship, Edmonton, Canada'],
      },
    });
  }

  protected projects = signal<Project[]>([]);
  protected faqItems = signal<FaqItem[]>([]);

  protected featured = computed(() => this.projects().filter((p) => p.featured).slice(0, 3));
  protected topFaqs = computed(() => this.faqItems().slice(0, 3));

  ngOnInit(): void {
    this.projectsService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.projects.set(res.projects));
    this.faqService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => this.faqItems.set(items));
  }
}
