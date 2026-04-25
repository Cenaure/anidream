import { catchError, defaultIfEmpty, map, Observable, tap } from 'rxjs';
import { Group, UserSchema } from '../_schemas/user.schema';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../../../../shared/utils/processError';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../env/dev.env';
import { MessageService } from '../../../../shared/services/message.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorService);
  private readonly messageService = inject(MessageService);

  //region: ---Users
  getUsers(): Observable<UserSchema[]> {
    return this.http.get<UserSchema[]>(`${this.apiUrl}/users/`).pipe(
      map(users => users.map(u => UserSchema.clone(u))),
      catchError(error => this.errorService.processError(error))
    );
  }

  getUser(id: string): Observable<UserSchema> {
    return this.http.get<UserSchema>(`${this.apiUrl}/users/${id}`).pipe(
      map(u => UserSchema.clone(u)),
      catchError(error => this.errorService.processError(error))
    );
  }

  saveUser(user: UserSchema): Observable<UserSchema> {
    if (user.id) {
      // Edit
      return this.http.patch<UserSchema>(`${this.apiUrl}/users/${user.id}`, user).pipe(
        map(u => UserSchema.clone(u)),
        tap(() => this.messageService.success('User updated successfully.')),
        catchError(error => this.errorService.processError(error))
      );
    } else {
      // Create
      return this.http.post<UserSchema>(`${this.apiUrl}/users/`, user).pipe(
        map(u => UserSchema.clone(u)),
        tap(() => this.messageService.success('User created successfully.')),
        catchError(error => this.errorService.processError(error))
      );
    }
  }

  deleteUser(id: string): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`).pipe(
      map(() => {
        this.messageService.success('User deleted successfully.');
        return true;
      }),
      catchError(error => this.errorService.processError(error)),
      defaultIfEmpty(false)
    );
  }
  //endregion: ---Users

  //region: ---Groups
  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/groups/`).pipe(
      map(groups => groups.map(g => Group.clone(g))),
      catchError(error => this.errorService.processError(error))
    );
  }

  getGroup(id: string): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/groups/${id}`).pipe(
      map(g => Group.clone(g)),
      catchError(error => this.errorService.processError(error))
    );
  }

  saveGroup(group: Group): Observable<Group> {
    if (group.id) {
      // Edit
      return this.http.patch<Group>(`${this.apiUrl}/groups/${group.id}`, group).pipe(
        map(g => Group.clone(g)),
        tap(() => this.messageService.success('Group updated successfully.')),
        catchError(error => this.errorService.processError(error))
      );
    } else {
      // Create
      return this.http.post<Group>(`${this.apiUrl}/groups/`, group).pipe(
        map(g => Group.clone(g)),
        tap(() => this.messageService.success('Group created successfully.')),
        catchError(error => this.errorService.processError(error))
      );
    }
  }

  deleteGroup(id: string): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/groups/${id}`).pipe(
      map(() => {
        this.messageService.success('Group deleted successfully.');
        return true;
      }),
      catchError(error => this.errorService.processError(error)),
      defaultIfEmpty(false)
    );
  }
  //endregion: ---Groups
}
