import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Allows access only to authenticated admin users. Unauthenticated visitors
// bounce to /admin/login; signed-in non-admins bounce to the home page so
// they don't sit in a permission limbo.
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) return router.createUrlTree(['/admin/login']);
  if (!auth.isAdmin()) return router.createUrlTree(['/']);
  return true;
};
