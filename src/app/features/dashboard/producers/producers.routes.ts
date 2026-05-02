import {Routes} from '@angular/router';
import {Segment} from '../../../shared/utils/paths';
import {producerResolve} from './pages/producer-edit/producer-resolve.guard';

export const PRODUCERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import("./pages/producers-list/producers-list.component").then(c => c.ProducersListComponent),
  },
  {
    path: Segment.edit + "/:mal_id",
    resolve: {
      producer: producerResolve
    },
    loadComponent: () => import("./pages/producer-edit/producer-edit.component").then(c => c.ProducerEditComponent),
  }
]
