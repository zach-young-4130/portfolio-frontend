import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectsService } from '../../core/services/projects.service';
import { FaqService } from '../../core/services/faq.service';
import { CommunityService } from '../../core/services/community.service';
import { Project } from '../../core/models/project.model';
import { FaqItem } from '../../core/models/faq-item.model';
import { CommunityItem } from '../../core/models/community-item.model';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card';
import { ContactFormComponent } from '../../shared/components/contact-form/contact-form';
import { ParallaxDirective } from '../../shared/directives/parallax.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    NgbAccordionModule,
    ProjectCardComponent,
    ContactFormComponent,
    ParallaxDirective,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  private faqService = inject(FaqService);
  private communityService = inject(CommunityService);
  private destroyRef = inject(DestroyRef);

  protected projects = signal<Project[]>([]);
  protected faqItems = signal<FaqItem[]>([]);
  protected communityItems = signal<CommunityItem[]>([]);

  protected featured = computed(() => this.projects().filter((p) => p.featured).slice(0, 3));
  protected topFaqs = computed(() => this.faqItems().slice(0, 3));
  protected topCommunity = computed(() => this.communityItems().slice(0, 4));

  ngOnInit(): void {
    this.projectsService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.projects.set(res.projects));
    this.faqService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.faqItems.set(res.faq_items));
    this.communityService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => this.communityItems.set(res.community_items));
  }
}
