import { Component, signal, OnInit } from '@angular/core';
import {
  ColumnDef, createAngularTable,
  FlexRenderDirective, getCoreRowModel,
  getFilteredRowModel, getPaginationRowModel, getSortedRowModel,
} from '@tanstack/angular-table';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmTable, HlmTableContainer, HlmTBody, HlmTd, HlmTh, HlmTHead, HlmTr } from '@spartan-ng/helm/table';
import { LucideAngularModule, SquarePenIcon } from 'lucide-angular';
import { AnimeService } from '../../../anime/services/anime.service';
import { Router } from '@angular/router';
import { Film } from '../../../anime/_schemas/anime.schema';
import { dashboardEditGroupRoute } from '../../../../shared/utils/paths';


// Column helpers
function rankingCell(index: number) {
  return (info: any) => {
    // @ts-ignore
    const entries = Object.entries(info.getValue<Record<string, number>>());
    const entry = entries[index];
    return entry ? `${entry[0]}: ${entry[1]}` : '-';
  };
}

const COLUMNS: ColumnDef<Film>[] = [
  { accessorKey: 'id', id: 'id', enableSorting: false },
  { accessorKey: 'slovenskyNazov', id: 'slovenskyNazov', header: 'Name', enableSorting: true },
  { accessorKey: 'poradieVRebricku', id: 'afi1998', header: 'AFI 1998', cell: rankingCell(0) },
  { accessorKey: 'poradieVRebricku', id: 'afi2007', header: 'AFI 2007', cell: rankingCell(1) },
  { id: 'actions', header: 'Actions', cell: () => null },
];


// Table state factory
function createTableState() {
  return {
    sorting: signal([]),
    columnFilters: signal([]),
    columnVisibility: signal({}),
    rowSelection: signal({}),
  };
}


@Component({
  selector: 'app-anime-list',
  imports: [
    FlexRenderDirective, HlmButton,
    HlmTable, HlmTableContainer, HlmTBody,
    HlmTd, HlmTh, HlmTHead, HlmTr,
    LucideAngularModule,
  ],
  templateUrl: './anime-list.html',
})
export class AnimeList implements OnInit {
  protected readonly squarePenIcon = SquarePenIcon;
  protected readonly films = signal<Film[]>([]);

  private readonly state = createTableState();

  readonly _columns = COLUMNS;

  protected readonly _table = createAngularTable<Film>(() => ({
    data: this.films(),
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: this.state.sorting(),
      columnFilters: this.state.columnFilters(),
      columnVisibility: this.state.columnVisibility(),
      rowSelection: this.state.rowSelection(),
    },
    onSortingChange:         (u) => this.updateSignal(this.state.sorting, u),
    onColumnFiltersChange:   (u) => this.updateSignal(this.state.columnFilters, u),
    onColumnVisibilityChange:(u) => this.updateSignal(this.state.columnVisibility, u),
    onRowSelectionChange:    (u) => this.updateSignal(this.state.rowSelection, u),
  }));

  constructor(
    private readonly animeService: AnimeService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.animeService.getFilms('slovenskyNazov')
      .subscribe(({ items }) => {

        this.films.set(items)
      });
  }

  routeToEditPage(id: string) {
    this.router.navigateByUrl(dashboardEditGroupRoute(id));
  }

  private updateSignal<T>(sig: ReturnType<typeof signal<T>>, updater: T | ((prev: T) => T)) {
    updater instanceof Function ? sig.update(updater) : sig.set(updater);
  }
}
