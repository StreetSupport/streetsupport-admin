var dev = 'http://localhost:55881' // eslint-disable-line
var staging = 'http://streetsupport-api-staging.apphb.com' // eslint-disable-line
var live = 'http://api.streetsupport.net' // eslint-disable-line

var domainRoot = staging

var createSessionUrl = '/v1/sessions/create'
var getServiceProvidersUrl = '/v2/service-providers'

module.exports = {
  createSession: domainRoot + createSessionUrl,
  getServiceProviders: domainRoot + getServiceProvidersUrl
}
