import {Routes} from '@angular/router';
import {AnimeMenu} from './anime-menu/anime-menu';


export const ANIME_ROUTES: Routes = [
  {
    path: '', component: AnimeMenu,
    children: [
      {path: 'list', loadComponent: () => import("./anime-list/anime-list").then(c => c.AnimeList)},
      {path: '', redirectTo: 'list', pathMatch: 'prefix'},
    ]
  }
]
