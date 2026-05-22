import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [PageHeroComponent],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienceComponent {}
