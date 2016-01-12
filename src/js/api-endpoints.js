var dev = 'http://localhost:55881' // eslint-disable-line
var staging = 'http://streetsupport-api-staging.apphb.com' // eslint-disable-line
var live = 'http://api.streetsupport.net' // eslint-disable-line

function p (url) {
  return staging + url
}

var createSessionUrl = '/v1/sessions/create'
var getServiceProvidersUrl = '/v1/all-service-providers'
var serviceProviderVerificationsUrl = '/v1/verified-service-providers'
var serviceProviderPublishedUrl = '/v1/published-service-providers'
var serviceProviderDetailsUrl = '/v1/service-provider-details'
var serviceProviderContactDetailsUrl = '/v1/service-provider-contact-details'

module.exports = {
  createSession: p(createSessionUrl),
  getServiceProviders: p(getServiceProvidersUrl),
  serviceProviderVerifications: p(serviceProviderVerificationsUrl),
  serviceProviderPublished: p(serviceProviderPublishedUrl),
  serviceProviderDetails: p(serviceProviderDetailsUrl),
  serviceProviderContactDetails: p(serviceProviderContactDetailsUrl)
}
