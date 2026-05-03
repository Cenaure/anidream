import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import {AuthService} from '../auth/services/auth.service';
import {Router} from '@angular/router';
import {Route} from '../../shared/utils/paths';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router)

  return next(req.clone({ withCredentials: true })).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.setLoggedUser(null);
        router.navigateByUrl(Route.signIn)
      }

      return throwError(() => error);
    })
  );
};
