import {CanActivateFn, CanMatchFn, Router, UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './services/auth.service';
import {signInRoute} from '../../shared/utils/paths';

const internalGuard = (url: string): boolean | Promise<boolean> | UrlTree => {
  const authService = inject(AuthService)
  const router = inject(Router);

  if(authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree([signInRoute], {
    queryParams: {
      returnUrl: url
    }
  })
}

export const authGuard: CanActivateFn = (route, state) => {
  return internalGuard(state.url)
};

export const authMatchGuard: CanMatchFn = (route, segments) => {
  return internalGuard(route.path || '')
};
