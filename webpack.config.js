var path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const public_dir = path.resolve(__dirname, './public')

module.exports = {
    entry: './src_client/index.js',
    mode: 'development',
    output: {
        path: public_dir,
        filename: 'index_bundle.js',
    },
    devServer: {
        static: {
            directory: public_dir
        },
        watchFiles: ['src_client/**/*', 'public/**/*'],
    },
    plugins: [new HtmlWebpackPlugin({
        filename: './index.html',
        favicon: './public/favicon.ico',
        template: './src_client/index.html'
    })],
};