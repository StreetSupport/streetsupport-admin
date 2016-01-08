var FastClick = require('fastclick')
var nav = require('./../nav.js')

nav.init()
FastClick.attach(document.body)

require.ensure(['knockout', '../models/Login'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/Login')
  ko.applyBindings(new Model())
})
