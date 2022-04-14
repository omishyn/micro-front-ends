// const { withModuleFederation } = require('@nrwl/angular/module-federation');
// const config = require('./mfe.config');
// module.exports = withModuleFederation(config);


const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');
const share = mf.share;

/**
 * We use the NX_TSCONFIG_PATH environment variable when using the @nrwl/angular:webpack-browser
 * builder as it will generate a temporary tsconfig file which contains any required remappings of
 * shared libraries.
 * A remapping will occur when a library is buildable, as webpack needs to know the location of the
 * built files for the buildable library.
 * This NX_TSCONFIG_PATH environment variable is set by the @nrwl/angular:webpack-browser and it contains
 * the location of the generated temporary tsconfig file.
 */
const tsConfigPath =
  process.env.NX_TSCONFIG_PATH ??
  path.join(__dirname, '../../tsconfig.base.json');

const workspaceRootPath = path.join(__dirname, '../../');
const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  tsConfigPath,
  [
    /* mapped paths to share */
  ],
  workspaceRootPath
);

module.exports = {
  output: {
    uniqueName: 'shell',
    publicPath: 'http://localhost:5100/',
  },
  optimization: {
    runtimeChunk: false,
  },
  experiments: {
    outputModule: true,
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      filename: 'remoteEntry.js',
      exposes: {
        './Module': './apps/shell/src/app/remote-entry/entry.module.ts',
      },
      shared: share({
        '@angular/core': {
          singleton: true,
          strictVersion: true,
          requiredVersion: 'auto',
          includeSecondaries: true,
        },
        '@angular/common': {
          singleton: true,
          strictVersion: true,
          requiredVersion: 'auto',
          includeSecondaries: true,
        },
        '@angular/common/http': {
          singleton: true,
          strictVersion: true,
          requiredVersion: 'auto',
          includeSecondaries: true,
        },
        '@angular/router': {
          singleton: true,
          strictVersion: true,
          requiredVersion: 'auto',
          includeSecondaries: true,
        },
        rxjs: {
          singleton: true,
          strictVersion: true,
          requiredVersion: 'auto',
          includeSecondaries: true,
        },
        ...sharedMappings.getDescriptors(),
      }),
      library: {
        type: 'module',
      },
      remotes: {
        // Ensure that you use the port you specified in the configuration.
        // Also the name must match what you declared in the admin module.
        'admin': `${getRemoteEntryUrl( 3100)}`,
        // Ensure that you use the port you specified in the configuration.
        // Also the name must match what you declared in the dashboard module.
        // 'dashboard': `${getRemoteEntryUrl(4100)}`,
        'dynamicDashboard': `${getRemoteEntryUrl(4100, 'dynamicRemoteEntry')}`,
      },
    }),
    sharedMappings.getPlugin(),
  ],
};

function getRemoteEntryUrl(port, name = 'remoteEntry', m= '') {
  return `http://localhost:${port}/${name}.${m}js`;
}
