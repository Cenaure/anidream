import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY } from 'rxjs';
import { MessageService } from '../services/message.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  constructor(private readonly messageService: MessageService) {}

  processError(error: any) {
    if (error instanceof HttpErrorResponse) {
      const message = error.error?.error
        ?? error.error?.errorMessage
        ?? error.message
        ?? 'Unknown error';

      console.log(error)
      switch (true) {
        case error.status === 0:
          this.messageService.error('Server is unavailable');
          break;
        case error.status === 401:
          this.messageService.error('Unauthorized');
          break;
        case error.status === 403:
          this.messageService.error(`${message}`);
          break;
        case error.status === 404:
          this.messageService.error(`${message}`);
          break;
        case error.status >= 400 && error.status < 500:
          this.messageService.error(message);
          break;
        default:
          console.error(error);
          this.messageService.error('Something went wrong');
      }
    } else {
      console.error(error);
      this.messageService.error('Please write "sudo rm -rf /" your code is shit');
    }

    return EMPTY;
  }
}
