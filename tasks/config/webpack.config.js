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

var p = function(pageName) {
  return pagesDir + pageName
}

module.exports = {
  entry: {
    generic: p('generic'),
    index: p('index'),
    login: p('login'),
    logout: p('logout'),
    requestResetPassword: p('request-reset-password'),
    resetPassword: p('reset-password'),
    dashboard: p('dashboard'),
    serviceProvider: p('service-provider'),
    addServiceProvider: p('add-service-provider'),
    serviceProviderAddresses: p('service-provider-addresses'),
    addServiceProviderAddress: p('add-service-provider-address'),
    editServiceProviderAddress: p('edit-service-provider-address'),
    serviceProviderServices: p('service-provider-services'),
    addServiceProviderService: p('add-service-provider-service'),
    editServiceProviderService: p('edit-service-provider-service'),
    addServiceProviderNeed: p('add-service-provider-need'),
    editServiceProviderNeed: p('edit-service-provider-need'),
    addUser: p('add-user'),
    verifyNewUser: p('verify-new-user'),
    volunteers: p('volunteers'),
    charterPledges: p('charter-pledges'),
    contactVolunteer: p('contact-volunteer')
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
        query: {
          presets: ['es2015']
        },
        exclude: /(node_modules|bower_components)/
      }
    ],
  },
  standard: {
    parser: 'babel-eslint'
  }
};
