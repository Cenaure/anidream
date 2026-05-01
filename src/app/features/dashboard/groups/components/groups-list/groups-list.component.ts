import {Component, inject, OnInit, signal} from '@angular/core';
import {GroupsQuery, UsersService} from '../../../users/services/users.service';
import {
  ColumnDef,
} from '@tanstack/angular-table';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {phosphorPencilSimple, phosphorTrash} from '@ng-icons/phosphor-icons/regular';
import {Router} from '@angular/router';
import {Route} from '../../../../../shared/utils/paths';
import {
  TableFilterEvent,
  TablePageEvent, TableSortEvent,
  TanstackTableComponent
} from '../../../../../shared/components/tanstack-table/tanstack-table.component';
import {IGroup} from '../../_schemas/group.schema';
import {AlertComponent} from '../../../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-groups-list',
  imports: [
    NgIcon,
    TanstackTableComponent,
    AlertComponent
  ],
  providers: [provideIcons({phosphorPencilSimple, phosphorTrash})],
  templateUrl: './groups-list.component.html',
})
export class GroupsListComponent implements OnInit {
  //region: ---injections
  protected readonly usersService = inject(UsersService)
  protected readonly router = inject(Router)
  //endregion: ---injections

  protected groups = signal<IGroup[]>([])

  protected totalRows = signal(0);

  protected query = signal<GroupsQuery>({
    page: 1,
    perPage: 10,
    search: '',
    sortColumn: '',
    sortDirection: '',
  });

  protected readonly columns: ColumnDef<IGroup>[] = [
    {
      accessorKey: 'id',
      id: 'id',
      enableSorting: false,
    },
    {
      accessorKey: 'name',
      id: 'name',
      header: 'Group Name',
      enableSorting: true,
      cell: (info) => info.getValue<string>(),
    },
    {
      accessorKey: 'permissions',
      id: 'permissions',
      header: 'Group Permissions',
      enableSorting: false,
      cell: (info) => info.getValue<string>(),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => null,
    },
  ];

  //region: ---table events
  onPageChange(event: TablePageEvent) {
    this.query.update((q) => ({ ...q, page: event.pageIndex + 1 }));
    this.loadGroups();
  }

  onFilterChange(event: TableFilterEvent) {
    console.log(event)
    this.query.update((q) => ({ ...q, search: event.value, page: 1 }));
    this.loadGroups();
  }

  onSortChange(event: TableSortEvent) {
    this.query.update((q) => ({
      ...q,
      sortColumn: event.column,
      sortDirection: event.direction,
      page: 1,
    }));
    this.loadGroups();
  }
  //endregion: ---table events

  private loadGroups() {
    const q = this.query();
    this.usersService.getGroups(q).subscribe({
      next: res => {
        this.groups.set(res.data)
        this.totalRows.set(res.pagination.items.total);
      },
      error: (err) => console.error('error:', err),
    })
  }

  protected deleteGroup(group: IGroup): void {
    this.usersService.deleteGroup(group.id || "").subscribe(success => {
      if(success) this.loadGroups()
    })
  }

  ngOnInit() {
    this.loadGroups();
  }

  protected routeToEditPage(id: string) {
    this.router.navigateByUrl(Route.dashboardEditGroup(id))
  }
}
