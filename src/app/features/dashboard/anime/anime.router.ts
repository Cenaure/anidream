import {Routes} from '@angular/router';
import {Segment} from '../../../shared/utils/paths';


export const ANIME_ROUTES: Routes = [
  {
    path: Segment.list,
    loadComponent: () => import("./pages/anime-list/anime-list.component").then(c => c.AnimeListComponent)
  },

]
