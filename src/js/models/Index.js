var cookies = require('../cookies')
var browser = require('../browser')
var adminUrls = require('../admin-urls')
var _ = require('lodash')

function Index() {
  var self = this
  self.init = function () {
    var AuthClaims = cookies.get('auth-claims')
    if(AuthClaims === null || AuthClaims.length === 0) browser.redirect(adminUrls.login)
    if(_.includes(AuthClaims, 'SuperAdmin')) browser.redirect(adminUrls.dashboard)

    var adminForPrefix = 'AdminFor:'

    var adminFor = _.find(AuthClaims, function (claim) {
      return claim.startsWith(adminForPrefix)
    })

    if(adminFor !== undefined) {
      browser.redirect(adminUrls.serviceProviders + '?key=' + adminFor.substring(adminForPrefix.length))
    }
  }

  self.init()
}

module.exports = Index
