const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
    webpack: {
        plugins: {
            add: [new NodePolyfillPlugin()],
        },
        configure: (webpackConfig, { env, paths }) => {
            webpackConfig.module.rules.push({
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto',
                resolve: {
                    fullySpecified: false,
                },
            });
            return webpackConfig;
        },
    },
    devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
        devServerConfig.onBeforeSetupMiddleware = undefined;
        devServerConfig.onAfterSetupMiddleware = undefined;
        return devServerConfig;
    },
};