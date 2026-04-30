import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, of, tap} from 'rxjs';
import {computed, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {MessageService} from '../../../shared/services/message.service';
import {ErrorService} from '../../../shared/utils/processError';
import {isPlatformBrowser} from '@angular/common';
import {environment} from '../../../../env/dev.env';
import {IUserSession} from '../_schemas/session.schema';
import {IGroup} from '../../../features/dashboard/users/_schemas/user.schema';

//region: ---DTOs
export interface SignInDto {
  username_or_email: string;
  password: string;
}

export interface SignUpDto {
  username: string;
  email: string;
  password: string;
}

export interface UserDto {
  id?: string;
  username: string;
  email: string;
  groups: IGroup[];
  last_login?: Date;
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
  private readonly _loggedUser = signal<IUserSession | null>(
    this.isBrowser ? this.loadSessionFromStorage() : null
  );

  private loadSessionFromStorage(): IUserSession | null {
    const raw = localStorage.getItem('loggedUser');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as IUserSession;
    } catch {
      localStorage.removeItem('loggedUser');
      return null;
    }
  }

  setLoggedUser(user: IUserSession | null) {
    if (this.isBrowser) {
      user
        ? localStorage.setItem('loggedUser', JSON.stringify(user))
        : localStorage.removeItem('loggedUser');
    }
    this._loggedUser.set(user);
  }

  readonly loggedUser = this._loggedUser.asReadonly();
  readonly isLoggedIn = computed(() => this._loggedUser() !== null);
  //endregion: ---Session Management

  //region: ---Auth
  signIn(dto: SignInDto): Observable<boolean> {
    return this.http.post<IUserSession>(
      `${this.apiUrl}/auth/sign-in`,
      dto,
      { withCredentials: true }
    ).pipe(
      tap(user => {
        this.setLoggedUser(user);
        this.messageService.success(`Welcome back, ${user.username}`);
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

  signUp(dto: SignUpDto): Observable<UserDto> {
    return this.http.post<UserDto>(
      `${this.apiUrl}/auth/sign-up`,
      dto,
      { withCredentials: true }
    ).pipe(
      tap(user => {
        this.setLoggedUser(user);
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
