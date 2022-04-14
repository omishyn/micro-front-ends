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

function loadRemoteEntry(remoteEntry: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (innerModuleMap[remoteEntry]) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = remoteEntry;

    script.onerror = reject;

    script.onload = () => {
      innerModuleMap[remoteEntry] = true;
      resolve(); // window is the global namespace
    };

    document.body.append(script);
  });
}

async function lookupExposedModule<T = AnyType>(options: LoadRemoteModuleOptions): Promise<T> {
  console.log('options', options);
  // Initializes the share scope. This fills it with known provided modules from this build and all remotes
  await __webpack_init_sharing__('default');

  const container = (window as AnyType)[options.remoteName] as Container; // or get the container somewhere else

  console.log('container', options.remoteName, container);

  // Initialize the container, it may provide shared modules
  if (!container) {
    console.log(window)
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
  await loadRemoteEntry(options.remoteEntry);
  return await lookupExposedModule<AnyType>(options);
}
