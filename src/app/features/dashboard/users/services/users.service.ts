import {catchError, map, Observable} from 'rxjs';
import {UserSchema} from '../_schemas/user.schema';
import {HttpClient} from '@angular/common/http';
import {ErrorService} from '../../../../shared/utils/processError';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private readonly http: HttpClient,
    private readonly errorService: ErrorService
  ) {
  }

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

}
