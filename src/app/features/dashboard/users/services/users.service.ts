import { catchError, defaultIfEmpty, map, Observable, tap } from 'rxjs';
import {IGroup, IUser, mapGroup, mapUser} from '../_schemas/user.schema';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../../../../shared/utils/processError';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../env/dev.env';
import { MessageService } from '../../../../shared/services/message.service';
import {Pagination} from '../../../../shared/services/_schema/pagination.schema';

export interface GetUsersDto {
  data: IUser[],
  pagination: Pagination
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorService);
  private readonly messageService = inject(MessageService);

  //region: ---Users
  getUsers(): Observable<GetUsersDto> {
    return this.http.get<GetUsersDto>(`${this.apiUrl}/users/`).pipe(
      map(res => ({
        data: res.data.map(u => mapUser(u)),
        pagination: res.pagination
      })),
      catchError(error => this.errorService.processError(error))
    );
  }

  getUser(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}/users/${id}`).pipe(
      map(u => mapUser(u)),
      catchError(error => this.errorService.processError(error))
    );
  }

  saveUser(user: IUser): Observable<IUser> {
    if (user.id) {
      // Edit
      return this.http.patch<IUser>(`${this.apiUrl}/users/${user.id}`, user).pipe(
        map(u => mapUser(u)),
        tap(() => this.messageService.success('User updated successfully.')),
        catchError(error => this.errorService.processError(error))
      );
    } else {
      // Create
      return this.http.post<IUser>(`${this.apiUrl}/users/`, user).pipe(
        map(u => mapUser(u)),
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
  getGroups(): Observable<IGroup[]> {
    return this.http.get<IGroup[]>(`${this.apiUrl}/groups/`).pipe(
      map(groups => groups.map(g => mapGroup(g))),
      catchError(error => this.errorService.processError(error))
    );
  }

  getGroup(id: string): Observable<IGroup> {
    return this.http.get<IGroup>(`${this.apiUrl}/groups/${id}`).pipe(
      map(g => mapGroup(g)),
      catchError(error => this.errorService.processError(error))
    );
  }

  saveGroup(group: IGroup): Observable<IGroup> {
    if (group.id) {
      // Edit
      return this.http.patch<IGroup>(`${this.apiUrl}/groups/${group.id}`, group).pipe(
        map(g => mapGroup(g)),
        tap(() => this.messageService.success('Group updated successfully.')),
        catchError(error => this.errorService.processError(error))
      );
    } else {
      // Create
      return this.http.post<IGroup>(`${this.apiUrl}/groups/`, group).pipe(
        map(g => mapGroup(g)),
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
