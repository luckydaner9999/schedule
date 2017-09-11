/**
 * Created by gaodandan on 2017/5/9.
 */
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
process.env.NODE_ENV='production'
new WebpackDevServer(webpack(config), {
    publicPath: '/build/',
    hot: true,
    historyApiFallback: true
}).listen(3030, '192.168.2.188', function (err, result) {
    if (err) {
        console.log(err);
    }

    console.log('Listening at 192.168.2.188:3030');
});
