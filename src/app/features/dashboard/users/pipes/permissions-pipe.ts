import {Pipe, PipeTransform} from '@angular/core';
import {IGroup} from '../../groups/_schemas/group.schema';

@Pipe({
  name: 'permissions',
})
export class PermissionsPipe implements PipeTransform {

  transform(groups: IGroup[], option?: string): string {
    if (option === 'permissions') {
      return Array.from(new Set(groups.map(g => g.permissions)
        .flat())).join(', ');
    } else {
      return groups.map(g => g.name).join(', ');
    }
  }

}
