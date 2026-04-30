import {Routes} from '@angular/router';
import {AnimeMenu} from './anime-menu/anime-menu';
import {Route, Segment} from '../../../shared/utils/paths';


export const ANIME_ROUTES: Routes = [
  {
    path: '', component: AnimeMenu,
    children: [
      {path: Segment.list, loadComponent: () => import("./anime-list/anime-list").then(c => c.AnimeList)},
      {path: '', redirectTo: Route.dashboardAnime, pathMatch: 'prefix'},
    ]
  }
]
