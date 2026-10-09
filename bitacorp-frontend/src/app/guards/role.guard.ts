import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const token = inject(TokenService);
  const router = inject(Router);
  const user = token.getUser();

  if (!user || !token.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const allowed = route.data?.['roles'] as string[] | undefined;
  const role = (user.role || '').toUpperCase();
  if (allowed && allowed.length > 0 && !allowed.includes(role)) {
    if (role === 'ENCARGADO') router.navigate(['/managers']);
    else if (role === 'ADMINISTRADOR') router.navigate(['/administrators']);
    else router.navigate(['/whistleblowers']);
    return false;
  }
  return true;
};