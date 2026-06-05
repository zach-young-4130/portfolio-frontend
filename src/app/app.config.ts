import {
  ApplicationConfig,
  ErrorHandler,
  PLATFORM_ID,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { ChunkLoadErrorHandler, CHUNK_RELOAD_FLAG } from './core/chunk-load-error.handler';
import { isPlatformBrowser } from '@angular/common';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { catchError, of } from 'rxjs';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthService } from './core/services/auth.service';
import { TokenService } from './core/services/token.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: ChunkLoadErrorHandler },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideClientHydration(withEventReplay()),
    // On browser bootstrap, restore the admin user from the stored JWT (if any)
    // so refreshes don't bounce the user back to /admin/login.
    provideAppInitializer(() => {
      if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
      // Reaching here means the app bootstrapped, so re-arm the chunk-reload guard.
      sessionStorage.removeItem(CHUNK_RELOAD_FLAG);
      if (!inject(TokenService).get()) return;
      return inject(AuthService).fetchCurrentUser().pipe(catchError(() => of(null)));
    }),
  ],
};
