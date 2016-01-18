var ko = require('knockout')
var _ = require('lodash')
var ajax = require('basic-ajax')
var Endpoints = require('../endpoint-builder')
var getUrlParameter = require('../get-url-parameter')
var cookies = require('../cookies')
var OpeningTime = require('./OpeningTime')

function Service(data) {
  var self = this

  self.name = ko.observable(data.name)
  self.info = ko.observable(data.info)
  self.tags = ko.observable(data.tags)
  self.openingTimes = ko.observableArray(data.openingTimes.map(ot => new OpeningTime(ot)))

  self.isEditing = ko.observable(false)
  self.message = ko.observable()
}

module.exports = Service
