import {Component, Input} from '@angular/core';
import {IAnime} from '../../_schemas/anime.schema';
import {DecimalPipe, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-anime-card',
  imports: [
    NgOptimizedImage,
    DecimalPipe,
  ],
  templateUrl: './anime-card.component.html',
})
export class AnimeCardComponent {
  @Input({required: true}) anime!: IAnime;
}
