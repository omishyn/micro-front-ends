import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";


export const APP_ROUTES: Routes = [
    {
      path: '',
      component: HomeComponent,
      pathMatch: 'full'
    },
    {
      path: 'admin',
      loadChildren: () => import('admin/Module').then((m) => m.RemoteEntryModule)
    },
    // {
    //   path: 'dashboard',
    //   loadChildren: () => import('dashboard/Module').then((m) => m.RemoteEntryModule)
    // },
];

