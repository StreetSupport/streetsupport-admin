var dev = 'http://localhost:55881' // eslint-disable-line
var staging = 'http://streetsupport-api-staging.apphb.com' // eslint-disable-line
var live = 'http://api.streetsupport.net' // eslint-disable-line

function p (addr) {
  return dev + addr
}

var createSession = '/v1/sessions/create'
var getServiceProviders = '/v1/all-service-providers'
var getServiceCategories = '/v2/service-categories'

module.exports = {
  createSession: p(createSession),
  getServiceProviders: p(getServiceProviders),
  getServiceCategories: p(getServiceCategories)
}
