import {Component, signal} from '@angular/core';
import {
  ColumnDef, ColumnFiltersState, createAngularTable,
  FlexRenderDirective, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState
} from '@tanstack/angular-table';
import {HlmButton} from '@spartan-ng/helm/button';
import {HlmTable, HlmTableContainer, HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTr} from '@spartan-ng/helm/table';
import {LucideAngularModule, SquarePenIcon} from 'lucide-angular';
import {AnimeService} from '../../../anime/services/anime.service';
import {Router} from '@angular/router';
import {Film} from '../../../anime/_schemas/anime.schema';
import {dashboardEditGroupRoute} from '../../../../shared/utils/paths';

@Component({
  selector: 'app-anime-list',
  imports: [
    FlexRenderDirective,
    HlmButton,
    HlmTBody,
    HlmTHead,
    HlmTable,
    HlmTableContainer,
    HlmTd,
    HlmTh,
    HlmTr,
    LucideAngularModule
  ],
  templateUrl: './anime-list.html',
})
export class AnimeList {
  constructor(
    private readonly animeService: AnimeService,
    private readonly router: Router,
  ) {}
  groupsLoaded = signal<Film[]>([]) // TODO: Anime

  //nazov rebricky
  protected readonly _columns: ColumnDef<Film>[] = [
    {
      accessorKey: 'id',
      id: 'id',
      enableSorting: false,
    },
    {
      accessorKey: 'slovenskyNazov',
      id: 'slovenskyNazov',
      header: 'Name',
      enableSorting: true,
      cell: (info) => info.getValue<string>(),
    },
    {
      accessorKey: 'poradieVRebricku',
      id: 'poradieVRebricku',
      header: 'AFI 1998',
      cell: (info) => {
        const record = info.getValue<Record<string, number>>();
        return Object.entries(record)
          .map(([key, value]) => `${key}: ${value}`)[0]
      },
    },
    {
      accessorKey: 'poradieVRebricku',
      id: 'poradieVRebricku',
      header: 'AFI 2007',
      cell: (info) => {
        const record = info.getValue<Record<string, number>>();
        return Object.entries(record)
          .map(([key, value]) => `${key}: ${value}`)[1] || "-"
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => null,
    },
  ];

  protected _filterChanged(event: Event) {
    this._table.getColumn('email')?.setFilterValue((event.target as any).value);
  }

  private readonly _columnFilters = signal<ColumnFiltersState>([]);
  private readonly _sorting = signal<SortingState>([]);
  private readonly _rowSelection = signal<RowSelectionState>({});
  private readonly _columnVisibility = signal<VisibilityState>({});

  protected readonly _table = createAngularTable<Film>(() => ({
    data: this.groupsLoaded(),
    columns: this._columns,
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
  }));
  protected readonly _hidableColumns = this._table.getAllColumns().filter((column) => column.getCanHide());

  ngOnInit() {
    this.animeService.getFilms("slovenskyNazov").subscribe(
      (films) => {
        this.groupsLoaded.set(films.items)
        console.log(this.groupsLoaded())

      }
    )
  }

  routeToEditPage(id: string) {
    this.router.navigateByUrl(dashboardEditGroupRoute(id))
  }

  protected readonly squarePenIcon = SquarePenIcon;
}
