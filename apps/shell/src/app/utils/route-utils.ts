import { loadRemoteModule } from './federation-utils';
import { Routes } from '@angular/router';
import { MicroFrontend } from '../microfrontends/micro-frontend.model';
import { APP_ROUTES } from '../app.routes';

export function buildRoutes(options: MicroFrontend[]): Routes {
  const lazyRoutes: Routes = options.map(o => ({
    path: o.routePath,
    loadChildren: () => {
      return loadRemoteModule(o)
        .then(m => m[o.ngModuleName])
        .catch((data) => {
          console.error(data);
        })
        ;
    },
  }));

  return [...APP_ROUTES, ...lazyRoutes];
}
