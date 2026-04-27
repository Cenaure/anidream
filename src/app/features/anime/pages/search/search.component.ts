import { Component, inject, computed, signal } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, tap } from 'rxjs';
import { AnimeService } from '../../services/anime.service';
import { AnimeCardComponent } from '../../components/anime-card/anime-card.component';
import {animeRoute} from '../../../../shared/utils/paths';

@Component({
  selector: 'app-search',
  imports: [AnimeCardComponent, RouterLink],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  private route = inject(ActivatedRoute);
  private animeService = inject(AnimeService);

  isLoading = signal(true);
  error = signal<string | null>(null);

  query = toSignal(
    this.route.queryParams.pipe(
      map(params => params['q'] ?? '')
    )
  );

  private result = toSignal(
    this.route.queryParams.pipe(
      tap(() => { this.isLoading.set(true); this.error.set(null); }),
      switchMap(params => this.animeService.searchAnime(params['q'] || '')),
      tap({
        next: () => this.isLoading.set(false),
        error: (e) => { this.isLoading.set(false); this.error.set(e.message); }
      }),
    )
  );

  anime = computed(() => this.result()?.data ?? null);
  protected readonly animeRoute = animeRoute;
}
