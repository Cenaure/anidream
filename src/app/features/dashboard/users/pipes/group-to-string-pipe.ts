import { Pipe, PipeTransform } from '@angular/core';
import {Group} from '../_schemas/user.schema';

@Pipe({
  name: 'groupToString',
})
export class GroupToStringPipe implements PipeTransform {

  transform(groups: Group[], option?: string): string {
    if(option === 'permissions') {
      return "prava"
    } else {
      return groups.map(g => g.name).join(', ');

    }
  }

}
