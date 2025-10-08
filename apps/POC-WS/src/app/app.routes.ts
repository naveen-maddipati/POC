import { Route } from '@angular/router';
import { LayoutWrapperComponent } from '@hylandsoftware/satori-devkit';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutWrapperComponent,
    providers: [],
    children: [],
  },
];
