var endpoints = require('./api-endpoints')

function EndpointBuilder () {
  var self = this

  self.updateBaseResource = function (resource, resourceId) {
    self.baseResource = resource
    self.baseResourceId = resourceId
    self.childResource = undefined
    self.childResourceId = undefined
  }

  self.serviceProviders = function (providerId) {
    self.updateBaseResource(endpoints.getServiceProviders, providerId)
    return self
  }

  self.verifiedUsers = function (userId) {
    self.updateBaseResource(endpoints.verifiedUsers, userId)
    return self
  }

  self.unverifiedUsers = function (userId) {
    self.updateBaseResource(endpoints.unverifiedUsers, userId)
    return self
  }

  self.sessions = function (sessionToken) {
    self.updateBaseResource(endpoints.sessions, sessionToken)
    return self
  }

  self.categories = function () {
    self.updateBaseResource(endpoints.getServiceCategories)
    return self
  }

  self.resetPassword = function (verificationCode) {
    self.updateBaseResource(endpoints.resetPassword, verificationCode)
    return self
  }

  self.volunteers = function (volunteerId) {
    self.updateBaseResource(endpoints.volunteers, volunteerId)
    return self
  }

  self.addresses = function (addressId) {
    self.childResource = 'addresses'
    self.childResourceId = addressId
    return self
  }

  self.services = function (serviceId) {
    self.childResource = 'services'
    self.childResourceId = serviceId
    return self
  }

  self.needs = function (needId) {
    self.childResource = 'needs'
    self.childResourceId = needId
    return self
  }

  self.isVerified = function () {
    self.childResource = 'is-verified'
    return self
  }

  self.isPublished = function () {
    self.childResource = 'is-published'
    return self
  }

  self.generalInformation = function () {
    self.childResource = 'general-information'
    return self
  }

  self.contactDetails = function () {
    self.childResource = 'contact-details'
    return self
  }

  self.build = function () {
    var uri = self.baseResource
    if (self.baseResourceId !== undefined) {
      uri += '/' + self.baseResourceId
    }
    if (self.childResource !== undefined) {
      uri += '/' + self.childResource

      if (self.childResourceId !== undefined) {
        uri += '/' + self.childResourceId
      }
    }
    return uri
  }
}

module.exports = EndpointBuilder
