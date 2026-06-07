import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-page-hero',
  standalone: true,
  imports: [],
  templateUrl: './page-hero.html',
  styleUrl: './page-hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeroComponent {
  title = input.required<string>();
  subtitle = input<string>('');
  eyebrow = input<string>('');
  // Retained for caller compatibility; the editorial header no longer renders a
  // background photo.
  image = input<string>('sub-hero.jpg');
}
