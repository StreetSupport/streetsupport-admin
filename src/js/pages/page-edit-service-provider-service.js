var FastClick = require('fastclick')
var nav = require('./../nav.js')

nav.init()
FastClick.attach(document.body)

require.ensure(['knockout', '../models/service-provider-services/EditServiceProviderService'], function (require) {
  var ko = require('knockout')
  var Model = require('../models/service-provider-services/EditServiceProviderService')
  ko.applyBindings(new Model())
})
