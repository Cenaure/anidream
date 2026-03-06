import {catchError, defaultIfEmpty, map, Observable} from 'rxjs';
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
  apiUrl = environment.apiUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly errorService: ErrorService,
    private readonly messageService: MessageService
  ) {}

  getUsers()
    :
    Observable<UserSchema[]> {
    return this.http.get<UserSchema[]>('http://localhost:8080/users').pipe(
      map(jsonUsers => jsonUsers.map((u: UserSchema) => UserSchema.clone(u))),
      catchError(error => this.errorService.processError(error))
    );
  }

  getExtendedUsers(token: string): Observable<UserSchema[]> {
    console.log(token)
    return this.http.get<UserSchema[]>(`http://localhost:8080/users/` + token).pipe(
      map(jsonUsers => jsonUsers.map(user => UserSchema.clone(user))),
      catchError(error => this.errorService.processError(error))
    );
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
