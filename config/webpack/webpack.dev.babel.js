import webpack from 'webpack';

import paths from './paths';

module.exports = ({
    port, 
    // api_port: apiPort=8003
}) => ({
    mode: 'development',
    devtool: 'eval-source-map',

    output: {
        filename: '[name].js',
        path: paths.outputPath,
        chunkFilename: '[name].js'
    },
    performance: {
        hints: 'warning',
        maxAssetSize: 450000,
        maxEntrypointSize: 8500000,
        assetFilter: assetFilename => {
            return (
                assetFilename.endsWith('.css') || assetFilename.endsWith('.js')
            );
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    devServer: {
        client: {
            overlay: {
                warnings: false,
                errors: true
            },
            logging: 'verbose',
        },
        static: paths.outputPath,
        allowedHosts: 'all',
        compress: true,
        // hot: true,  // 默认就是true
        historyApiFallback: {
            rewrites: [
                {from: /.*/, to: '/index.html'},
            ],
        },
        port,
        // proxy: {
        //     '/api': {
        //         target: `http://localhost:${apiPort}`,
        //         pathRewrite: {'^/api' : ''},
        //         proxyTimeout: 1000 * 60 * 60 * 2,
        //         timeout: 1000 * 60 * 60 * 2,
        //         onProxyReq: (proxyReq, req) => req.setTimeout(1000 * 60 * 60 * 2),
        //         secure: false,
        //     },
        // },
    },
    watchOptions: {
        ignored: /node_modules/
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin({
            // multiStep: true,
        }),
        new webpack.SourceMapDevToolPlugin({}),
    ],
});
