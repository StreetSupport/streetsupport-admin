var endpoints = require('./api-endpoints')

function EndpointBuilder () {
  var self = this

  self.updateBaseResource = (resource, resourceId) => {
    self.baseResource = resource
    self.baseResourceId = resourceId
    self.childResource = undefined
    self.childResourceId = undefined
  }

  self.serviceProviders = (providerId) => {
    self.updateBaseResource(endpoints.getServiceProviders, providerId)
    return self
  }

  self.serviceProvidersHAL = (providerId) => {
    self.updateBaseResource(endpoints.getServiceProvidersHAL, providerId)
    return self
  }

  self.verifiedUsers = (userId) => {
    self.updateBaseResource(endpoints.verifiedUsers, userId)
    return self
  }

  self.unverifiedUsers = (userId) => {
    self.updateBaseResource(endpoints.unverifiedUsers, userId)
    return self
  }

  self.sessions = (sessionToken) => {
    self.updateBaseResource(endpoints.sessions, sessionToken)
    return self
  }

  self.categories = () => {
    self.updateBaseResource(endpoints.getServiceCategories)
    return self
  }

  self.resetPassword = (verificationCode) => {
    self.updateBaseResource(endpoints.resetPassword, verificationCode)
    return self
  }

  self.volunteers = (volunteerId) => {
    self.updateBaseResource(endpoints.volunteers, volunteerId)
    return self
  }

  self.offersOfItems = (offerOfItemsId) => {
    self.updateBaseResource(endpoints.offersOfItems, offerOfItemsId)
    return self
  }

  self.charterPledges = (pledgeId) => {
    self.updateBaseResource(endpoints.charterPledges, pledgeId)
    return self
  }

  self.mailingListMembers = () => {
    self.updateBaseResource(endpoints.mailingListMembers)
    return self
  }

  self.users = () => {
    self.updateBaseResource(endpoints.users)
    return self
  }

  self.actionGroups = (groupId) => {
    self.updateBaseResource(endpoints.actionGroups, groupId)
    return self
  }

  self.cities = (cityId) => {
    self.updateBaseResource(endpoints.cities, cityId)
    return self
  }

  self.addresses = (addressId) => {
    self.childResource = 'addresses'
    self.childResourceId = addressId
    return self
  }

  self.services = (serviceId) => {
    self.childResource = 'services'
    self.childResourceId = serviceId
    return self
  }

  self.needs = (needId) => {
    self.childResource = 'needs'
    self.childResourceId = needId
    return self
  }

  self.isVerified = () => {
    self.childResource = 'is-verified'
    return self
  }

  self.isPublished = () => {
    self.childResource = 'is-published'
    return self
  }

  self.generalInformation = () => {
    self.childResource = 'general-information'
    return self
  }

  self.donationInformation = () => {
    self.childResource = 'donation-information'
    return self
  }

  self.contactDetails = () => {
    self.childResource = 'contact-details'
    return self
  }

  self.approval = () => {
    self.childResource = 'approval'
    return self
  }

  self.featured = () => {
    self.childResource = 'featured'
    return self
  }

  self.pledge = () => {
    self.childResource = 'pledge'
    return self
  }

  self.deleted = () => {
    self.childResource = 'deleted'
    return self
  }

  self.build = () => {
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
