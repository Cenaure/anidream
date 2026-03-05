import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  error(message: string) {
    toast.error(message);
  }

  success(message: string) {
    toast.success(message);
  }

  info(message: string) {
    toast.info(message);
  }

  warning(message: string) {
    toast.warning(message);
  }
}
