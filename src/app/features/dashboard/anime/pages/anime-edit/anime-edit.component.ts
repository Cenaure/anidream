import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {
  AnimeRating,
  AnimeRatingValues, AnimeService, AnimeStatus,
  AnimeStatusValues, AnimeType,
  AnimeTypeValues,
  CreateAnimeDto
} from '../../../../anime/services/anime.service';
import {applyEach, form, required, min, validate, FormField} from '@angular/forms/signals';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HlmButton} from '@spartan-ng/helm/button';
import {
  HlmCard,
  HlmCardContent,
  HlmCardDescription,
  HlmCardFooter,
  HlmCardHeader,
  HlmCardTitle
} from '@spartan-ng/helm/card';
import {HlmInput} from '@spartan-ng/helm/input';
import {HlmLabel} from '@spartan-ng/helm/label';
import {IProducer} from '../../../producers/_schemas/producer.schema';
import {map, of, switchMap, tap} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router} from '@angular/router';
import {ProducersService} from '../../../producers/services/producers.service';
import {CommonMalResponse} from '../../../../anime/_schemas/common.shcema';
import {Images} from '../../../../anime/_schemas/image.schema';
import {AnimeTitles} from '../../../../anime/_schemas/anime.schema';
import {Route} from '../../../../../shared/utils/paths';

interface NonNullableImages {
  webp: { image_url: string; small_image_url: string; large_image_url: string };
  jpg: { image_url: string; small_image_url: string; large_image_url: string };
}

interface CreateAnimeDtoForm {
  mal_id: number;
  url: string;
  images: NonNullableImages;
  titles: AnimeTitles[];
  type: string;
  episodes: number;
  status: string;
  airing: boolean;
  rating: string;
  score: number;
  synopsis: string;
  year: number;
  rank: number;
  popularity: number;
  producer_ids: number[];
  studios: string;
  genres: string;
}

@Component({
  selector: 'app-anime-edit',
  imports: [
    FormsModule,
    HlmButton,
    HlmCard,
    HlmCardContent,
    HlmCardDescription,
    HlmCardFooter,
    HlmCardHeader,
    HlmCardTitle,
    HlmInput,
    HlmLabel,
    ReactiveFormsModule,
    FormField
  ],
  templateUrl: './anime-edit.component.html',
})
export class AnimeEditComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private animeService = inject(AnimeService)
  private producersService = inject(ProducersService)
  private readonly destroyRef = inject(DestroyRef);

  protected readonly animeTypeOptions = Object.entries(AnimeTypeValues).map(
    ([, value]) => ({ value, label: value })
  );
  protected readonly animeStatusOptions = Object.entries(AnimeStatusValues).map(
    ([, value]) => ({ value, label: value })
  );
  protected readonly animeRatingOptions = Object.entries(AnimeRatingValues).map(
    ([, value]) => ({ value, label: value })
  );

  protected availableProducers = signal<IProducer[] | null>(null);
  protected isEdit = signal<boolean>(false)

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => params.get('mal_id')),
      tap(mal_id => {
        if(mal_id) {
          this.animeEditFormModel.update(m => ({ ...m, mal_id: Number(mal_id) }))
          this.isEdit.set(true)
        }
      }),
      switchMap(mal_id =>
        mal_id
          ? this.animeService.getAnimeById(mal_id).pipe(map(res => res.data))
          : of(null)
      ),
      tap(anime => {
        if (anime) {
          this.animeEditFormModel.set({
            mal_id: anime.mal_id,
            url: anime.url || '',
            titles: anime.titles || [{ type: 'Default', title: '' }],
            type: (anime.type || AnimeTypeValues.TV) as AnimeType,
            episodes: anime.episodes || 0,
            status: (anime.status || AnimeStatusValues.Airing) as AnimeStatus,
            airing: anime.airing || true,
            rating: (anime.rating || AnimeRatingValues.PG13) as AnimeRating,
            score: anime.score || -1,
            synopsis: anime.synopsis || '',
            year: anime.year || -1,
            rank: anime.rank || -1,
            popularity: anime.popularity || -1,
            producer_ids: anime.producers ? anime.producers.map(p => p.mal_id) : [],
            studios: Array.isArray(anime.studios)
              ? anime.studios.map(s => s.name).join(', ')
              : anime.studios || '',
            genres: Array.isArray(anime.genres)
              ? anime.genres.map(g => g.name).join(', ')
              : anime.genres || '',
            images: {
              webp: {
                image_url: anime.images?.webp?.image_url ?? '',
                small_image_url: anime.images?.webp?.small_image_url ?? '',
                large_image_url: anime.images?.webp?.large_image_url ?? '',
              },
              jpg: {
                image_url: anime.images?.jpg?.image_url ?? '',
                small_image_url: anime.images?.jpg?.small_image_url ?? '',
                large_image_url: anime.images?.jpg?.large_image_url ?? '',
              },
            },
          });
        }
      }),
      switchMap(() => this.producersService.getProducers({page: 1, perPage: 1000})),
      tap(res => {
        this.availableProducers.set(res.data);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  //region: ---form declaration
  protected animeEditFormModel = signal<CreateAnimeDtoForm>({
    mal_id: 0,
    titles: [{ type: 'Default', title: '' }],
    url: '',
    type: AnimeTypeValues.TV,
    episodes: 0,
    status: AnimeStatusValues.Airing,
    airing: true,
    rating: AnimeRatingValues.PG13,
    score: -1,
    synopsis: '',
    year: -1,
    rank: -1,
    popularity: -1,
    producer_ids: [],
    studios: '',
    genres: '',
    images: {
      webp: { image_url: '', small_image_url: '', large_image_url: '' },
      jpg: { image_url: '', small_image_url: '', large_image_url: '' },
    }
  })

  protected animeEditForm = form(this.animeEditFormModel, (schemaPath) => {
    applyEach(schemaPath.titles, (title) => {
      required(title.title, { message: 'Title is required' });
    });

    required(schemaPath.mal_id, { message: 'MAL ID is required' });
    required(schemaPath.type, { message: 'Type is required' });
    required(schemaPath.status, { message: 'Status is required' });
    required(schemaPath.rating, { message: 'Rating is required' });

    min(schemaPath.mal_id, 1, { message: 'MAL ID must be greater than 0' });
    min(schemaPath.episodes, 0, { message: 'Episodes cannot be negative' });

    const isNotUpcoming = ({ valueOf }: any) =>
      valueOf(schemaPath.status) !== AnimeStatusValues.Upcoming;

    required(schemaPath.score, {
      message: 'Score is required when anime is not upcoming',
      when: isNotUpcoming,
    });

    validate(schemaPath.score, ({value}) => {
      const score = value()
      if (score === -1) return null;
      if (score < 0) return {kind: "minError",message: 'Score must be at least 0'}
      if (score > 10) return {kind: "maxError", message: 'Score must be at most 10'}

      return null
    })

    validate(schemaPath.year, ({ value }) => {
      const year = value();
      if (year === -1) return null;
      if (year < 1900) return {kind: 'minError', message: 'Year must be after 1900'}
      return null;
    });

    validate(schemaPath.rank, ({ value }) => {
      const rank = value();
      if (rank === -1) return null;
      if (rank < 1) return { kind: 'minError', message: 'Rank must be at least 1' }
      return null;
    });

    validate(schemaPath.popularity, ({ value }) => {
      const popularity = value();
      if (popularity === -1) return null;
      if (popularity < 1) return { kind: 'minError', message: 'Popularity must be at least 1' }
      return null;
    });
  });
  //endregion: ---form declaration

  protected onProducersChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selected = Array.from(select.selectedOptions).map(option => Number(option.value));
    this.animeEditFormModel.update(m => ({ ...m, producer_ids: selected }));
  }

  protected errorMessage = signal<string>('')

  save() {
    if (this.animeEditForm().invalid()) {
      return;
    }

    const formValue = this.animeEditFormModel();
    const dto: CreateAnimeDto = {
      ...formValue,
      images: {
        jpg: {
          image_url: formValue.images.webp.image_url,
          small_image_url: formValue.images.webp.image_url,
          large_image_url: formValue.images.webp.image_url,
        },
        webp: {
          image_url: formValue.images.webp.image_url,
          small_image_url: formValue.images.webp.image_url,
          large_image_url: formValue.images.webp.image_url,
        },
      },
      studios: formValue.studios.split(',').filter(s => s.trim()).map(s => ({mal_id: 0, name: s.trim(), type: "studio", url: '' } as CommonMalResponse)),
      genres: formValue.genres.split(',').filter(g => g.trim()).map(g => ({mal_id: 0, name: g.trim(), type: "studio", url: '' } as CommonMalResponse)),
      score: formValue.score === -1 ? 0 : formValue.score,
      year: formValue.year === -1 ? undefined : formValue.year,
      rank: formValue.rank === -1 ? undefined : formValue.rank,
      popularity: formValue.popularity === -1 ? undefined : formValue.popularity,
    };

    this.animeService.saveAnime(dto, this.isEdit()).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.errorMessage.set('');
        this.router.navigateByUrl(Route.dashboardListAnime());
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'An error occurred while saving.');
      }
    });
  }
}
