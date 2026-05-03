import {Component, OnInit, inject, signal} from '@angular/core';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {phosphorPencilSimple, phosphorTrash} from '@ng-icons/phosphor-icons/regular';
import {AnimeService, ListAnimeQuery} from '../../../../anime/services/anime.service';
import {Router, RouterLink} from '@angular/router';
import {Route} from '../../../../../shared/utils/paths';
import type {ColumnDef} from '@tanstack/angular-table';
import {AnimeListSortByValues, AnimeTitles, IAnime} from '../../../../anime/_schemas/anime.schema';
import {
  TableFilterEvent,
  TablePageEvent, TableSortEvent, TanstackTableComponent
} from '../../../../../shared/components/tanstack-table/tanstack-table.component';
import {IUser} from '../../../users/_schemas/user.schema';
import {AlertComponent} from '../../../../../shared/components/alert/alert.component';
import {HlmButton} from '@spartan-ng/helm/button';

@Component({
  selector: 'app-anime-list',
  providers: [provideIcons({phosphorPencilSimple, phosphorTrash})],
  templateUrl: './anime-list.component.html',
  imports: [
    AlertComponent,
    NgIcon,
    TanstackTableComponent,
    RouterLink,
    HlmButton
  ]
})
export class AnimeListComponent implements OnInit {
  private readonly animeService = inject(AnimeService)
  private readonly router = inject(Router)

  protected readonly anime = signal<IAnime[]>([]);
  protected totalRows = signal(0);

  query = signal<ListAnimeQuery>({
    page: 1,
    perPage: 10,
    search: '',
    sortColumn: AnimeListSortByValues.Score,
    sortDirection: 'desc',
  });

  protected readonly columns: ColumnDef<IAnime>[] = [
    {
      accessorKey: 'mal_id',
      id: 'mal_id',
      header: 'MAL Id',
      enableSorting: false,
      cell: (info) => `<span>${info.getValue<number>() ?? '—'}</span>`,
    },
    {
      accessorKey: 'titles',
      id: 'titles',
      header: 'Title',
      enableSorting: false,
      cell: (info) => {
        const titles = info.getValue<AnimeTitles[] | null>();
        const primary = titles?.find(t => t.type === 'Default') ?? titles?.[0];

        const mal_id = info.row.original.mal_id
        return `<span><a class="text-violet-300 hover:underline hover:text-violet-400" href="${Route.anime + "/" + mal_id}" target="_blank">${primary?.title ?? '—'}</a>`;
      },
    },
    {
      accessorKey: 'type',
      id: 'type',
      header: 'Type',
      enableSorting: false,
      cell: (info) => `<span>${info.getValue<string>() ?? '—'}</span>`,
    },
    {
      accessorKey: 'episodes',
      id: 'episodes',
      header: 'Episodes',
      enableSorting: true,
      cell: (info) => `<span>${info.getValue<number>() ?? '—'}</span>`,
    },
    {
      accessorKey: 'score',
      id: 'score',
      header: 'Score',
      enableSorting: true,
      cell: (info) => `<span>${info.getValue<number>()?.toFixed(2) ?? '—'}</span>`,
    },
    {
      accessorKey: 'rank',
      id: 'rank',
      header: 'Rank',
      enableSorting: true,
      cell: (info) => `<span>#${info.getValue<number>() ?? '—'}</span>`,
    },
    {
      accessorKey: 'popularity',
      id: 'popularity',
      header: 'Popularity',
      enableSorting: true,
      cell: (info) => `<span>#${info.getValue<number>() ?? '—'}</span>`,
    },
    {
      accessorKey: 'status',
      id: 'status',
      header: 'Status',
      enableSorting: false,
      cell: (info) => `<span>${info.getValue<string>() ?? '—'}</span>`,
    },
    {
      accessorKey: 'year',
      id: 'year',
      header: 'Year',
      enableSorting: true,
      cell: (info) => `<span>${info.getValue<number>() ?? '—'}</span>`,
    },
    {
      accessorKey: 'rating',
      id: 'rating',
      header: 'Rating',
      enableSorting: false,
      cell: (info) => `<span>${info.getValue<string>() ?? '—'}</span>`,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => null,
    },
  ];

  ngOnInit() {
    this.loadAnime()
  }

  onPageChange(event: TablePageEvent) {
    this.query.update((q) => ({ ...q, page: event.pageIndex + 1 }));
    this.loadAnime();
  }

  onFilterChange(event: TableFilterEvent) {
    this.query.update((q) => ({ ...q, search: event.value, page: 1 }));
    this.loadAnime();
  }

  onSortChange(event: TableSortEvent) {
    const key = (event.column.charAt(0).toUpperCase() + event.column.slice(1)) as keyof typeof AnimeListSortByValues;

    this.query.update((q) => ({
      ...q,
      sortColumn: AnimeListSortByValues[key],
      sortDirection: event.direction,
      page: 1,
    }));
    this.loadAnime();
  }

  private loadAnime() {
    const q = this.query();
    this.animeService.listAnime(q).subscribe({
      next: res => {
        this.anime.set(res.data);
        this.totalRows.set(res.pagination.items.total);
      },
      error: (err) => console.error('error:', err),
    });
  }

  protected deleteUser(user: IUser): void {
    // this.animeService.deleteUser(user.id || "").subscribe(success => {
    //   if(success) this.loadUsers()
    // })
  }

  hrefToEditPage(id: string | number) {
    this.router.navigateByUrl(Route.dashboardEditAnime(id));
  }

  deleteAnime(id: number) {
    this.animeService.deleteAnime(id).subscribe(success => {
      if(success) this.loadAnime()
    })
  }

  protected readonly createNewAnimeRoute = Route.dashboardNewAnime()
}
