import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, of, tap} from 'rxjs';
import {computed, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {MessageService} from '../../../shared/services/message.service';
import {ErrorService} from '../../../shared/utils/processError';
import {isPlatformBrowser} from '@angular/common';
import {environment} from '../../../../env/dev.env';

//region: ---DTOs
export interface SignInDTO {
  username_or_email: string;
  password: string;
}

export interface SignUpDTO {
  username: string;
  email: string;
  password: string;
}

export interface UserDTO {
  id?: string;
  username: string;
  email: string;
  groups: string[];
  last_login?: string;
}
//endregion: ---DTOs

// AuthService Based on rust-server repo

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
  // Only needed to have isLoggedIn, session is stored at http-only cookie
  private readonly _loggedUser = signal<string | null>(
    this.isBrowser ? localStorage.getItem('loggedUser') : null
  );

  private setLoggedUser(name: string | null) {
    if (this.isBrowser) {
      name
        ? localStorage.setItem('loggedUser', name)
        : localStorage.removeItem('loggedUser');
    }
    this._loggedUser.set(name);
  }

  readonly loggedUser = this._loggedUser.asReadonly();
  readonly isLoggedIn = computed(() => this._loggedUser() !== null);
  //endregion: ---Session Management

  //region: ---Auth
  signIn(dto: SignInDTO): Observable<boolean> {
    return this.http.post<void>(
      `${this.apiUrl}/auth/sign-in`,
      dto,
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this.setLoggedUser(dto.username_or_email);
        this.messageService.success(`Welcome back, ${dto.username_or_email}`);
      }),
      map(() => true),
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return of(false);
        }
        return this.errorService.processError(error);
      })
    );
  }

  signUp(dto: SignUpDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(
      `${this.apiUrl}/auth/sign-up`,
      dto,
      { withCredentials: true }
    ).pipe(
      tap(user => {
        this.setLoggedUser(user.username);
        this.messageService.success(`Welcome, ${user.username}!`);
      }),
      catchError(error => this.errorService.processError(error))
    );
  }

  logout(): Observable<boolean> {
    return this.http.get<void>(
      `${this.apiUrl}/auth/logout`,
      { withCredentials: true }
    ).pipe(
      map(() => {
        this.setLoggedUser(null);
        this.messageService.success('Logged out');
        return true;
      }),
      catchError(error => this.errorService.processError(error))
    );
  }
  //endregion: ---Auth
}
