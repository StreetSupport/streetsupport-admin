var env = require('./env')

var dev = 'http://localhost:55881' // eslint-disable-line
var staging = 'http://streetsupport-api-staging.apphb.com' // eslint-disable-line
var live = 'http://api.streetsupport.net' // eslint-disable-line

var envs = [dev, staging, live]

function p (addr) {
  return envs[env] + addr
}

var getServiceProviders = '/v1/all-service-providers'
var getServiceCategories = '/v2/service-categories'
var verifiedUsers = '/v1/verified-users'
var unverifiedUsers = '/v1/unverified-users'
var sessions = '/v1/sessions'

module.exports = {
  getServiceProviders: p(getServiceProviders),
  getServiceCategories: p(getServiceCategories),
  verifiedUsers: p(verifiedUsers),
  unverifiedUsers: p(unverifiedUsers),
  sessions: p(sessions)
}
