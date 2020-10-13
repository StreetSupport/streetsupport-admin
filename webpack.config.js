var argv = require('yargs').argv
var path = require('path')
var webpack = require('webpack')
var CommonsChunkPlugin = require(path.join(__dirname, '/node_modules/webpack/lib/optimize/CommonsChunkPlugin'))

// Create plugins array
var plugins = [
  new CommonsChunkPlugin('commons.js')
]

// Add Uglify task to plugins array if there is a production flag
if (argv.production) {
  plugins.push(new webpack.optimize.UglifyJsPlugin())
}

const pageDirPath = '/src/js/pages/'

const p = (pageName) => {
  const pagesDir = path.join(__dirname, pageDirPath, 'page-')
  return pagesDir + pageName
}

module.exports = {
  entry: {
    generic: p('generic'),
    index: p('index'),
    'service-provider-listing': path.join(__dirname, pageDirPath, 'service-providers/listing'),
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
    needResponses: p('provider-need-responses'),
    addUser: p('add-user'),
    charterPledges: p('charter-pledges'),
    actionGroups: p('action-groups'),
    volunteers: p('volunteers'),
    offersOfItems: p('offers-of-items'),
    contactVolunteer: p('contact-volunteer'),
    shareVolunteer: p('share-volunteer'),
    contactAboutOffer: p('contact-about-offer'),
    shareOffer: p('share-offer'),
    mailingList: p('mailing-list'),
    users: p('users'),
    'create-city-admin': p('create-city-admin'),
    'create-super-admin': p('create-super-admin'),
    'create-charter-admin': p('create-charter-admin'),
    'create-accom-review-admin': p('create-accom-review-admin'),
    'create-accom-provider-admin': p('create-accom-provider-admin'),
    editServiceProviderNeedCategories: p('edit-service-provider-need-categories'),
    impactupdates: p('impact-updates'),
    swep: p('swep'),
    'city-add': path.join(__dirname, pageDirPath, 'cities/add'),
    tempAccom: p('accommodation'),
    tempAccomAdd: p('accommodation-add'),
    tempAccomEdit: p('accommodation-edit'),
    tempAccomReviews: p('accommodation-reviews-add'),
    accommodationReviews: p('accommodation-reviews'),
    accommodationReviewDetails: p('accommodation-review-details'),
    'auth0-login': path.join(__dirname, pageDirPath, 'auth0/login'),
    'auth0-logout': path.join(__dirname, pageDirPath, 'auth0/logout'),
    'auth0-authentication': path.join(__dirname, pageDirPath, 'auth0/authentication'),
    'auth0-password-reset': path.join(__dirname, pageDirPath, 'auth0/password-reset'),
    advice: path.join(__dirname, pageDirPath, 'advice/listing'),
    'advice-add': path.join(__dirname, pageDirPath, 'advice/add'),
    'advice-edit': path.join(__dirname, pageDirPath, 'advice/edit'),
    'content-page': path.join(__dirname, pageDirPath, 'content-pages/listing'),
    'content-page-add': path.join(__dirname, pageDirPath, 'content-pages/add'),
    'content-page-edit': path.join(__dirname, pageDirPath, 'content-pages/edit'),
    dashboard: path.join(__dirname, pageDirPath, 'dashboard/')
  },
  output: {
    path: path.join(__dirname, '/_dist/assets/js/'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/assets/js/'
  },
  plugins: plugins,
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  standard: {
    parser: 'babel-eslint'
  }
}
