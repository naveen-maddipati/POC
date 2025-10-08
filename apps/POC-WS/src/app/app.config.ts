import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import {
  ApplicationDescriptor,
  provideApplicationCore,
} from '@hylandsoftware/satori-devkit';

import { appRoutes } from './app.routes';
import { pluginProviders } from './plugin.providers';

export const appConfig = (
  appDescriptor: ApplicationDescriptor
): ApplicationConfig => ({
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes, withHashLocation()),
    provideApplicationCore(appDescriptor),
    ...pluginProviders,
  ],
});
