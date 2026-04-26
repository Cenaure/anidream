import { Component } from '@angular/core';
import {TopAnimeComponent} from '../../../features/anime/components/top-anime/top-anime.component';

@Component({
  selector: 'app-home',
  imports: [
    TopAnimeComponent
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {

}
