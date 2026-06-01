import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero';
import { CodeSnippetComponent } from './code-snippet/code-snippet';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-code',
  standalone: true,
  imports: [PageHeroComponent, CodeSnippetComponent],
  templateUrl: './code.html',
  styleUrl: './code.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeComponent {
  constructor() {
    inject(SeoService).set({
      title: 'Under the Hood',
      description: 'Architectural patterns, code snippets, and engineering decisions from a senior full-stack engineer — Rails 8, Angular 21, auth, accessibility, N+1 prevention, and more.',
    });
  }
}
