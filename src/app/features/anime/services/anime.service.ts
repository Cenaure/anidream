import { Injectable } from '@angular/core';
import {catchError, Observable} from 'rxjs';
import {Film} from '../_schemas/anime.schema';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../../env/dev.env';
import {ErrorService} from '../../../shared/utils/processError';

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

  private readonly apiUrl: string = environment.javaApiUrl //TODO: change to rust api
  //endregion: ---constructor

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 'X-Auth-Token': 'igk99utkghukdgbtnq5u6foldp' });
  }

  getFilms(orderBy?: string, indexFrom?: number, indexTo?: number, descending?: boolean, search?: string): Observable<FilmsDto> {
    let params = new HttpParams();

    if (orderBy)    params = params.set('orderBy', orderBy);
    if (descending) params = params.set('descending', descending);
    if (indexTo)    params = params.set('indexTo', indexTo);
    if (indexFrom)  params = params.set('indexFrom', indexFrom);
    if (search)     params = params.set('search', search);

    return this.http.get<FilmsDto>(`${this.apiUrl}/films`, {
      headers: this.getHeaders(),
      params,
    }).pipe(
      catchError(error => this.errorsService.processError(error))
    );
  }
}
