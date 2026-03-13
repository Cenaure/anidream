import {Component, OnInit, signal} from '@angular/core';
import {UsersService} from '../../users/services/users.service';
import {Group} from '../../users/_schemas/user.schema';

@Component({
  selector: 'app-groups-list',
  imports: [],
  templateUrl: './groups-list.html',
})
export class GroupsList implements OnInit {
  constructor(
    private readonly usersService: UsersService
  ) {
  }

  groupsLoaded = signal<Group[] | undefined>(undefined)

  ngOnInit() {
    this.usersService.getGroups().subscribe(
      groups => {
        this.groupsLoaded.set(groups)
      }
    )
  }
}
