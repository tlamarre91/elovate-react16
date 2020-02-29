const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
module.exports = {
    mode: process.env.NODE_ENV,
    entry: "./src/client/index.ts",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    output: {
        filename: "client.js",
    },
}
