import { LoadRemoteModuleOptions } from '../utils/federation-utils';

export type MicroFrontend = LoadRemoteModuleOptions & {
  displayName: string;
  routePath: string;
  ngModuleName: string;
};
