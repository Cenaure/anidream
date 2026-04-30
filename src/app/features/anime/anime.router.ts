import {Routes} from '@angular/router';
import {Segment} from '../../shared/utils/paths';

export const ANIME_ROUTES: Routes = [
  {
    path: Segment.random,
    loadComponent: () => import("./pages/random-anime/random-anime.component").then(c => c.RandomAnimeComponent)
  },
  {
    path: Segment.search,
    loadComponent: () => import("./pages/search/search.component").then(c => c.SearchComponent)
  },
  {
    path: ':id',
    loadComponent: () => import("./pages/anime/anime.component").then(c => c.AnimeComponent)
  },
]
