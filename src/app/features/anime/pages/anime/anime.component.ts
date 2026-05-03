import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {AnimeService} from '../../services/anime.service';
import {IAnime} from '../../_schemas/anime.schema';
import {DecimalPipe, NgOptimizedImage} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {phosphorArrowSquareOut, phosphorStar, phosphorUsers, phosphorTrophy, phosphorHash, phosphorMonitorPlay} from '@ng-icons/phosphor-icons/regular';
import {AnimeCharacter} from '../../_schemas/character.schema';
import {AnimeCharacterCardComponent} from '../../components/anime-character-card/anime-character-card.component';
import {MetadataService} from '../../../../shared/services/metadata.service';

@Component({
  selector: 'app-anime',
  imports: [
    NgOptimizedImage,
    NgIcon,
    DecimalPipe,
    AnimeCharacterCardComponent
  ],
  templateUrl: './anime.component.html',
  viewProviders: [
    provideIcons({
      phosphorArrowSquareOut,
      phosphorStar,
      phosphorUsers,
      phosphorTrophy,
      phosphorHash,
      phosphorMonitorPlay
    })
  ]
})
export class AnimeComponent implements OnInit {
  animeService = inject(AnimeService)
  metadataService = inject(MetadataService)

  // For video embedding
  private sanitizer = inject(DomSanitizer)

  //https://angular.dev/api/router/withComponentInputBinding
  @Input() id!: string;

  // Anime that will be displayed on the page
  anime = signal<IAnime | null>(null)
  characters = signal<AnimeCharacter[] | null>(null)

  readonly safeTrailerUrl = signal<SafeResourceUrl | null>(null);
  ngOnInit() {
    this.animeService.getAnimeById(this.id).subscribe({
      next: (res) => {
        this.anime.set(res.data);
        console.log(res.data)
        this.metadataService.updateMetadata({
          title: res.data?.titles?.[0].title,
        })

        const embedUrl = res.data.trailer?.embed_url;
        if (embedUrl) {
          this.safeTrailerUrl.set(
            this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl)
          );
        }
      },
      error: (err) => console.error('Error loading anime:', err)
    });

    this.animeService.getAnimeCharacters(this.id).subscribe({
      next: (res) => {
        this.characters.set(res.data)
      }
    })
  }

  protected readonly Math = Math;
}
