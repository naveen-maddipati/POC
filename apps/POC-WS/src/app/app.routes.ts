import { Route } from '@angular/router';
import { LayoutWrapperComponent } from '@hylandsoftware/satori-devkit';
import { WelcomeComponent } from './components/welcome/welcome.component';

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
      }
    ],
  },
];
