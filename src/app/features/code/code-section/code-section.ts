import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-code-section',
  standalone: true,
  templateUrl: './code-section.html',
  styleUrl: './code-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeSectionComponent {
  readonly heading = input.required<string>();

  protected readonly expanded = signal(true);
  protected readonly bodyId = `code-section-body-${++nextId}`;

  protected toggle(): void {
    this.expanded.update((v) => !v);
  }
}
