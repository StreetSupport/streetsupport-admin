var ajax = require('basic-ajax')
var endpoints = require('../api-endpoints')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var getUrlParameter = require('../get-url-parameter')
var ko = require('knockout')
var _ = require('lodash')

function ServiceProvider () {
  var self = this
  self.serviceProvider = {}

  ajax
  .get(endpoints.getServiceProviders + '/show/' + getUrlParameter.parameter('key'),
    {
      'content-type': 'application/json',
      'session-token': cookies.get('session-token')
    },
    {})
  .then(function (result) {
    self.serviceProvider = result.json
  },
  function (error) {
    alert('oops, there was a problem! ' + JSON.parse(error))
  })
}

module.exports = ServiceProvider
