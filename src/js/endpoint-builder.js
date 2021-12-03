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

  self.faqs = (faqId) => {
    self.updateBaseResource(endpoints.faqs, faqId)
    return self
  }

  self.contentPages = (contentPageId) => {
    self.updateBaseResource(endpoints.contentPages, contentPageId)
    return self
  }

  self.parentScenarios = (parentScenarioId) => {
    self.updateBaseResource(endpoints.parentScenarios, parentScenarioId)
    return self
  }

  self.serviceProviderNeeds = (needId) => {
    self.updateBaseResource(endpoints.serviceProviderNeeds, needId)
    return self
  }

  self.needResponses = () => {
    self.updateBaseResource(endpoints.needResponses)
    return self
  }

  self.publishedOrgs = (cityId) => {
    self.updateBaseResource(endpoints.getPublishedServiceProviders, cityId)
    return self
  }

  self.serviceProvidersHAL = (providerId) => {
    self.updateBaseResource(endpoints.getServiceProvidersHAL, providerId)
    return self
  }

  self.serviceProvidersv3 = (providerId) => {
    self.updateBaseResource(endpoints.getServiceProvidersv3, providerId)
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

  self.temporaryAccommodation = (id) => {
    self.updateBaseResource(endpoints.temporaryAccommodation, id)
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

  self.users = (userId) => {
    self.updateBaseResource(endpoints.users, userId)
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

  self.impactUpdates = (id) => {
    self.updateBaseResource(endpoints.impactUpdates, id)
    return self
  }

  self.needTweetMessage = () => {
    self.updateBaseResource(endpoints.needTweetMessage)
    return self
  }

  self.addresses = (addressId) => {
    self.childResource = 'addresses'
    self.childResourceId = addressId
    return self
  }

  self.address = () => {
    self.childResource = 'address'
    return self
  }

  self.features = () => {
    self.childResource = 'features'
    return self
  }

  self.pricingAndRequirements = () => {
    self.childResource = 'pricing-and-requirements'
    return self
  }

  self.supportProvided = () => {
    self.childResource = 'support-offered'
    return self
  }

  self.residentCriteria = () => {
    self.childResource = 'residents-criteria'
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

  self.adminDetails = () => {
    self.childResource = 'admin-details'
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

  self.contactInformation = () => {
    self.childResource = 'contact-details'
    return self
  }

  self.generalDetails = () => {
    self.childResource = 'general-details'
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
