var ajax = require('basic-ajax')
var Endpoints = require('../endpoint-builder')
var adminUrls = require('../admin-urls')
var cookies = require('../cookies')
var Address = require('./Address')
var getUrlParameter = require('../get-url-parameter')
var ko = require('knockout')
var _ = require('lodash')
var guid = require('node-uuid')

function ServiceProviderServices() {
  var self = this
}

module.exports = ServiceProviderServices
