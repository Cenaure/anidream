import {Component, computed, inject, Input, signal} from '@angular/core';
import {TopAnimeComponent} from '../../components/top-anime/top-anime.component';
import {AnimeService} from '../../services/anime.service';
import {IAnime} from '../../_schemas/anime.schema';

@Component({
  selector: 'app-top-anime-page',
  imports: [
    TopAnimeComponent
  ],
  templateUrl: './top-anime-page.component.html',
})
export class TopAnimePageComponent {
}
