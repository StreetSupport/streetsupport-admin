var dev = 'http://localhost:55881' // eslint-disable-line
var staging = 'http://streetsupport-api-staging.apphb.com' // eslint-disable-line
var live = 'http://api.streetsupport.net' // eslint-disable-line

function p (addr) {
  return dev + addr
}

var createSession = '/v1/sessions/create'
var getServiceProviders = '/v1/all-service-providers'
var serviceProviderVerifications = '/v1/verified-service-providers'
var serviceProviderPublished = '/v1/published-service-providers'
var serviceProviderDetails = '/v1/service-provider-details'
var serviceProviderContactDetails = '/v1/service-provider-contact-information'
var serviceProviderAddresses = '/v1/service-providers-addresses'

module.exports = {
  createSession: p(createSession),
  getServiceProviders: p(getServiceProviders),
  serviceProviderVerifications: p(serviceProviderVerifications),
  serviceProviderPublished: p(serviceProviderPublished),
  serviceProviderDetails: p(serviceProviderDetails),
  serviceProviderContactDetails: p(serviceProviderContactDetails),
  serviceProviderAddresses: p(serviceProviderAddresses)
}
