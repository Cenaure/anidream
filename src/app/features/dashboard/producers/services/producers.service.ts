import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../../env/dev.env';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ErrorService} from '../../../../shared/utils/processError';
import {MessageService} from '../../../../shared/services/message.service';
import {catchError, EMPTY, map, Observable} from 'rxjs';
import {IUser, mapUser} from '../../users/_schemas/user.schema';
import {DataWithPaginationDto, UsersQuery} from '../../users/services/users.service';
import {IProducer, mapProducer} from '../_schemas/producer.schema';

export const ProducersSortByValues = {
  Name: "name",
  MalId: "mal_id",
} as const
export type ProducersSortBy = typeof ProducersSortByValues[keyof typeof ProducersSortByValues]

export interface ProducersQuery {
  page: number;
  perPage: number;
  search?: string;
  sortColumn?: ProducersSortBy;
  sortDirection?: 'asc' | 'desc' | '';
}

export interface UpdateProducerRequest {
  name?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProducersService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorService);
  private readonly messageService = inject(MessageService);

  // Fetches producers from local db
  getProducers(query: ProducersQuery): Observable<DataWithPaginationDto<IProducer>> {
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

    return this.http.get<DataWithPaginationDto<IProducer>>(`${this.apiUrl}/producers/`, {params}).pipe(
      map(res => ({
        data: res.data.map(p => mapProducer(p)),
        pagination: res.pagination
      })),
      catchError(error => this.errorService.processError(error))
    );
  }

  // Fetches producer by mal_id
  getProducer(mal_id: number): Observable<IProducer> {
    return this.http.get<IProducer>(`${this.apiUrl}/producers/${mal_id}`).pipe(
      map(producer => mapProducer(producer)),
    );
  }

  updateProducer(mal_id: number, body: UpdateProducerRequest): Observable<{ data: IProducer }> {
    return this.http.patch<{ data: IProducer }>(`${this.apiUrl}/producers/${mal_id}`, body).pipe(
      map(res => ({ data: mapProducer(res.data) })),
      catchError(error => this.errorService.processError(error))
    );
  }
}
