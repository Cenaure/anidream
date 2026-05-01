import {Component, OnInit, signal} from '@angular/core';
import {GroupEditChildComponent} from '../group-edit-child/group-edit-child.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Route} from '../../../../../shared/utils/paths';
import {IGroup} from '../../_schemas/group.schema';

@Component({
  selector: 'app-group-edit',
  imports: [
    GroupEditChildComponent
  ],
  templateUrl: './group-edit.component.html',
})
export class GroupEditComponent implements OnInit {
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
