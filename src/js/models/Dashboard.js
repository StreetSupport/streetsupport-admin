var ajax = require('basic-ajax')
var endpoints = require('../api-endpoints')
var ko = require('knockout')
var _ = require('lodash')

function DashboardModel () {
  this.serviceProviders = ko.observableArray()
  this.message = ko.observable('hello world')

  this.init()
}

DashboardModel.prototype.init = function () {
  var self = this

  ajax
    .getJson(endpoints.getServiceProviders)
    .then(function (result) {
      var serviceProviders = _
        .chain(result.json)
        .sortBy('key')
        .map(function(sp) {
          return {
            'key': sp.key,
            'name': sp.name,
            'url': 'service-providers.html?key=' + sp.key,
          }
        })
        .value()
      self.serviceProviders(serviceProviders)
    },
    function (error) {

    })
}

module.exports = DashboardModel
