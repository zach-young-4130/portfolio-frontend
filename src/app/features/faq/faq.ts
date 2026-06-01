import { Component, ChangeDetectionStrategy, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FaqService } from '../../core/services/faq.service';
import { SeoService } from '../../core/services/seo.service';
import { FaqItem } from '../../core/models/faq-item.model';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [NgbAccordionModule, PageHeroComponent],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqComponent implements OnInit {
  private faqService = inject(FaqService);
  private destroyRef = inject(DestroyRef);

  protected items = signal<FaqItem[]>([]);
  protected loading = signal(true);

  constructor() {
    inject(SeoService).set({
      title: 'FAQ',
      description: 'Common questions about stack, availability, experience, and approach to software engineering — answered by Zach Young, senior full-stack engineer.',
    });
  }

  ngOnInit(): void {
    this.faqService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.items.set(items);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
