var cookies = require('../cookies')
var browser = require('../browser')
var adminUrls = require('../admin-urls')
var ajax = require('basic-ajax')
var BaseViewModel = require('./BaseViewModel')

function Index () {
  var self = this
  self.init = function () {
    var sessionToken = cookies.get('session-token')

    var adminForPrefix = 'AdminFor:'

    if (sessionToken === null || sessionToken === undefined) {
      browser.redirect(adminUrls.login)
    } else {
      ajax.get(self.endpointBuilder.sessions().build, self.headers(sessionToken), {})
        .then(function (success) {
          var authClaims = success.json.authClaims
          if (authClaims[0] === 'SuperAdmin') {
            destination = adminUrls.dashboard
            browser.redirect(destination)
          } else if (authClaims[0].startsWith(adminForPrefix)) {
            destination = adminUrls.serviceProviders + '?key=' + authClaims[0].substring(adminForPrefix.length)
            browser.redirect(destination)
          }
        }, function (error) {
          browser.redirect(adminUrls.login)
        })
    }
  }

  self.init()
}

Index.prototype = new BaseViewModel()

module.exports = Index
