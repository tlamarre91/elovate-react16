const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
module.exports = {
    mode: process.env.NODE_ENV,
    node: {
        fs: "empty" // TODO: determine if this is an appropriate fix for webpack error with winston importing fs
    },
    entry: "./src/client/index.ts",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            "~shared": path.resolve("src/shared"),
            "~server": path.resolve("src/server"),
            "~client": path.resolve("src/client"),
        }
    },
    output: {
        filename: "client.js",
    },
}