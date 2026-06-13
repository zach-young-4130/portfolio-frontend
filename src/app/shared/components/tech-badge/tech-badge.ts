import { Component, ChangeDetectionStrategy, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { Technology } from '../../../core/models/technology.model';

@Component({
  selector: 'app-tech-badge',
  standalone: true,
  imports: [NgClass],
  templateUrl: './tech-badge.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechBadgeComponent {
  tech = input.required<Technology>();

  // Maps the technology category to its badge edge-color modifier class.
  // Unknown/null categories fall back to the neutral `--other` edge.
  protected categoryClass = computed(() => `tech-badge--${this.tech().category ?? 'other'}`);
}
