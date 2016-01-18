var Endpoints = require('./api-endpoints')

function EndpointBuilder() {
  var self = this

  self.serviceProviders = function (providerId) {
    self.baseResource = Endpoints.getServiceProviders
    self.baseResourceId = providerId
    return self
  }

  self.addresses = function (addressId) {
    self.childResource = 'addresses'
    self.childResourceId = addressId
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

  self.build = function () {
    var uri = self.baseResource
    if(self.baseResourceId !== undefined) {
      uri += '/' + self.baseResourceId
    }
    if(self.childResource !== undefined) {
      uri += '/' + self.childResource

      if(self.childResourceId !== undefined) {
        uri += '/' + self.childResourceId
      }
    }
    return uri
  }
}

module.exports = EndpointBuilder
