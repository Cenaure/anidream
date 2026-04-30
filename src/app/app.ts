import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HlmToaster} from '@spartan-ng/helm/sonner';
import {NavbarComponent} from './shared/layout/navbar/navbar.component';
import {BackgroundImageComponent} from './shared/components/background-image/background-image.component';
import {FooterComponent} from './shared/layout/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmToaster, NavbarComponent, BackgroundImageComponent, FooterComponent],
  template: `
    <app-background-image />
    <div class="min-h-screen leading-relaxed relative">
      <app-navbar/>

      <main class="mx-auto max-w-screen-2xl w-full min-h-[70dvh] relative px-2 md:px-4">
        <router-outlet/>
      </main>

      <app-footer />

      <hlm-toaster position="bottom-center" richColors closeButton theme="dark" ngSkipHydration/>
    </div>
  `
})
export class App {
  protected readonly title = signal('anidream-v2');
}
