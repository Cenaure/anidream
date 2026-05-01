import {Component, signal, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {phosphorCaretDown, phosphorPencilSimple, phosphorTrash} from '@ng-icons/phosphor-icons/regular';
import {BrnSelectImports} from '@spartan-ng/brain/select';
import {HlmButtonImports} from '@spartan-ng/helm/button';
import {HlmIconImports} from '@spartan-ng/helm/icon';
import {
  type ColumnDef,
} from '@tanstack/angular-table';
import {IUser} from './_schemas/user.schema';
import {UsersQuery, UsersService} from './services/users.service';
import {AuthService} from '../../../core/auth/services/auth.service';
import {GroupToStringPipe} from './pipes/group-to-string-pipe';
import {PermissionsPipe} from './pipes/permissions-pipe';
import {AlertComponent} from '../../../shared/components/alert/alert.component';
import {Router, RouterLink} from '@angular/router';

import {Route} from '../../../shared/utils/paths';
import {
  TableFilterEvent, TablePageEvent, TableSortEvent,
  TanstackTableComponent
} from '../../../shared/components/tanstack-table/tanstack-table.component';
import {IGroup} from '../groups/_schemas/group.schema';

@Component({
  selector: 'app-users',
  imports: [
    FormsModule,
    HlmButtonImports,
    NgIcon,
    HlmIconImports,
    BrnSelectImports,
    AlertComponent,
    RouterLink,
    TanstackTableComponent,
  ],
  providers: [provideIcons({phosphorCaretDown, phosphorPencilSimple, phosphorTrash}), GroupToStringPipe, PermissionsPipe],
  host: {class: 'w-full'},
  templateUrl: './users-page.component.html',
  standalone: true
})
export class UsersPageComponent implements OnInit {
  private readonly groupsToStringPipe = inject(GroupToStringPipe)
  private readonly usersService = inject(UsersService);
  private readonly authService = inject(AuthService);
  private readonly permissionsPipe = inject(PermissionsPipe);
  private readonly router = inject(Router)

  protected readonly dashboardEditUserRoute = Route.dashboardEditUser;

  protected readonly users = signal<IUser[]>([]);
  protected readonly groups = signal<IGroup[]>([]);
  protected totalRows = signal(0);

  query = signal<UsersQuery>({
    page: 1,
    perPage: 10,
    search: '',
    sortColumn: '',
    sortDirection: '',
  });

  protected readonly columns: ColumnDef<IUser>[] = [
    {
      accessorKey: 'id',
      id: 'id',
      header: 'ID',
      enableSorting: false,
      cell: (info) => `<span>${info.getValue<number>() ?? '—'}</span>`,
    },
    {
      accessorKey: 'username',
      id: 'username',
      header: 'Username',
      enableSorting: true,
      cell: (info) => `<span>${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'email',
      id: 'email',
      header: 'Email',
      enableSorting: true,
      cell: (info) => `<div class="lowercase">${info.getValue<string>()}</div>`,
    },
    {
      accessorKey: 'last_login',
      id: 'last_login',
      header: 'Last Login',
      enableSorting: true,
      cell: (info) => {
        return `<span>${info.getValue<Date>() ? info.getValue<Date>().toLocaleString() : '—'}</span>`;
      },
    },
    {
      accessorKey: 'groups',
      id: 'groups',
      header: 'User Groups',
      enableSorting: false,
      cell: (info) => {
        const groupIds = info.getValue<string[]>();

        const foundGroups = this.groups().filter(group =>
          groupIds.some(id => id === group.id)
        );

        return `<span>${this.groupsToStringPipe.transform(foundGroups) || '—'}</span>`
      },
    },
    {
      accessorKey: 'groups',
      id: 'permissions',
      header: 'User Permissions',
      enableSorting: false,
      cell: (info) => {
        const groupIds = info.getValue<string[]>();

        const foundGroups = this.groups().filter(group =>
          groupIds.some(id => id === group.id)
        );

        return `<span>${this.permissionsPipe.transform(foundGroups, 'permissions') || "—"}</span>`;
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => null,
    },
  ];

  ngOnInit(): void {
    this.usersService.getGroups({
      page: 1,
      perPage: 1000
    }).subscribe(res => this.groups.set(res.data));
    this.loadUsers()
  }

  onPageChange(event: TablePageEvent) {
    this.query.update((q) => ({ ...q, page: event.pageIndex + 1 }));
    this.loadUsers();
  }

  onFilterChange(event: TableFilterEvent) {
    this.query.update((q) => ({ ...q, search: event.value, page: 1 }));
    this.loadUsers();
  }

  onSortChange(event: TableSortEvent) {
    this.query.update((q) => ({
      ...q,
      sortColumn: event.column,
      sortDirection: event.direction,
      page: 1,
    }));
    this.loadUsers();
  }

  private loadUsers() {
    const q = this.query();
    this.usersService.getUsers(q).subscribe({
      next: res => {
        this.users.set(res.data);
        this.totalRows.set(res.pagination.items.total);
      },
      error: (err) => console.error('error:', err),
    });
  }

  protected deleteUser(user: IUser): void {
    console.log('delete', user);
    // const token = this.authService.token;
    this.usersService.deleteUser(user.id || "").subscribe(success => {
        if(success) this.loadUsers()
    })
  }

  hrefToEditPage(id: string) {
    this.router.navigateByUrl(this.dashboardEditUserRoute(id));
  }

  protected readonly dashboardCreateUserRoute = Route.dashboardNewUser();
}
