var cookies = require('../cookies')
var browser = require('../browser')
var adminUrls = require('../admin-urls')
var _ = require('lodash')

function Index() {
  var self = this
  self.init = function () {
    var AuthClaims = cookies.get('auth-claims')

    console.log('AuthClaims: ' + AuthClaims)

    if (AuthClaims === null || AuthClaims === undefined || AuthClaims.length === 0) {
      browser.redirect(adminUrls.login)
    } else if (AuthClaims === 'SuperAdmin') {
      browser.redirect(adminUrls.dashboard)
    } else {
      var adminForPrefix = 'AdminFor:'
      if(AuthClaims.startsWith(adminForPrefix)) {
        browser.redirect(adminUrls.serviceProviders + '?key=' + AuthClaims.substring(adminForPrefix.length))
      }
    }
  }

  self.init()
}

module.exports = Index
