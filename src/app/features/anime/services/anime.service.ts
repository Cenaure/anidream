import {inject, Injectable} from '@angular/core';
import {catchError, defaultIfEmpty, map, Observable, tap} from 'rxjs';
import {
  IAnime,
  DataAnime,
  AnimeListResponse,
  RandomAnimeResponse, AnimeListSortBy, AnimeTitles
} from '../_schemas/anime.schema';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../env/dev.env';
import {ErrorService} from '../../../shared/utils/processError';
import {AnimeCharactersResponse} from '../_schemas/character.schema';
import {Images} from '../_schemas/image.schema';
import {CommonMalResponse} from '../_schemas/common.shcema';
import {MessageService} from '../../../shared/services/message.service';

//region: ---DTOs
export interface TopAnimeQuery {
  limit?: number,
}

export interface ListAnimeQuery {
  page: number;
  perPage: number;
  search?: string;
  sortColumn?: AnimeListSortBy;
  sortDirection?: 'asc' | 'desc' | '';
}


export const AnimeStatusValues = {
  Airing: "Currently Airing",
  FinishedAiring: "Finished Airing",
  Upcoming: "Upcoming",
} as const
export type AnimeStatus = typeof AnimeStatusValues[keyof typeof AnimeStatusValues]

export const AnimeRatingValues = {
  PG13: "PG-13 - Teens 13 or older",
  R: "R - 17+ (violence & profanity)",
  Rplus: "R+ - Mild Nudity",
} as const
export type AnimeRating = typeof AnimeRatingValues[keyof typeof AnimeRatingValues]

export const AnimeTypeValues = {
  TV: "TV",
  Movie: "Movie",
  OVA: "OVA",
  ONA: "ONA",
  Special: "Special",
  Music: "Music",
} as const
export type AnimeType = typeof AnimeTypeValues[keyof typeof AnimeTypeValues]

export interface CreateAnimeDto {
  mal_id: number;
  url?: string;
  images?: Images;
  titles?: AnimeTitles[];
  type?: string;
  episodes?: number;
  status?: string;
  airing?: boolean;
  rating?: string;
  score?: number;
  synopsis?: string;
  year?: number;
  producer_ids?: number[];
  studios?: CommonMalResponse[];
  genres?: CommonMalResponse[];
  rank?: number;
  popularity?: number;
}
//endregion: ---DTOs


@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  //region: ---constructor
  private readonly http = inject(HttpClient)
  private readonly errorsService = inject(ErrorService)
  private readonly messageService = inject(MessageService)

  private readonly apiUrl: string = environment.apiUrl
  //endregion: ---constructor


  // Fetches anime from !local db!
  // doesn't request anime from jikan api
  listAnime(query: ListAnimeQuery): Observable<AnimeListResponse> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('limit', query.perPage);

    if (query.search?.trim()) {
      params = params.set('query', query.search.trim());
    }
    if (query.sortColumn) {
      params = params.set('sort_by', query.sortColumn);
      params = params.set('order', query.sortDirection ?? 'asc');
    }

    return this.http.get<AnimeListResponse>(`${this.apiUrl}/anime/list`, {params}).pipe(
      catchError(error => this.errorsService.processError(error))
    );
  }

  // Fetches the best anime by the rating
  getTopAnime(query: TopAnimeQuery): Observable<AnimeListResponse> {
    let params = new HttpParams();

    if (query.limit) params = params.set("limit", query.limit)

    return this.http.get<AnimeListResponse>(`${this.apiUrl}/anime/top`, {params}).pipe(
      catchError(error => this.errorsService.processError(error))
    );
  }

  // Gets random anime (might be dangerous :))
  getRandomAnime(): Observable<RandomAnimeResponse> {
    return this.http.get<RandomAnimeResponse>(`${this.apiUrl}/anime/random`).pipe(
      catchError(error => this.errorsService.processError(error))
    );
  }

  // Search Anime
  searchAnime(q: string): Observable<AnimeListResponse> {
    let params = new HttpParams();

    if (q)    params = params.set('q', q);

    return this.http.get<AnimeListResponse>(`${this.apiUrl}/anime/`, {params}).pipe(
      catchError(error => this.errorsService.processError(error))
    );
  }

  // Fetches anime by its mal_id
  getAnimeById(id: string): Observable<DataAnime> {
    return this.http.get<DataAnime>(`${this.apiUrl}/anime/${id}`).pipe(
      catchError(error => this.errorsService.processError(error))
    )
  }

  getAnimeByIds(ids: string): Observable<{data: IAnime[]}> {
    return this.http.get<{data: IAnime[]}>(`${this.apiUrl}/anime/ids/${ids}`).pipe(
      catchError(error => this.errorsService.processError(error))
    )
  }

  // Fetches anime characters by its mal_id
  getAnimeCharacters(id: string): Observable<AnimeCharactersResponse> {
    return this.http.get<AnimeCharactersResponse>(`${this.apiUrl}/characters/${id}`).pipe(
      catchError(error => this.errorsService.processError(error))
    )
  }

  saveAnime(dto: CreateAnimeDto, edit: boolean): Observable<DataAnime> {
    if(!edit) {
      return this.http.post<{data: IAnime}>(`${this.apiUrl}/anime/`, dto).pipe(
        tap(() => this.messageService.success("Anime created Successfully")),
        catchError(error => this.errorsService.processError(error))
      )
    } else {
      const {mal_id, ...updateDto} = dto;

      return this.http.put<{data: IAnime}>(`${this.apiUrl}/anime/${mal_id}`, updateDto).pipe(
        tap(() => this.messageService.success("Anime updated Successfully")),
        catchError(error => this.errorsService.processError(error))
      )
    }
  }

  deleteAnime(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/anime/${id}`).pipe(
      map(() => {
        this.messageService.success('User deleted successfully.');
        return true;
      }),
      catchError(error => this.errorsService.processError(error)),
      defaultIfEmpty(false)
    );
  }
}
