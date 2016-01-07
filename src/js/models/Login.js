var api = require('../get-api-data')
var endpoints = require('../api-endpoints')
var adminUrls = require('../admin-urls')
var browser = require('../browser')
var cookies = require('browser-cookies')

function LoginModel () {
  this.username = ''
  this.password = ''
  this.message = ''
}

LoginModel.prototype.submit = function () {
  var self = this
  api.postData(endpoints.createSessionUrl, {
    'username': self.username,
    'password': self.password
  }).then(function (result) {
    if(result.statusCode === 201) {
      cookies.set('session-token', result.data.sessionToken)
      browser.redirect(adminUrls.dashboard)
    }else {
      self.message = result.message
    }
  })
}

module.exports = LoginModel
