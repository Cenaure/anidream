import {Routes} from '@angular/router';
import {randomAnime, searchAnime} from '../../shared/utils/paths';

export const ANIME_ROUTES: Routes = [
  {
    path: randomAnime,
    loadComponent: () => import("./pages/random-anime/random-anime.component").then(c => c.RandomAnimeComponent)
  },
  {
    path: searchAnime,
    loadComponent: () => import("./pages/search/search.component").then(c => c.SearchComponent)
  },
  {
    path: ':id',
    loadComponent: () => import("./pages/anime/anime.component").then(c => c.AnimeComponent)
  },
]
