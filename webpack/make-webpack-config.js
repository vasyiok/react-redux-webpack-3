'use strict';

const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
        rules.push({
            test: /\.scss$/,
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
        });

        rules.push({
            enforce: "pre",
            test: /\.es6$/,
            use: [
                {
                    loader: "eslint-loader"
                }
            ]
        });
    } else {
        rules.push({
            test: /\.scss$/,
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

    return merge(config, {
        entry: path.resolve(SOURCE_PATH, 'index.es6'),
        output: _OUTPUT,
        module: {
            rules: [
                {
                    test: /\.es6$/,
                    exclude: NODE_MODULES_PATH,
                    loader: "babel-loader"
                }
            ].concat(rules)
        },
        plugins: [extractSass].concat(plugins)
    })
}