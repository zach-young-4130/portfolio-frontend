import { ErrorHandler, Injectable } from '@angular/core';

// After a new Vercel deployment, old chunk filenames no longer exist. Any user
// with the previous HTML still open will hit a failed dynamic import when they
// navigate to a lazy-loaded route. Detect that case and force a full reload so
// the browser fetches the new HTML and updated chunk manifest.
@Injectable()
export class ChunkLoadErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('Failed to fetch dynamically imported module') ||
        message.includes('Importing a module script failed')) {
      window.location.reload();
      return;
    }
    console.error(error);
  }
}
