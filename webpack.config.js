const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const devMode = false;
const publicPath = '/seg3125survey';
// noinspection ES6ConvertVarToLetConst,JSUnusedLocalSymbols
var query = {};

module.exports = {
    mode: devMode ? 'development': 'production',
    entry: {
        main: './src/index.js',
    },
    devServer: {
        contentBase: './dist' + publicPath,
    },
    ...(devMode ? {
        devtool: 'inline-source-map',
    }: {}),
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new WebpackManifestPlugin(),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].[contentHash].css',
        }),
        new HtmlWebpackPlugin({
            template: '!!ejs-compiled-loader?{}!./src/index.ejs',
            inject: false,
            // minify: !devMode,
            minify: {
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
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
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
        ],
    },
    output: {
        filename: '[name].[contentHash].js',
        path: path.resolve(__dirname, 'dist' + publicPath),
        publicPath: publicPath + '/',
    },
    optimization: {
        minimize: !devMode,
        minimizer: [
            new TerserJSPlugin(),
            new OptimizeCSSAssetsPlugin(),
        ],
        moduleIds: 'hashed',
        noEmitOnErrors: true,
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
        removeAvailableModules: true,
        removeEmptyChunks: !devMode,
        runtimeChunk: "single",
    },
};
