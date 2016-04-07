var env = require('./env')

var local = 'http://localhost:55881' // eslint-disable-line
var dev = 'https://dev-api-streetsupport.azurewebsites.net' // eslint-disable-line
var staging = 'https://staging-api-streetsupport.azurewebsites.net' // eslint-disable-line
var live = 'https://live-api-streetsupport.azurewebsites.net' // eslint-disable-line

var envs = [local, dev, staging, live]

function p (addr) {
  return envs[env] + addr
}

var getServiceProviders = '/v1/all-service-providers'
var getServiceCategories = '/v2/service-categories'
var verifiedUsers = '/v1/verified-users'
var unverifiedUsers = '/v1/unverified-users'
var sessions = '/v1/sessions'
var resetPassword = '/v1/reset-password-applications'
var volunteers = '/v1/volunteer-enquiries'

module.exports = {
  getServiceProviders: p(getServiceProviders),
  getServiceCategories: p(getServiceCategories),
  verifiedUsers: p(verifiedUsers),
  unverifiedUsers: p(unverifiedUsers),
  sessions: p(sessions),
  resetPassword: p(resetPassword),
  volunteers: p(volunteers)
}
