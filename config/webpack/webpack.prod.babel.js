import path from 'path';
import paths from './paths';

const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = () => ({
    mode: 'production',
    devtool: 'source-map',
    output: {
        filename: `${paths.jsFolder}/[name].[fullhash].js`,
        path: paths.outputPath,
        chunkFilename: '[name].[contenthash].js'
    },
    plugins: [
        new CleanWebpackPlugin({
            dry: false,
            verbose: true,
            root: paths.root,
            cleanOnceBeforeBuildPatterns: [
                '**/*',
                '!.gitplaceholder',
                // '!directoryToExclude/**',
            ],
        }),
        new WebpackManifestPlugin({}),
        new webpack.ids.HashedModuleIdsPlugin({}),
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return path.join('npm', `${packageName.replace('@', '')}`);
                    },
                },
            },
        },
    },
});
