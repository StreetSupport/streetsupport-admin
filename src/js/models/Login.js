var api = require('../get-api-data')
var endpoints = require('../api-endpoints')
var browser = require('../browser')
var cookies = require('browser-cookies')

function LoginModel () {
  this.username = ''
  this.password = ''
}

LoginModel.prototype.submit = function () {
  api.postData(endpoints.createSessionUrl, {
    'username': this.username,
    'password': this.password
  }).then(function (result) {
    cookies.set('session-token', result.data.sessionToken)
    browser.redirect('/dashboard')
  })
}

module.exports = LoginModel
