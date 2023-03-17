const path = require('path');
const webpack = require('webpack');
const baseManifest = require('./src/manifest.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackExtensionManifestPlugin = require('webpack-extension-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const getModeInfo = mode =>
    mode && mode === 'development' ? { isDevelop: true, mode } : { isDevelop: false, mode: 'production' };

module.exports = (_, argv) => {
    const { isDevelop, mode } = getModeInfo(argv.mode);

    return {
        context: path.resolve(__dirname),
        entry: {
            app: './src/index.tsx',
            background: './src/background.ts',
        },
        mode,
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: '[name].js',
        },
        module: {
            rules: [
                {
                    test: /\.((js|ts)x?)$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                { test: /\.(jpg|png)$/, use: { loader: 'file-loader' } },
            ],
        },
        cache: {
            type: 'filesystem',
            buildDependencies: {
                config: [__filename],
            },
        },
        devtool: isDevelop ? 'inline-source-map' : false,
        resolve: {
            extensions: ['.js', '.ts', '.tsx'],
        },
        plugins: [
            new webpack.DefinePlugin({
                __DEV__: isDevelop,
            }),
            new CleanWebpackPlugin(),
            new CopyPlugin({
                patterns: [
                    {
                        from: './src/icons/extension',
                        to: './',
                    },
                    {
                        from: './src/rules.json',
                        to: './',
                    },
                ],
            }),
            new HtmlWebpackPlugin({
                title: 'ReadManga',
                meta: {
                    charset: 'utf-8',
                    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
                    'theme-color': '#000000',
                },
                filename: 'index.html',
                template: './src/index.html',
                hash: true,
                chunks: ['app'],
            }),
            new WebpackExtensionManifestPlugin({
                config: {
                    base: baseManifest,
                    extend: {
                        version: process.env.npm_package_version,
                    },
                },
            }),
        ],
    };
};
