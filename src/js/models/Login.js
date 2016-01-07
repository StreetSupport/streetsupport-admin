var api = require('../get-api-data')
var cookies = require('browser-cookies')

function LoginModel () {
  this.username = ''
  this.password = ''
}

LoginModel.prototype.submit = function () {
  api.postData('', {
    'username': this.username,
    'password': this.password
  }).then(function (result) {
    cookies.set('session-token', result.data.sessionToken)
  })
}

module.exports = LoginModel
