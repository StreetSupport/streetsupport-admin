var ajax = require('basic-ajax')
var endpoints = require('../api-endpoints')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
// var browser = require('../browser')
var getUrlParameter = require('../get-url-parameter')
// var ko = require('knockout')
// var _ = require('lodash')

function ServiceProviderAddresses () {
  var self = this

  self.init = function () {
    ajax.get(endpoints.serviceProviderAddresses + '/show/' + getUrlParameter.parameter('key'),
      {
        'content-type': 'application/json',
        'session-token': cookies.get('session-token')
      },
      {})
      .then(function (result) {
      },
      function (error) {
      })
  }

  self.init ()
}

module.exports = ServiceProviderAddresses
