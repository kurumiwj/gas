const { defineConfig } = require('@vue/cli-service');
const webpack = require("webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = defineConfig({
    transpileDependencies: true,
    productionSourceMap: false,
    publicPath: '/',
    lintOnSave: false,
    configureWebpack: {
        plugins: [
            new NodePolyfillPlugin(),
            new webpack.ProvidePlugin({
                process: "process/browser",
                Buffer: ["buffer", "Buffer"]
            })
        ]
    },
    devServer:{
        proxy:{
            "/api":{
                target:"http://127.0.0.1:8082",
                pathRewrite:{"^/api":""}
            }
        }
    }
})