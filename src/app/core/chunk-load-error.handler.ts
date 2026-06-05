import { ErrorHandler, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// Cleared on every successful bootstrap (see app.config.ts) so the one-shot
// reload re-arms for the next deployment.
export const CHUNK_RELOAD_FLAG = 'chunk-reload-attempted';

// A user with an old tab open across a deployment can hit a failed dynamic
// import when navigating to a lazy route whose chunk hash has changed. Reload
// once so the browser fetches the new manifest. Guarded by a session flag: if
// the chunk is genuinely missing, the reload won't help — so we reload at most
// once and then surface the error instead of looping forever.
@Injectable()
export class ChunkLoadErrorHandler implements ErrorHandler {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);
    const isChunkError =
      message.includes('Failed to fetch dynamically imported module') ||
      message.includes('Importing a module script failed');

    if (this.isBrowser && isChunkError && !sessionStorage.getItem(CHUNK_RELOAD_FLAG)) {
      sessionStorage.setItem(CHUNK_RELOAD_FLAG, '1');
      window.location.reload();
      return;
    }
    console.error(error);
  }
}
