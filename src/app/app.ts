import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HlmToaster} from '@spartan-ng/helm/sonner';
import {Navbar} from './shared/layout/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmToaster, Navbar],
  template: `
    <div>
      <app-navbar />
      <main class="mx-auto max-w-5xl">
        <router-outlet />

      </main>
      <hlm-toaster position="bottom-center" richColors closeButton theme="dark" ngSkipHydration />
    </div>
  `
})
export class App {
  protected readonly title = signal('anidream-v2');
}
