const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const merge = require('webpack-merge')

const openPath = 'seg3125survey/';
const publicPath = '/' + openPath;
const distPath = path.resolve(__dirname, 'dist' + publicPath);
// noinspection ES6ConvertVarToLetConst,JSUnusedLocalSymbols
var query = {};

function plugins(devMode) {
    return [
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

const base = {
    entry: {
        main: './src/index.js',
    },
    devServer: {
        contentBase: distPath,
        openPage: openPath,
        overlay: {
            warnings: true,
            errors: true,
        },
        publicPath: publicPath,
        serveIndex: false,
    },
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
        path: distPath,
        publicPath: publicPath,
    },
    optimization: {
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
        runtimeChunk: "single",
    },
};

const dev = {
    devtool: 'inline-source-map',
    optimization: {
        minimize: false,
        removeEmptyChunks: false,
    },
};

const prod = {
    optimization: {
        minimize: true,
    },
};

function isDevMode(mode) {
    switch (mode) {
        case "development":
            return true;
        case "production":
            return false;
    }
    throw TypeError("Unknown mode");
}

module.exports = (env, argv) => {
    const devMode = isDevMode(argv.mode);
    return merge(base, devMode ? dev : prod, {
        plugins: plugins(devMode),
    });
}
