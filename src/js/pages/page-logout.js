var FastClick = require('fastclick')
var nav = require('./../nav.js')

nav.init()
FastClick.attach(document.body)

require.ensure(['knockout', '../models/Logout'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/Logout')
  ko.applyBindings(new Model())
})
