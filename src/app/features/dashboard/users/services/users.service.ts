import {catchError, defaultIfEmpty, map, Observable, tap} from 'rxjs';
import {Group, UserSchema} from '../_schemas/user.schema';
import {HttpClient} from '@angular/common/http';
import {ErrorService} from '../../../../shared/utils/processError';
import {Injectable} from '@angular/core';
import {environment} from '../../../../../env/dev.env';
import {MessageService} from '../../../../shared/services/message.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  //region: ---constructor
  apiUrl = environment.apiUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly errorService: ErrorService,
    private readonly messageService: MessageService
  ) {}
  //endregion: ---constructor

  getUsers(): Observable<UserSchema[]> {
    return this.http.get<UserSchema[]>(`${this.apiUrl}/users`).pipe(
      map(jsonUsers => jsonUsers.map((u: UserSchema) => UserSchema.clone(u))),
      catchError(error => this.errorService.processError(error))
    );
  }

  getUser(id: number, token: string): Observable<UserSchema> {
    return this.http.get<UserSchema>(`${this.apiUrl}/user/${id}/${token}`).pipe(
      map(jsonUser => UserSchema.clone(jsonUser)),
      catchError(error => this.errorService.processError(error))
    )
  }

  getExtendedUsers(token: string): Observable<UserSchema[]> {
    console.log(token)
    return this.http.get<UserSchema[]>(`${this.apiUrl}/users/` + token).pipe(
      map(jsonUsers => jsonUsers.map(user => UserSchema.clone(user))),
      catchError(error => this.errorService.processError(error))
    );
  }

  saveUser(user: UserSchema, token: string): Observable<UserSchema> {
    return this.http.post<UserSchema>(`${this.apiUrl}/users/${token}`, user).pipe(
      map(jsonUser => UserSchema.clone(jsonUser)),
      catchError(error => this.errorService.processError(error)),
      tap(() => {
        this.messageService.success('User added/edited successfully.');
      }),
    )
  }

  deleteUser(id: number, token: string): Observable<boolean> {
    return this.http.delete<string[]>(`${this.apiUrl}/user/${id}/${token}`).pipe(
      map(() => {
        this.messageService.success('User deleted successfully.');
        return true
      }),
      catchError(error => {
        return this.errorService.processError(error);
      }),
      defaultIfEmpty(false)
    )
  }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/groups`).pipe(
      map(jsongroups => jsongroups.map(g => Group.clone(g))),
      catchError(error => {
        return this.errorService.processError(error);
      }),
    )
  }
}
