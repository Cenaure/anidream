import {Component, inject, OnInit, signal} from '@angular/core';
import {IProducer} from '../../_schemas/producer.schema';
import {ProducersQuery, ProducersService, ProducersSortByValues} from '../../services/producers.service';
import type {ColumnDef} from '@tanstack/angular-table';
import {
  TableFilterEvent,
  TablePageEvent, TableSortEvent, TanstackTableComponent
} from '../../../../../shared/components/tanstack-table/tanstack-table.component';
import {Router} from '@angular/router';
import {Route} from '../../../../../shared/utils/paths';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {phosphorPencilSimple} from '@ng-icons/phosphor-icons/regular';

@Component({
  selector: 'app-producers-list',
  imports: [
    NgIcon,
    TanstackTableComponent
  ],
  providers: [provideIcons({phosphorPencilSimple})],
  templateUrl: './producers-list.component.html',
})
export class ProducersListComponent implements OnInit {
  private readonly producersService = inject(ProducersService);
  private readonly router = inject(Router)

  protected readonly producers = signal<IProducer[]>([]);
  protected totalRows = signal(0);

  query = signal<ProducersQuery>({
    page: 1,
    perPage: 10,
    search: '',
    sortColumn: ProducersSortByValues.Name,
    sortDirection: 'asc',
  });

  protected readonly columns: ColumnDef<IProducer>[] = [
    {
      accessorKey: 'id',
      id: 'id',
      header: 'ID',
      enableSorting: false,
      cell: (info) => `<span>${info.getValue<number>() ?? '—'}</span>`,
    },
    {
      accessorKey: 'mal_id',
      id: 'mal_id',
      header: 'MAL Id',
      enableSorting: true,
      cell: (info) => `<div class="lowercase">${info.getValue<string>()}</div>`,
    },
    {
      accessorKey: 'name',
      id: 'name',
      header: 'Name',
      enableSorting: true,
      cell: (info) => `<span>${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'url',
      id: 'url',
      header: 'Link',
      enableSorting: false,
      cell: (info) => {
        const url = info.getValue<string>()

        return `<span><a class="text-violet-300 hover:underline hover:text-violet-400" href="${url}" target="_blank">${url}</a></span>`
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => null,
    },
  ];

  ngOnInit(): void {
    this.loadProducers()
  }

  onPageChange(event: TablePageEvent) {
    this.query.update((q) => ({ ...q, page: event.pageIndex + 1 }));
    this.loadProducers();
  }

  onFilterChange(event: TableFilterEvent) {
    this.query.update((q) => ({ ...q, search: event.value, page: 1 }));
    this.loadProducers();
  }

  onSortChange(event: TableSortEvent) {
    this.query.update((q) => ({
      ...q,
      sortColumn: ProducersSortByValues[event.column as keyof typeof ProducersSortByValues],
      sortDirection: event.direction,
      page: 1,
    }));
    this.loadProducers();
  }

  private loadProducers() {
    const q = this.query();
    this.producersService.getProducers(q).subscribe({
      next: res => {
        this.producers.set(res.data);
        this.totalRows.set(res.pagination.items.total);
      },
      error: (err) => console.error('error:', err),
    });
  }

  protected readonly dashboardEditProducer = Route.dashboardEditProducer;
  hrefToEditPage(id: string) {
    console.log(this.dashboardEditProducer(id))
    this.router.navigateByUrl(this.dashboardEditProducer(id));
  }
}
