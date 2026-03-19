import {Component, OnInit, signal} from '@angular/core';
import {UsersService} from '../../users/services/users.service';
import {Group} from '../../users/_schemas/user.schema';
import {
  ColumnDef,
  createAngularTable, FlexRenderDirective,
  getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, RowSelectionState,
  SortingState, VisibilityState
} from '@tanstack/angular-table';
import {HlmTable, HlmTableContainer, HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTr} from '@spartan-ng/helm/table';
import {HlmButton} from '@spartan-ng/helm/button';
import {LucideAngularModule, SquarePenIcon} from 'lucide-angular';
import {Router} from '@angular/router';
import {dashboardEditGroupRoute} from '../../../../shared/utils/paths';

@Component({
  selector: 'app-groups-list',
  imports: [
    HlmTableContainer,
    HlmTable,
    HlmTHead,
    HlmTr,
    HlmTh,
    FlexRenderDirective,
    HlmTBody,
    HlmTd,
    HlmButton,
    LucideAngularModule
  ],
  templateUrl: './groups-list.html',
})
export class GroupsList implements OnInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly router: Router,
  ) {}
  groupsLoaded = signal<Group[]>([])

  protected readonly _columns: ColumnDef<Group>[] = [
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
      cell: (info) => info.getValue<string>(),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => null,
    },
  ];

  private readonly _sorting = signal<SortingState>([]);
  private readonly _rowSelection = signal<RowSelectionState>({});
  private readonly _columnVisibility = signal<VisibilityState>({});

  protected readonly _table = createAngularTable<Group>(() => ({
    data: this.groupsLoaded(),
    columns: this._columns,
    onSortingChange: (updater) => {
      updater instanceof Function ? this._sorting.update(updater) : this._sorting.set(updater);
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
      columnVisibility: this._columnVisibility(),
      rowSelection: this._rowSelection(),
    },
  }));
  protected readonly _hidableColumns = this._table.getAllColumns().filter((column) => column.getCanHide());

  ngOnInit() {
    this.usersService.getGroups().subscribe(
      groups => {
        this.groupsLoaded.set(groups)
      }
    )
  }

  routeToEditPage(id: string) {
    this.router.navigateByUrl(dashboardEditGroupRoute(id))
  }

  protected readonly squarePenIcon = SquarePenIcon;
}
