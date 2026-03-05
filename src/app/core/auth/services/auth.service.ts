import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, of, tap} from 'rxjs';
import {computed, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {AuthSchema} from '../_schemas/auth.schema';
import {MessageService} from '../../../shared/services/message.service';
import {ErrorService} from '../../../shared/utils/processError';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);
  private readonly errorService = inject(ErrorService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly _loggedUser = signal<string | null>(
    this.isBrowser ? localStorage.getItem("loggedUser") : null
  );

  private setLoggedUser(name: string | null) {
    if (this.isBrowser) {
      name
        ? localStorage.setItem('loggedUser', name)
        : localStorage.removeItem('loggedUser');
    }
    this._loggedUser.set(name);
  }

  // публичные для чтения
  readonly loggedUser = this._loggedUser.asReadonly();
  readonly isLoggedIn = computed(() => this._loggedUser() !== null);

  set token(token: string) {
    if (this.isBrowser) localStorage.setItem('token', token);
  }

  get token() {
    return this.isBrowser ? localStorage.getItem('token') ?? '' : '';
  }

  login(auth
        :
        AuthSchema
  ):
    Observable<boolean> {
    return this.http.post('http://localhost:8080/login', auth, {responseType: "text"})
      .pipe(
        tap(token => {
          this.token = token;
          this.setLoggedUser(auth.name)
          this.messageService.success("user " + auth.name + " is logged in");
        }),
        map(token => true),
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              return of(false);
            }
          }

          return this.errorService.processError(error);
        })
      )
  }

  logout(): Observable<boolean> {
    return this.http.get<void>(`http://localhost:8080/logout/${this.token}`).pipe(
      map(() => {
        this.setLoggedUser(null);
        if (this.isBrowser) localStorage.removeItem('token');
        this.messageService.success('Logged out');
        return true;
      }),
      catchError(error => {
        return this.errorService.processError(error);
      })
    );
  }
}
