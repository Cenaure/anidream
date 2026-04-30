import {Component, OnInit, signal} from '@angular/core';
import {GroupEditChild} from '../group-edit-child/group-edit-child';
import {Group} from '../../users/_schemas/user.schema';
import {ActivatedRoute, Router} from '@angular/router';
import {Route} from '../../../../shared/utils/paths';

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

  group = signal<Group>(new Group('', []))

  ngOnInit() {
    this.route.data.subscribe(data => {
      if(data['group']) this.group.set(data['group'])
    })
  }

  saved(savedGroup: Group) {
    console.log(savedGroup)
    this.router.navigateByUrl(Route.dashboardListGroups)
  }
}
