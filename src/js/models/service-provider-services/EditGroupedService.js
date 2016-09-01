'use strict'

var ko = require('knockout')
var GroupedService = require('../GroupedService')
var BaseViewModel = require('../BaseViewModel')
var getUrlParameter = require('../../get-url-parameter')
var cookies = require('../../cookies')
var ajax = require('../../ajax')
var browser = require('../../browser')
var adminUrls = require('../../admin-urls')

function Category (data, selectedSubCats) {
  let isSelected = (subcatId) => {
    return selectedSubCats.filter((sc) => sc.id === subcatId).length === 1
  }

  this.id = ko.observable(data.key)
  this.name = ko.observable(data.name)
  this.isSelected = ko.observable(isSelected(data.key))
}

function EditServiceProviderService () {
  var self = this

  self.service = ko.observable()

  self.init = function () {
    browser.loading()

    let checkReady = () => {
      if (self.serviceData !== undefined && self.categoryData !== undefined) {
        self.service(new GroupedService(self.serviceData))
        self.service().addListener(self)

        let category = self.categoryData.filter((c) => c.key === self.service().categoryId)[0]
        self.service().subCategories(category.subCategories.map((c) => new Category(c, self.serviceData.subCategories)))
        browser.loaded()
      }
    }

    let gotServices = (result) => {
      self.serviceData = result.data
      self.serviceProviderId = getUrlParameter.parameter('providerId')
      checkReady()
    }

    var serviceProviderEndpoint = self.endpointBuilder
      .serviceProviders(getUrlParameter.parameter('providerId'))
      .services(getUrlParameter.parameter('serviceId'))
      .build()

    ajax.get(serviceProviderEndpoint, self.headers(cookies.get('session-token')), {})
    .then(gotServices,
    function (error) {
      self.handleError(error)
    })

    let gotCategories = (result) => {
      self.categoryData = result.data
      checkReady()
    }

    var categoryEndpoint = self.endpointBuilder.categories().build()

    ajax.get(categoryEndpoint, self.headers(cookies.get('session-token')), {})
    .then(gotCategories,
    function (error) {
      self.handleError(error)
    })
  }

  self.serviceSaved = function () {
    browser.redirect(adminUrls.serviceProviders + '?key=' + getUrlParameter.parameter('providerId'))
  }

  self.init()
}

EditServiceProviderService.prototype = new BaseViewModel()

module.exports = EditServiceProviderService
