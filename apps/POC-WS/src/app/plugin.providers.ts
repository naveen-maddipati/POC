import { EnvironmentProviders } from '@angular/core';
import { provideSatoriLayout } from '@hylandsoftware/satori-layout';

export const pluginProviders: EnvironmentProviders[] = [
  provideSatoriLayout({
    header: {
      logoPath: 'plugins/@hylandsoftware/satori-layout/assets/logo.svg',
      logoRedirectUrl: '/',
    },
  }),
];
