import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero';

@Component({
  selector: 'app-code',
  standalone: true,
  imports: [PageHeroComponent],
  templateUrl: './code.html',
  styleUrl: './code.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeComponent {}
