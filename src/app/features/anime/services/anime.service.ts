import { Injectable } from '@angular/core';
import {catchError, Observable} from 'rxjs';
import {
  IAnime,
  AnimeByIdResponse,
  AnimeListResponse,
  RandomAnimeResponse, AnimeListSortBy
} from '../_schemas/anime.schema';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../../env/dev.env';
import {ErrorService} from '../../../shared/utils/processError';
import {AnimeCharactersResponse} from '../_schemas/character.schema';
import {ProducersSortBy} from '../../dashboard/producers/services/producers.service';

//region: ---DTOs
// TODO: refactor to use rust-server instead of java

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
//endregion: ---DTOs


@Injectable({
  providedIn: 'root',
})
export class AnimeService {
  //region: ---constructor
  constructor(
    private readonly http: HttpClient,
    private readonly errorsService: ErrorService,
  ) {}

  private readonly apiUrl: string = environment.apiUrl
  //endregion: ---constructor


  // Fetches anime from !local db!
  // doesn't request anime from jikan api
  listAnime(query: ListAnimeQuery): Observable<AnimeListResponse> {
    let params = new HttpParams()
      .set('page', query.page)
      .set('limit', query.perPage);

    if (query.search?.trim()) {
      params = params.set('name', query.search.trim());
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
  getAnimeById(id: string): Observable<AnimeByIdResponse> {
    return this.http.get<AnimeByIdResponse>(`${this.apiUrl}/anime/${id}`).pipe(
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
}
