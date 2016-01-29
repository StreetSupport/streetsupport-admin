var cookies = require('../cookies')
var browser = require('../browser')
var adminUrls = require('../admin-urls')
var _ = require('lodash')

function Index() {
  var self = this
  self.init = function () {
    var AuthClaims = cookies.get('auth-claims')

    console.log('AuthClaims: ' + AuthClaims)

    var destination

    if (AuthClaims === null || AuthClaims === undefined || AuthClaims.length === 0) {
      destination = adminUrls.login
    } else if (AuthClaims === 'SuperAdmin') {
      destination = adminUrls.dashboard
    } else {
      var adminForPrefix = 'AdminFor:'
      if(AuthClaims.startsWith(adminForPrefix)) {
        destination = adminUrls.serviceProviders + '?key=' + AuthClaims.substring(adminForPrefix.length)
      }
    }

    console.log('destination: ' + destination)
    browser.redirect(destination)
  }

  self.init()
}

module.exports = Index
