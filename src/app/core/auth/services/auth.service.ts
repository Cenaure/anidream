import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, of, tap} from 'rxjs';
import {computed, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {AuthSchema} from '../_schemas/auth.schema';
import {MessageService} from '../../../shared/services/message.service';
import {ErrorService} from '../../../shared/utils/processError';
import {isPlatformBrowser} from '@angular/common';
import {environment} from '../../../../env/dev.env';
import {UserSchema} from '../../../features/dashboard/users/_schemas/user.schema';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //region: ---constructor
  private readonly apiUrl = environment.apiUrl;

  private readonly http = inject(HttpClient);
  private readonly messageService = inject(MessageService);
  private readonly errorService = inject(ErrorService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  //endregion: ---constructor

  //region: ---Session Management
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

  // Public
  readonly loggedUser = this._loggedUser.asReadonly();
  readonly isLoggedIn = computed(() => this._loggedUser() !== null);

  set token(token: string) {
    if (this.isBrowser) { // @ts-ignore
      localStorage.setItem('token', token);
    }
  }

  get token() {
    // @ts-ignore
    return this.isBrowser ? localStorage.getItem('token') ?? '' : '';
  }
  //endregion: ---Session Management

  login(auth
        :
        AuthSchema
  ):
    Observable<boolean> {
    return this.http.post(`${this.apiUrl}/login`, auth, {responseType: "text"})
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

  sign_up(user: UserSchema): Observable<UserSchema> {
    return this.http.post<UserSchema>(`${this.apiUrl}/register`, user).pipe(
      tap(() => {
        this.messageService.success(`Welcome, ${user.name} you have been signed up successfully`);
      }),
      catchError(error => {
        return this.errorService.processError(error);
      })
    )
  }

  logout(): Observable<boolean> {
    return this.http.get<void>(`${this.apiUrl}/logout/${this.token}`).pipe(
      map(() => {
        this.setLoggedUser(null);
        if (this.isBrowser) { // @ts-ignore
          localStorage.removeItem('token');
        }
        this.messageService.success('Logged out');
        return true;
      }),
      catchError(error => {
        return this.errorService.processError(error);
      })
    );
  }
}
