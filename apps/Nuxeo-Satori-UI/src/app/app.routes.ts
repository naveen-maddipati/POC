import { Route } from '@angular/router';
import { LayoutWrapperComponent } from '@hylandsoftware/satori-devkit';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ApiDiscoveryComponent } from './components/api-discovery/api-discovery.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EnterpriseDemoComponent } from './components/enterprise-demo/enterprise-demo.component';
import { DocumentCreationComponent } from './components/document-creation/document-creation.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutWrapperComponent,
    providers: [],
    children: [
      {
        path: '',
        component: DashboardComponent // Dashboard as landing page
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'welcome',
        component: WelcomeComponent
      },
      {
        path: 'api-discovery',
        component: ApiDiscoveryComponent
      },
      {
        path: 'enterprise-demo',
        component: EnterpriseDemoComponent
      },
      {
        path: 'document-creation',
        component: DocumentCreationComponent
      }
    ],
  },
];
