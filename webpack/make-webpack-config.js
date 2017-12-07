'use strict';

const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname, '../');
const SOURCE_PATH = path.resolve(ROOT_PATH, 'source');
const NODE_MODULES_PATH = path.resolve(ROOT_PATH, 'node_modules');
const BUNDLES_PATH = path.join(ROOT_PATH, 'bundles/');

module.exports = (options) => {
    const config = {};
    const _OUTPUT = {
        path: BUNDLES_PATH,
        filename: 'bundle.js',
        publicPath: '/bundles/'
    };
    const plugins = [];
    const rules = [];

    const extractSass = new ExtractTextPlugin({
        filename: 'bundle.css',
        disable: options.dev
    });

    if (options.dev) {
        rules.push(
            {
                test: /\.scss$/,
                exclude: NODE_MODULES_PATH,
                use: [
                    {
                        loader: "style-loader" // creates style nodes from JS strings
                    },
                    {
                        loader: "css-loader", // translates CSS into CommonJS
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "sass-loader", // compiles Sass to CSS
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                enforce: "pre",
                test: /\.(es6|jsx)$/,
                exclude: NODE_MODULES_PATH,
                use: [
                    {
                        loader: "eslint-loader"
                    }
                ]
            }
        );
    } else {
        rules.push({
            test: /\.scss$/,
            exclude: NODE_MODULES_PATH,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }],
                // use style-loader in development
                fallback: "style-loader"
            })
        });
    }

    if (options.hotReloading) {
        plugins.push(
            new webpack.HotModuleReplacementPlugin()
        );

        config.devtool = 'eval-source-map';
        config.devServer = {
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,
            port: 4000,
            host: '0.0.0.0',
            headers: {'Access-Control-Allow-Origin': '*'}
        }
    }

    if (options.minimize) {
        plugins.push(
            new webpack.optimize.ModuleConcatenationPlugin(),
            new UglifyJsPlugin(),
            new webpack.HashedModuleIdsPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new CompressionPlugin({
                asset: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
                threshold: 10240,
                minRatio: 0.8
            })
        );
    }

    return merge(config, {
        entry: path.resolve(SOURCE_PATH, 'App.jsx'),
        output: _OUTPUT,
        module: {
            rules: [
                {
                    test: /\.(es6|jsx)$/,
                    exclude: NODE_MODULES_PATH,
                    use: [
                        {
                            loader: "babel-loader"
                        }
                    ]
                },
                {
                    test: /\.(ttf|eot|svg|woff|png|jpg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: [
                        {
                            loader: "file-loader"
                        }
                    ]
                },
                {
                    test: /\.css/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader'
                        }
                    ]
                }
            ].concat(rules)
        },
        plugins: [extractSass].concat(plugins)
    })
}