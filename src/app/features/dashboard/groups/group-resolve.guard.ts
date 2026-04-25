import {ResolveFn} from '@angular/router';
import {Group} from '../users/_schemas/user.schema';
import {EMPTY, Observable} from 'rxjs';
import {inject} from '@angular/core';
import {UsersService} from '../users/services/users.service';

export const groupResolve: ResolveFn<Group> = (route, state): Observable<Group> => {
  const usersService = inject(UsersService)

  const group_id = route.paramMap.get('id')

  if (!group_id) return EMPTY

  return usersService.getGroup(group_id)
}
