import {Routes} from '@angular/router';
import {randomAnime} from '../../shared/utils/paths';

export const ANIME_ROUTES: Routes = [
  {
    path: randomAnime,
    loadComponent: () => import("./pages/random-anime/random-anime.component").then(c => c.RandomAnimeComponent)
  },
  {
    path: ':id',
    loadComponent: () => import("./pages/anime/anime.component").then(c => c.AnimeComponent)
  }
]
