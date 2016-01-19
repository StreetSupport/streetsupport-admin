var argv                = require('yargs').argv;
var path                = require('path');
var webpack             = require('webpack');
var CommonsChunkPlugin  = require(__dirname + '/../../node_modules/webpack/lib/optimize/CommonsChunkPlugin');

// Create plugins array
var plugins = [
  new CommonsChunkPlugin('commons.js')
];

// Add Uglify task to plugins array if there is a production flag
if (argv.production) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

var templateDir = '/../../src/js/pages/page-'

module.exports = {
  entry: {
    generic: __dirname + templateDir + 'generic',
    login: __dirname + templateDir + 'login',
    dashboard: __dirname + templateDir + 'dashboard',
    serviceProvider: __dirname + templateDir + 'service-provider',
    serviceProviderAddresses: __dirname + templateDir + 'service-provider-addresses',
    serviceProviderServices: __dirname + templateDir + 'service-provider-services'
  },
  output: {
    path: path.join(__dirname, '/../../_dist/assets/js/'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
    publicPath: "assets/js/"
  },
  plugins: plugins,
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'standard',
        exclude: /(node_modules|bower_components)/
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/
      }
    ],
  },
  standard: {
    parser: 'babel-eslint'
  }
};
