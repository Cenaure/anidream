import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  signal,
  Output,
  EventEmitter, OnDestroy,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorCaretDown } from '@ng-icons/phosphor-icons/regular';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { hlmMuted } from '@spartan-ng/helm/typography';
import {
  type ColumnDef,
  type ColumnFiltersState,
  createAngularTable,
  FlexRenderDirective,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/angular-table';
import {debounceTime, distinctUntilChanged, Subject, takeUntil} from 'rxjs';

export interface TablePageEvent {
  pageIndex: number;
  pageSize: number;
}

export interface TableFilterEvent {
  column: string;
  value: string;
}

export interface TableSortEvent {
  column: string;
  direction: 'asc' | 'desc' | '';
}

@Component({
  selector: 'app-tanstack-table',
  imports: [
    FlexRenderDirective,
    HlmDropdownMenuImports,
    HlmButtonImports,
    NgIcon,
    HlmIconImports,
    HlmInputImports,
    HlmTableImports,
    NgTemplateOutlet,
  ],
  providers: [provideIcons({ phosphorCaretDown })],
  host: { class: 'w-full' },
  templateUrl: './tanstack-table.component.html',
})
export class TanstackTableComponent<T> implements OnChanges, OnDestroy {
  @Input({ required: true }) columns: ColumnDef<T>[] = [];
  @Input({ required: true }) data: T[] = [];
  @Input() filterPlaceholder = 'Filter...';
  @Input() filterColumn?: string;
  @Input() pageSize = 10;
  @Input() actionsTemplate?: TemplateRef<{ $implicit: T }>;
  @Input() debounceMs = 400;
  @Input() totalRows = 0;

  @Input() serverSide = false;

  @Output() pageChange = new EventEmitter<TablePageEvent>();
  @Output() filterChange = new EventEmitter<TableFilterEvent>();
  @Output() sortChange = new EventEmitter<TableSortEvent>();

  protected readonly _hlmMuted = hlmMuted;

  private readonly _destroy$ = new Subject<void>();
  private readonly _searchInput$ = new Subject<string>();

  private readonly _data = signal<T[]>([]);
  private readonly _sorting = signal<SortingState>([]);
  private readonly _columnFilters = signal<ColumnFiltersState>([]);
  private readonly _rowSelection = signal<RowSelectionState>({});
  private readonly _columnVisibility = signal<VisibilityState>({});
  private readonly _pagination = signal<PaginationState>({
    pageIndex: 0,
    pageSize: this.pageSize,
  });

  constructor() {
    // Search debounce
    this._searchInput$
      .pipe(
        debounceTime(this.debounceMs),
        distinctUntilChanged(),
        takeUntil(this._destroy$),
      )
      .subscribe((value) => {
        const colId = this.filterColumn ?? this.columns[0]?.id ?? '';

        if (this.serverSide) {
          this._pagination.update((p) => ({ ...p, pageIndex: 0 }));
          this.filterChange.emit({ column: colId, value });
        } else {
          this._table.getColumn(colId)?.setFilterValue(value);
        }
      });
  }

  protected readonly _table = createAngularTable<T>(() => ({
    data: this._data(),
    columns: this.columns,
    enableSorting: true,
    manualPagination: this.serverSide,
    manualFiltering: this.serverSide,
    manualSorting: this.serverSide,
    rowCount: this.serverSide ? this.totalRows : undefined,

    onPaginationChange: (updater) => {
      const next =
        updater instanceof Function ? updater(this._pagination()) : updater;
      this._pagination.set(next);
      if (this.serverSide) {
        this.pageChange.emit({ pageIndex: next.pageIndex, pageSize: next.pageSize });
      }
    },

    onSortingChange: (updater) => {
      const next =
        updater instanceof Function ? updater(this._sorting()) : updater;
      this._sorting.set(next);
      if (this.serverSide && next.length > 0) {
        this._pagination.update((p) => ({ ...p, pageIndex: 0 }));
        this.sortChange.emit({
          column: next[0].id,
          direction: next[0].desc ? 'desc' : 'asc',
        });
      } else if (this.serverSide) {
        this.sortChange.emit({ column: '', direction: '' });
      }
    },

    onColumnFiltersChange: (updater) => {
      updater instanceof Function
        ? this._columnFilters.update(updater)
        : this._columnFilters.set(updater);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: (updater) => {
      updater instanceof Function
        ? this._columnVisibility.update(updater)
        : this._columnVisibility.set(updater);
    },
    onRowSelectionChange: (updater) => {
      updater instanceof Function
        ? this._rowSelection.update(updater)
        : this._rowSelection.set(updater);
    },
    state: {
      sorting: this._sorting(),
      columnFilters: this._columnFilters(),
      columnVisibility: this._columnVisibility(),
      rowSelection: this._rowSelection(),
      pagination: this._pagination(),
    },
  }));

  protected get _hidableColumns() {
    return this._table.getAllColumns().filter((c) => c.getCanHide());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this._data.set(this.data ?? []);
    }
    if (changes['pageSize']) {
      this._pagination.update((p) => ({ ...p, pageSize: this.pageSize }));
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  protected _filterChanged(event: Event): void {
    const value = (event.target as HTMLInputElement).value ?? '';
    this._searchInput$.next(value);
  }
}
