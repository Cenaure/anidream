import { Pipe, PipeTransform } from '@angular/core';
import {IGroup} from '../../groups/_schemas/group.schema';

@Pipe({
  name: 'groupToString',
})
export class GroupToStringPipe implements PipeTransform {
  transform(groups: IGroup[], option?: string): string {
    if(option === 'permissions') {
      return "prava"
    } else {
      return groups.map(g => g.name).join(', ');

    }
  }
}
