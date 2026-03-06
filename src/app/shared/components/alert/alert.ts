import {Component, input, output} from '@angular/core';
import {
  HlmAlertDialog, HlmAlertDialogAction, HlmAlertDialogCancel,
  HlmAlertDialogContent, HlmAlertDialogDescription,
  HlmAlertDialogFooter,
  HlmAlertDialogHeader, HlmAlertDialogPortal, HlmAlertDialogTitle, HlmAlertDialogTrigger
} from '@spartan-ng/helm/alert-dialog';

@Component({
  selector: 'app-alert',
  imports: [
    HlmAlertDialogContent,
    HlmAlertDialogHeader,
    HlmAlertDialog,
    HlmAlertDialogFooter,
    HlmAlertDialogCancel,
    HlmAlertDialogAction,
    HlmAlertDialogTitle,
    HlmAlertDialogDescription,
    HlmAlertDialogTrigger,
    HlmAlertDialogPortal
  ],
  templateUrl: './alert.html',
})
export class Alert {
  title = input<string>('Are you sure?');
  description = input<string>('This action cannot be undone.');
  cancelLabel = input<string>('Cancel');
  confirmLabel = input<string>('Continue');

  confirmed = output<void>();
}
