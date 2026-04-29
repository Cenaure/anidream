import { Injectable } from '@angular/core';
import {catchError, Observable, retry, timer} from 'rxjs';
import {Anime, AnimeByIdResponse, AnimeListResponse, Film, RandomAnimeResponse} from '../_schemas/anime.schema';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../../env/dev.env';
import {ErrorService} from '../../../shared/utils/processError';
import {AnimeCharactersResponse} from '../_schemas/character.schema';

//region: ---DTOs
// TODO: refactor to use rust-server instead of java
export interface FilmsDto {
  items: Film[],
  totalCount: number,
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


  // deprecated
  getFilms(orderBy?: string, indexFrom?: number, indexTo?: number, descending?: boolean, search?: string): Observable<FilmsDto> {
    let params = new HttpParams();

    if (orderBy)    params = params.set('orderBy', orderBy);
    if (descending) params = params.set('descending', descending);
    if (indexTo)    params = params.set('indexTo', indexTo);
    if (indexFrom)  params = params.set('indexFrom', indexFrom);
    if (search)     params = params.set('search', search);

    return this.http.get<FilmsDto>(`${this.apiUrl}/films`, {
      params,
    }).pipe(
      catchError(error => this.errorsService.processError(error))
    );
  }

  // Fetches the best anime by the rating
  getTopAnime(): Observable<AnimeListResponse> {
    return this.http.get<AnimeListResponse>(`${this.apiUrl}/anime/top`).pipe(
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

  getAnimeByIds(ids: string): Observable<{data: Anime[]}> {
    return this.http.get<{data: Anime[]}>(`${this.apiUrl}/anime/ids/${ids}`).pipe(
      catchError(error => this.errorsService.processError(error))
    )
  }

  // Fetches anime characters by its mal_id
  getAnimeCharacters(id: string): Observable<AnimeCharactersResponse> {
    return this.http.get<AnimeCharactersResponse>(`${this.apiUrl}/anime/${id}/characters`).pipe(
      catchError(error => this.errorsService.processError(error))
    )
  }
}
