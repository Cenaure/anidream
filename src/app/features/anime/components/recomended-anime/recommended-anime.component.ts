import {Component, inject, OnInit, signal} from '@angular/core';
import {Anime} from '../../_schemas/anime.schema';
import {AnimeService} from '../../services/anime.service';
import {AnimeCardComponent} from '../anime-card/anime-card.component';
import {RouterLink} from '@angular/router';
import {Route} from '../../../../shared/utils/paths';

@Component({
  selector: 'app-recomended-anime',
  imports: [
    AnimeCardComponent,
    RouterLink
  ],
  template: `
    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
      @for (anime of this.loadedAnime(); track $index) {
        <a [routerLink]="[animeRoute, anime.mal_id]">
          <app-anime-card [anime]="anime" />
        </a>
      }

      @if (this.isLoading()) {
        @for (item of [].constructor(12); track $index) {
          <div class="rounded-xl bg-zinc-800 animate-pulse aspect-2/3 w-full"></div>
        }
      }
    </div>
  `
})
export class RecommendedAnimeComponent implements OnInit{
  animeService = inject(AnimeService)

  recommendedAnimeIds = ["19815", "28851", "16498", "44511", "38000", "46095", "49828", "37779", "51553", "52034", "34599", "32281"]

  loadedAnime = signal<Anime[] | null>(null)
  isLoading = signal<boolean>(true)

  ngOnInit() {
    this.animeService.getAnimeByIds(this.recommendedAnimeIds.join(",")).subscribe({
      next: (res) => {
        const sorted = this.recommendedAnimeIds
          .map(id => res.data.find(a => a.mal_id === Number(id)))
          .filter((a): a is Anime => a !== undefined);
        this.loadedAnime.set(sorted);

        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    })
  }

  protected readonly animeRoute = Route.anime;
}
