import { Component } from '@angular/core';
import {TopAnimeComponent} from '../../../features/anime/components/top-anime/top-anime.component';
import {
  RecommendedAnimeComponent
} from '../../../features/anime/components/recomended-anime/recommended-anime.component';

@Component({
  selector: 'app-home',
  imports: [
    TopAnimeComponent,
    RecommendedAnimeComponent
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {

}
