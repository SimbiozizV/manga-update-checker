const path = require('path');
const webpack = require('webpack');
const baseManifest = require('./src/manifest.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
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
                },
            }),
        ],
    };
};