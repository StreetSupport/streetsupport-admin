var dev = 'http://localhost:55881' // eslint-disable-line
var staging = 'http://streetsupport-api-staging.apphb.com' // eslint-disable-line
var live = 'http://api.streetsupport.net' // eslint-disable-line

function p(url) {
  return staging + url
}

var createSessionUrl = '/v1/sessions/create'
var getServiceProvidersUrl = '/v2/service-providers'
var serviceProviderVerificationsUrl = '/v1/service-provider-verifications'

module.exports = {
  createSession: p(createSessionUrl),
  getServiceProviders: p(getServiceProvidersUrl),
  serviceProviderVerifications: p(serviceProviderVerificationsUrl)
}
