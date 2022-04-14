import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { buildRoutes } from '../utils/route-utils';
import { MicroFrontend } from './micro-frontend.model';

@Injectable({
  providedIn: 'root',
})
export class MicroFrontendService {
  private microFrontends: MicroFrontend[] = [];

  constructor(private router: Router) {}

  /*
   * This is just an hardcoded list of remote microfrontends, but could easily be updated
   * to load the config from a database or external file
   */
  private static loadConfig(): MicroFrontend[] {
    return [
      // {
      //   // For Loading
      //   remoteEntry: 'http://localhost:3100/remoteEntry.js',
      //   remoteName: 'admin',
      //   exposedModule: 'RemoteEntryModule',
      //
      //   // For Routing, enabling us to ngFor over the microfrontends and dynamically create links for the routes
      //   displayName: 'Admin',
      //   routePath: 'admin',
      //   ngModuleName: 'RemoteEntryModule',
      // },
      {
        // For Loading
        remoteEntry: 'http://localhost:4100/dynamicRemoteEntry.js',
        remoteName: 'dynamicDashboard',
        exposedModule: 'RemoteEntryModule',

        // For Routing, enabling us to ngFor over the microfrontends and dynamically create links for the routes
        displayName: 'Dynamic Dashboard',
        routePath: 'dynamic-dashboard',
        ngModuleName: 'RemoteEntryModule',
      },
    ];
  }

  /*
   * Initialize is called on app startup to load the initial list of
   * remote microfrontends and configure them within the router
   */
  public initialise(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.microFrontends = MicroFrontendService.loadConfig();
      this.router.resetConfig(buildRoutes(this.microFrontends));
      resolve();
    });
  }

  public getMicroFrontends(): MicroFrontend[] {
    return this.microFrontends.slice();
  }
}
