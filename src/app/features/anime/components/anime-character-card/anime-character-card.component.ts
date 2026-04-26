import {Component, Input} from '@angular/core';
import {AnimeCharacter} from '../../_schemas/character.schema';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-anime-character-card',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './anime-character-card.component.html',
})
export class AnimeCharacterCardComponent {
  @Input({required: true}) character!: AnimeCharacter;
}
