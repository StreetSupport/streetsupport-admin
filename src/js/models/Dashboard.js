var ajax = require('basic-ajax')
var endpoints = require('../api-endpoints')
var adminUrls = require('../admin-urls')
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
      self.serviceProviders(mapServiceProviders(result.json))
    },
    function (error) {

    })
}

function mapServiceProviders(data) {
  return _
    .chain(data)
    .sortBy('key')
    .map(function (sp) {
      return {
        'key': sp.key,
        'name': sp.name,
        'url': adminUrls.serviceProviders + '?key=' + sp.key,
        'verifiedLabel': sp.isVerified ? 'verified' : 'under review',
        'toggleVerificationButtonLabel': sp.isVerified ? 'un-verify' : 'verify',
        'publishedLabel': sp.isPublished ? 'published' : 'disabled',
        'togglePublishButtonLabel': sp.isPublished ? 'disable' : 'publish'
      }
    })
    .value()
}

module.exports = DashboardModel
