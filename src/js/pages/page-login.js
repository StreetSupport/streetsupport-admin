// Page modules
var FastClick = require('fastclick')
var nav = require('./../nav.js')

nav.init()
FastClick.attach(document.body)

require.ensure(['knockout'], function (require) {
  var ko = require('knockout')
  console.log(ko)

  function LoginModel () {
    this.username = 'vincey'
    this.password = 'wangers'
    this.message = 'hello'
  }

  ko.applyBindings(new LoginModel())
})
