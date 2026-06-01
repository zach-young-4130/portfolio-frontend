import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [PageHeroComponent],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {
  constructor() {
    inject(SeoService).set({
      title: 'Experience',
      description: 'A decade of full-stack engineering across ag-tech, e-commerce, ed-tech, fin-tech, and AI. Senior Software Engineer at Codefi Works and Code Labs Instructor.',
    });
  }
}
