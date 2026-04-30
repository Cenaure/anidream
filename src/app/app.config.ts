import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {provideRouter, withComponentInputBinding, withInMemoryScrolling} from '@angular/router';

import { routes } from './app.routes';
import {EVENT_MANAGER_PLUGINS, provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {apiInterceptor} from './core/http/api.interceptor';
import {PreventDefaultEventPlugin} from './shared/utils/prevent-default-events';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({
      scrollPositionRestoration: 'top'
    }), withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([apiInterceptor])),
    {
      provide: EVENT_MANAGER_PLUGINS,
      multi: true,
      useClass: PreventDefaultEventPlugin
    }
  ]
};
