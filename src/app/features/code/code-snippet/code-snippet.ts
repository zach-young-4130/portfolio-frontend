import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  ViewEncapsulation,
  inject,
  input,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import hljs from 'highlight.js/lib/core';
import ruby from 'highlight.js/lib/languages/ruby';
import typescript from 'highlight.js/lib/languages/typescript';
import scss from 'highlight.js/lib/languages/scss';

hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('scss', scss);

let nextId = 0;

// View encapsulation is disabled so that .snippet rules can style the
// projected <h3>/<p>/<pre> elements (which retain their parent component's
// encapsulation attributes). Styles below are namespaced under .snippet to
// prevent leakage.
@Component({
  selector: 'app-code-snippet',
  standalone: true,
  templateUrl: './code-snippet.html',
  styleUrl: './code-snippet.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CodeSnippetComponent {
  readonly label = input.required<string>();

  private readonly platformId = inject(PLATFORM_ID);
  private readonly elementRef = inject(ElementRef);

  protected readonly expanded = signal(false);
  protected readonly bodyId = `code-snippet-body-${++nextId}`;

  // Held as TS constants because angle brackets inside a template interpolation
  // string literal get tokenized by Angular's HTML parser before the expression
  // is evaluated. Referencing properties keeps the source free of '<'/'>'.
  protected readonly closedLabel = '<code/>';
  protected readonly openLabel = '<code>';

  protected toggle(): void {
    this.expanded.update((v) => !v);
    if (this.expanded() && isPlatformBrowser(this.platformId)) {
      // Wait one macrotask so Angular flushes the @if block into the DOM
      // before highlight.js queries for the <pre><code> element.
      setTimeout(() => {
        const el = (this.elementRef.nativeElement as HTMLElement).querySelector('pre code');
        if (el && !el.classList.contains('hljs')) {
          hljs.highlightElement(el as HTMLElement);
        }
      });
    }
  }
}
