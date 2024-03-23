'use strict'

var ko = require('knockout')
var GroupedService = require('../GroupedService')
var BaseViewModel = require('../BaseViewModel')
var getUrlParameter = require('../../get-url-parameter')
var ajax = require('../../ajax')
var browser = require('../../browser')
var adminUrls = require('../../admin-urls')

function Category (data, selectedSubCats) {
  const isSelected = (subcatId) => {
    return selectedSubCats.filter((sc) => sc.id === subcatId).length === 1
  }

  this.id = ko.observable(data.key)
  this.name = ko.observable(data.name)
  this.isSelected = ko.observable(isSelected(data.key))
}

function EditServiceProviderService () {
  var self = this

  self.service = ko.observable()

  self.allSubCatsSelected = ko.observable(false)

  const toggleAllSubCats = (isSelected) => {
    for (let i = 0; i < self.service().subCategories().length; i++) {
      self.service().subCategories()[i].isSelected(isSelected)
    }
  }

  self.allSubCatsSelected.subscribe((newValue) => {
    toggleAllSubCats(newValue)
  })

  self.init = function () {
    browser.loading()

    const checkReady = () => {
      if (self.serviceData !== undefined && self.categoryData !== undefined) {
        self.service(new GroupedService(self.serviceData))
        self.service().addListener(self)

        const category = self.categoryData.filter((c) => c.key === self.service().categoryId)[0]
        self.service().subCategories(category.subCategories
          .sort((a, b) => {
            if (a.name < b.name) return -1
            if (a.name > b.name) return 1
            return 0
          })
          .map((c) => new Category(c, self.serviceData.subCategories)))
        browser.loaded()
      }
    }

    const gotServices = (result) => {
      self.serviceData = result.data
      self.serviceProviderId = getUrlParameter.parameter('providerId')
      checkReady()
    }

    var serviceProviderEndpoint = self.endpointBuilder
      .serviceProviders(getUrlParameter.parameter('providerId'))
      .services(getUrlParameter.parameter('serviceId'))
      .build()

    ajax.get(serviceProviderEndpoint, {})
      .then(gotServices,
        function (error) {
          self.handleError(error)
        })

    const gotCategories = (result) => {
      self.categoryData = result.data
      checkReady()
    }

    var categoryEndpoint = self.endpointBuilder.categories().build()

    ajax.get(categoryEndpoint, {})
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
