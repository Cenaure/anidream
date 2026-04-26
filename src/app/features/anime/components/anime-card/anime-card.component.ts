import {Component, Input} from '@angular/core';
import {Anime} from '../../_schemas/anime.schema';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-anime-card',
  imports: [
    NgOptimizedImage,
  ],
  templateUrl: './anime-card.component.html',
})
export class AnimeCardComponent {
  @Input({required: true}) anime!: Anime;
}
