import {ResolveFn, Router} from '@angular/router';
import {catchError, EMPTY, Observable} from 'rxjs';
import {inject} from '@angular/core';
import {ProducersService} from '../../services/producers.service';
import {IProducer} from '../../_schemas/producer.schema';
import {MessageService} from '../../../../../shared/services/message.service';
import {Route} from '../../../../../shared/utils/paths';

export const producerResolve: ResolveFn<IProducer> = (route, state): Observable<IProducer> => {
  const producersService = inject(ProducersService)
  const router = inject(Router);
  const messageService = inject(MessageService);

  const mal_id = route.paramMap.get('mal_id');
  if (!mal_id || isNaN(Number(mal_id))) {
    router.navigateByUrl(Route.dashboardProducers);
    messageService.warning('Invalid producer ID');
    return EMPTY;
  }

  return producersService.getProducer(Number(mal_id)).pipe(
    catchError(() => {
      router.navigateByUrl(Route.dashboardProducers).then(() => {
        messageService.warning('Producer by provided mal_id not found');
      });
      return EMPTY;
    })
  );
}
