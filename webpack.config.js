const path = require('path');

module.exports = {
    mode: "development",
    entry: "./main",
    output: { filename: "app.js"},
    module: {
        rules: [
            {
                test: /.ts$/,
                loader: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    }
}