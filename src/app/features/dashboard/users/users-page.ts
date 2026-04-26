import {Component, signal, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {lucideChevronDown} from '@ng-icons/lucide';
import {BrnSelectImports} from '@spartan-ng/brain/select';
import {HlmButtonImports} from '@spartan-ng/helm/button';
import {HlmDropdownMenuImports} from '@spartan-ng/helm/dropdown-menu';
import {HlmIconImports} from '@spartan-ng/helm/icon';
import {HlmInputImports} from '@spartan-ng/helm/input';
import {HlmTableImports} from '@spartan-ng/helm/table';
import {hlmMuted} from '@spartan-ng/helm/typography';
import {
  type ColumnDef,
  type ColumnFiltersState,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/angular-table';
import {Group, UserSchema} from './_schemas/user.schema';
import {UsersService} from './services/users.service';
import {AuthService} from '../../../core/auth/services/auth.service';
import {GroupToStringPipe} from './pipes/group-to-string-pipe';
import {PermissionsPipe} from './pipes/permissions-pipe';
import {AlertComponent} from '../../../shared/components/alert/alert.component';
import {Router, RouterLink} from '@angular/router';
import {LucideAngularModule, SquarePenIcon} from 'lucide-angular';
import {dashboardCreateUserRoute, dashboardEditUserRoute} from '../../../shared/utils/paths';

@Component({
  selector: 'app-users',
  imports: [
    FlexRenderDirective,
    FormsModule,
    HlmDropdownMenuImports,
    HlmButtonImports,
    NgIcon,
    HlmIconImports,
    HlmInputImports,
    BrnSelectImports,
    HlmTableImports,
    AlertComponent,
    RouterLink,
    LucideAngularModule,
  ],
  providers: [provideIcons({lucideChevronDown}), GroupToStringPipe, PermissionsPipe],
  host: {class: 'w-full'},
  templateUrl: './users-page.html',
  standalone: true
})
export class UsersPage implements OnInit {
  readonly squarePenIcon = SquarePenIcon
  private readonly groupsToStringPipe = inject(GroupToStringPipe)
  private readonly usersService = inject(UsersService);
  private readonly authService = inject(AuthService);
  private readonly permissionsPipe = inject(PermissionsPipe);
  private readonly router = inject(Router)
  protected readonly dashboardEditUserRoute = dashboardEditUserRoute;

  protected readonly _users = signal<UserSchema[]>([]);

  protected readonly _columns: ColumnDef<UserSchema>[] = [
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
        const groups = info.getValue<Group[]>()
        return `<span>${this.groupsToStringPipe.transform(groups) ?? '—'}</span>`
      },
    },
    {
      accessorKey: 'groups', // ← тоже groups, не permissions
      id: 'permissions',
      header: 'User Permissions',
      enableSorting: false,
      cell: (info) => {
        const groups = info.getValue<Group[]>();
        return `<span>${this.permissionsPipe.transform(groups, 'permissions')}</span>`;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => null,
    },
  ];

  private readonly _columnFilters = signal<ColumnFiltersState>([]);
  private readonly _sorting = signal<SortingState>([]);
  private readonly _rowSelection = signal<RowSelectionState>({});
  private readonly _columnVisibility = signal<VisibilityState>({
    lastLogin: this.authService.isLoggedIn()
  });

  protected readonly _table = createAngularTable<UserSchema>(() => ({
    data: this._users(),
    columns: this._columns,
    enableSorting: true,
    onSortingChange: (updater) => {
      updater instanceof Function ? this._sorting.update(updater) : this._sorting.set(updater);
    },
    onColumnFiltersChange: (updater) => {
      updater instanceof Function ? this._columnFilters.update(updater) : this._columnFilters.set(updater);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: (updater) => {
      updater instanceof Function ? this._columnVisibility.update(updater) : this._columnVisibility.set(updater);
    },
    onRowSelectionChange: (updater) => {
      updater instanceof Function ? this._rowSelection.update(updater) : this._rowSelection.set(updater);
    },
    state: {
      sorting: this._sorting(),
      columnFilters: this._columnFilters(),
      columnVisibility: this._columnVisibility(),
      rowSelection: this._rowSelection(),
    },
    initialState: {
      pagination: { pageSize: 10 }
    }
  }));

  protected readonly _hidableColumns = this._table.getAllColumns().filter((c) => c.getCanHide());
  protected readonly _hlmMuted = hlmMuted;

  ngOnInit(): void {
    // const token = this.authService.token;

    if (this.authService.isLoggedIn()) this.loadUsers();
    else {
      this.usersService.getUsers().subscribe({
        next: (users) => this._users.set(users),
        error: (err) => console.error('error:', err)
      });
    }

  }

  protected _filterChanged(event: Event): void {
    const value = (event.target as { value?: string } | null)?.value ?? '';
    this._table.getColumn('email')?.setFilterValue(value);
  }

  private loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this._users.set(users)
      },
      error: (err) => console.error('error:', err)
    })
  }

  protected deleteUser(user: UserSchema): void {
    console.log('delete', user);
    // const token = this.authService.token;
    this.usersService.deleteUser(user.id || "").subscribe(success => {
        if(success) this.loadUsers()
    })
  }

  hrefToEditPage(id: string) {
    this.router.navigateByUrl(dashboardEditUserRoute(id));
  }

  protected readonly dashboardCreateUserRoute = dashboardCreateUserRoute;
}
