import {Component, OnInit, signal} from '@angular/core';
import {GroupEditChild} from '../group-edit-child/group-edit-child';
import {ActivatedRoute, Router} from '@angular/router';
import {Route} from '../../../../shared/utils/paths';
import {IGroup} from '../../users/_schemas/user.schema';

@Component({
  selector: 'app-group-edit',
  imports: [
    GroupEditChild
  ],
  templateUrl: './group-edit.html',
})
export class GroupEdit implements OnInit {
  //region: ---constructor
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}
  //endregion: ---constructor

  group = signal<IGroup>({
    id: '',
    name: '',
    permissions: [],
  })

  ngOnInit() {
    this.route.data.subscribe(data => {
      if(data['group']) this.group.set(data['group'])
    })
  }

  saved(savedGroup: IGroup) {
    console.log(savedGroup)
    this.router.navigateByUrl(Route.dashboardListGroups)
  }
}
