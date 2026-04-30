import {ResolveFn} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {inject} from '@angular/core';
import {UsersService} from '../users/services/users.service';
import {IGroup} from '../users/_schemas/user.schema';

export const groupResolve: ResolveFn<IGroup> = (route, state): Observable<IGroup> => {
  const usersService = inject(UsersService)

  const group_id = route.paramMap.get('id')

  if (!group_id) return EMPTY

  return usersService.getGroup(group_id)
}
