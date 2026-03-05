import {HttpErrorResponse} from '@angular/common/http';
import {EMPTY} from 'rxjs';
import {MessageService} from '../services/message.service';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private readonly messageService: MessageService) {}

  processError(error: any) {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        this.messageService.error("Server is unavailable")
      } else if (error.status == 403) {
        const message = error.error.errorMessage ? error.error.errorMessage : JSON.parse(error.error.errorMessage);
        this.messageService.error("Forbidden")
      } else if (error.status >= 400 && error.status < 500) {
        const message = error.error.errorMessage ? error.error.errorMessage : JSON.parse(error.error.errorMessage);
        this.messageService.error("Wrong username or password")
      } else {
        console.error(error);
        this.messageService.error("Something went wrong")
      }
    } else {
      console.error(error);
      this.messageService.error("Your angular developer cannot cook")
    }

    return EMPTY;
  }
}
