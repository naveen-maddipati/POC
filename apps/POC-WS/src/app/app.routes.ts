import { Route } from '@angular/router';
import { LayoutWrapperComponent } from '@hylandsoftware/satori-devkit';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ApiDiscoveryComponent } from './components/api-discovery/api-discovery.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutWrapperComponent,
    providers: [],
    children: [
      {
        path: '',
        component: WelcomeComponent
      },
      {
        path: 'welcome',
        component: WelcomeComponent
      },
      {
        path: 'api-discovery',
        component: ApiDiscoveryComponent
      }
    ],
  },
];
