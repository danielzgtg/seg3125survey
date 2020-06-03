
import path from 'path';
import webpack from 'webpack';
// eslint-disable-next-line sort-imports
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import merge from 'webpack-merge';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import TerserJSPlugin from 'terser-webpack-plugin';
import WebpackManifestPlugin from 'webpack-manifest-plugin';

const openPath = 'seg3125survey/';
const publicPath = `/${openPath}`;
const distPath = path.resolve(__dirname, `dist${publicPath}`);

function plugins(devMode: boolean): NonNullable<webpack.Configuration['plugins']> {
    return [
        new webpack.ProgressPlugin,
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new WebpackManifestPlugin,
        new MiniCssExtractPlugin({
            filename: 'styles/[name].[contentHash].css',
        }),
        new HtmlWebpackPlugin({
            template: '!!ejs-compiled-loader?{}!./src/index.ejs',
            inject: false,
            minify: !devMode && {
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
                decodeEntities: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true,
                sortAttributes: true,
                sortClassName: true,
            },
            xhtml: true,
            enableHotReload: devMode,
        }),
        new CopyWebpackPlugin({
            patterns: [
                'static',
            ],
        }),
    ];
}

const base: webpack.Configuration = {
    entry: {
        polyfills: './src/polyfills.ts',
        'css-normalize': './src/css-normalize.ts',
        main: './src/index.ts',
    },
    devServer: {
        contentBase: distPath,
        openPage: openPath,
        overlay: {
            warnings: true,
            errors: true,
        },
        publicPath,
        serveIndex: false,
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'img/[name].[contentHash].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|woff2?)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name].[contentHash].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: true,
                        },
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.app.json',
                        },
                    },
                    {
                        loader: 'eslint-loader',
                        options: {
                            emitError: true,
                            emitWarning: true,
                            failOnError: true,
                            failOnWarning: true,
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [
            '.js',
            '.ts',
        ],
    },
    output: {
        filename: '[name].[contentHash].js',
        path: distPath,
        publicPath,
    },
    optimization: {
        minimizer: [
            new TerserJSPlugin,
            new OptimizeCSSAssetsPlugin,
        ],
        moduleIds: 'hashed',
        noEmitOnErrors: true,
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/](?!core-js|regenerator-runtime)/,
                    name: 'vendors',
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
        runtimeChunk: 'single',
        usedExports: true,
        sideEffects: true,
        flagIncludedChunks: true,
        occurrenceOrder: true,
        removeAvailableModules: true,
        removeEmptyChunks: true,
    },
    performance: {
        hints: 'warning',
        assetFilter(assetFilename: string): boolean {
            return /.js$/.test(assetFilename) && !/(polyfills|vendors)/.test(assetFilename);
        },
    },
};

const dev: webpack.Configuration = {
    devtool: 'source-map',
    optimization: {
        minimize: false,
    },
};

const prod: webpack.Configuration = {
    optimization: {
        minimize: true,
    },
};

function isDevMode(mode: string | undefined): boolean {
    switch (mode) {
    case 'development':
        return true;
    case 'production':
        return false;
    }
    throw new TypeError('Unknown mode');
}

// noinspection JSUnusedGlobalSymbols
export default function(env: unknown, argv: { mode: string }): webpack.Configuration {
    const devMode = isDevMode(argv.mode);
    return merge(base, devMode ? dev : prod, {
        plugins: plugins(devMode),
    });
}
