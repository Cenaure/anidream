import { NgModule } from '@angular/core';
import {GroupsList} from './groups-list/groups-list';
import {RouterModule} from '@angular/router';



@NgModule({
  declarations: [],
  imports: [
    GroupsList,
    RouterModule.forChild([
      { path: '', component: GroupsList},
    ])
  ],
  exports: [GroupsList]
})
export class GroupsModule {

}
