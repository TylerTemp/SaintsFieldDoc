import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import paths from './paths';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';

module.exports = () => ({
    entry: paths.entryPath,
    output: {
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.js$|jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                },
            },
            // {
            //     test: /\.css/,
            //     use: ['style-loader', 'css-loader'],
            // },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    {
                      loader: 'css-loader',
                      options: {
                        modules: {
                            namedExport: false,
                            localIdentName:'[name]__[local]--[hash:base64:5]',
                        },
                        sourceMap: true,
                      },
                    },
                ],
            },
            {
                test: /\.css$/,
                include: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    {
                      loader: 'css-loader',
                    },
                ],
            },
            {
                test: /\.json$/,
                type: "json"
            },

            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                          modules: {
                                namedExport: false,
                                localIdentName:'[name]__[local]--[hash:base64:5]',
                          },
                          sourceMap: true,
                          esModule: true,
                        },
                    },
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                        },
                    },
                ],
            },
            {
                test: /\.less$/,
                include: /node_modules/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS
                        options: {
                            modifyVars: {
                                // 'primary-color': '#1DA57A',
                                // 'link-color': '#1DA57A',
                                // 'border-radius-base': '2px',
                                // or
                                // 'hack': `true; @import "your-less-file-path.less";`, // Override with less file
                            },
                            javascriptEnabled: true,
                        },
                    },
                ],
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                exclude: /node_modules/,
                loader: 'file-loader'
            },
            {
                test: /\.(woff|woff2)$/,
                include: /node_modules/,
                type: 'asset',   // <-- Assets module - asset
                parser: {
                  dataUrlCondition: {
                    maxSize: 8 * 1024 // 8kb
                  }
                },
                generator: {  //If emitting file, the file path is
                  filename: 'fonts/[hash][ext][query]'
                }
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            mimetype: 'application/octet-stream',
                            limit: 10000,
                        },
                    },
                ],
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                    {
                        loader: 'img-loader',
                    },
                ],
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: ['@svgr/webpack'],
            },
        ],
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.scss', '.css', '.json'],
        alias: {
            '~': path.resolve(paths.root, 'src/') // added this: ts alias import
        },
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: paths.templatePath,
            minify: {
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                preserveLineBreaks: true,
                minifyURLs: true,
                removeComments: true,
                removeAttributeQuotes: false
            }
        }),
        new FaviconsWebpackPlugin('./src/Images/favicon.png'),
    ]
});
