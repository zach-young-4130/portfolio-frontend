import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageHeroComponent } from '../../shared/components/page-hero/page-hero';
import { CodeSnippetComponent } from './code-snippet/code-snippet';

@Component({
  selector: 'app-code',
  standalone: true,
  imports: [PageHeroComponent, CodeSnippetComponent],
  templateUrl: './code.html',
  styleUrl: './code.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeComponent {}
