var ajax = require('basic-ajax')
var endpoints = require('../api-endpoints')
var ko = require('knockout')

function DashboardModel () {
  this.serviceProviders = ko.observableArray()
}

DashboardModel.prototype.init = function () {
  var self = this

  ajax
    .getJson(endpoints.getServiceProviders)
    .then(function (result) {
      self.serviceProviders(result.json)
    },
    function (error) {

    })
}

module.exports = DashboardModel
