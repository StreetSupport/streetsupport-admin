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

var pagesDir = __dirname + '/../../src/js/pages/page-'

module.exports = {
  entry: {
    generic: pagesDir + 'generic',
    index: pagesDir + 'index',
    login: pagesDir + 'login',
    logout: pagesDir + 'logout',
    resetPassword: pagesDir + 'reset-password',
    dashboard: pagesDir + 'dashboard',
    serviceProvider: pagesDir + 'service-provider',
    addServiceProvider: pagesDir + 'add-service-provider',
    serviceProviderAddresses: pagesDir + 'service-provider-addresses',
    addServiceProviderAddress: pagesDir + 'add-service-provider-address',
    editServiceProviderAddress: pagesDir + 'edit-service-provider-address',
    serviceProviderServices: pagesDir + 'service-provider-services',
    addServiceProviderService: pagesDir + 'add-service-provider-service',
    editServiceProviderService: pagesDir + 'edit-service-provider-service',
    addUser: pagesDir + 'add-user',
    verifyNewUser: pagesDir + 'verify-new-user'
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
