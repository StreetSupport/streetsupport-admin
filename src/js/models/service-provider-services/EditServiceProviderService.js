var ko = require('knockout')
var Address = require('../Address')
var Service = require('../Service')
var OpeningTime = require('../OpeningTime')
var Endpoints = require('../../endpoint-builder')
var getUrlParameter = require('../../get-url-parameter')
var cookies = require('../../cookies')
var ajax = require('basic-ajax')
var browser = require('../../browser')
var adminUrls = require('../../admin-urls')

function SubCat (key, name) {
  var self = this
  self.key = key
  self.name = name
  self.isSelected = ko.observable(false)
}

function EditServiceProviderService () {
  var self = this

  self.service = ko.observable()


  self.init = function () {
    var headers = {
      'content-type': 'application/json',
      'session-token': cookies.get('session-token')
    }
    var serviceProviderEndpoint = new Endpoints()
      .serviceProviders(getUrlParameter.parameter('providerId'))
      .services(getUrlParameter.parameter('serviceId'))
      .build()

    ajax.get(serviceProviderEndpoint, headers, {})
    .then(function (result) {
      var data = result.json
      data.serviceProviderId = getUrlParameter.parameter('providerId')
      self.service(new Service(data))
    }, function (error) {

    })
  }

  self.init()
}

module.exports = EditServiceProviderService
