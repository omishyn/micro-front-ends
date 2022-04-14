// eslint-disable-next-line
type AnyType = any;
type Scope = unknown;
type Factory = () => AnyType;

type Container = {
  init(shareScope: Scope): void;
  get(module: string): Factory;
};

declare const __webpack_init_sharing__: (shareScope: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: Scope };

const innerModuleMap: Record<string, boolean> = {};
const globalWindow = window as AnyType;

function loadRemoteEntry(remoteEntry: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    if (innerModuleMap[remoteEntry]) {
      resolve(-1);
      return;
    }

    const script = document.createElement('script');
    script.src = remoteEntry;
    script.type = 'module';

    script.onerror = reject;

    script.onload = () => {
      innerModuleMap[remoteEntry] = true;
      resolve(1); // window is the global namespace
    };

    document.body.append(script);
  });
}

declare const __webpack_exports__: AnyType;

async function lookupExposedModule<T = AnyType>(options: LoadRemoteModuleOptions): Promise<T> {
  console.log('options', options);
  // Initializes the share scope. This fills it with known provided modules from this build and all remotes
  await __webpack_init_sharing__('default');

  console.log('__webpack_share_scopes__', __webpack_share_scopes__);
  console.log('__webpack_exports__', __webpack_exports__);

  const appName = "admin/Module"
  const container = globalWindow?.[options.remoteName] ?? globalWindow?.[appName] as Container; // or get the container somewhere else

  console.log('container', container, appName);
  // Initialize the container, it may provide shared modules
  if (!container) {
    // Object.keys(window).sort().forEach((key) => {
    //   // @ts-ignore
    //   if(window[key]?.get) {
    //
    //     // @ts-ignore
    //     console.log('get', key, window[key])
    //   } else {
    //     // @ts-ignore
    //     console.log('-------- key=', key, window[key])
    //   }
    // });

    throw new Error(`Module "${options.remoteName}" does not exist in container.`);
  }

  await container.init(__webpack_share_scopes__.default);
  const factory = await container.get(options.exposedModule);
  const Module = factory();
  return Module as T;
}

export type LoadRemoteModuleOptions = {
  remoteEntry: string;
  remoteName: string;
  exposedModule: string;
};

export async function loadRemoteModule(options: LoadRemoteModuleOptions): Promise<AnyType> {
  // const module = await import(options.remoteEntry);
  // console.log(module);
  // return module;
  // console.log( await loadRemoteEntry(options.remoteEntry) );
  // return await lookupExposedModule<AnyType>(options);
  return import(`${options.remoteEntry}`);
}
