var env = require('./env')

var local = 'http://localhost:55881' // eslint-disable-line
var dev = 'https://ssn-api-dev.azurewebsites.net' // eslint-disable-line
var staging = 'https://staging-api-streetsupport.azurewebsites.net' // eslint-disable-line
var live = 'https://live-api-streetsupport.azurewebsites.net' // eslint-disable-line

var envs = [local, dev, staging, live]

function p (addr) {
  return envs[env] + addr
}

module.exports = {
  prefix: p,
  getServiceProviders: p('/v1/all-service-providers'),
  getPublishedServiceProviders: p('/v2/service-providers'),
  getServiceProvidersHAL: p('/v2/all-service-providers'),
  getServiceCategories: p('/v2/service-categories/'),
  users: p('/v1/users'),
  verifiedUsers: p('/v1/verified-users'),
  unverifiedUsers: p('/v1/unverified-users'),
  sessions: p('/v1/sessions'),
  resetPassword: p('/v1/reset-password-applications'),
  volunteers: p('/v1/volunteer-enquiries'),
  offersOfItems: p('/v1/offers-of-items'),
  charterPledges: p('/v1/charter-supporters'),
  actionGroups: p('/v1/action-groups/members'),
  mailingListMembers: p('/v1/mailing-list-members'),
  cities: p('/v1/cities'),
  needCategories: p('/v1/service-provider-needs/categories/'),
  shareVolunteer: p('/v1/volunteer-shares'),
  needTweetMessage: p('/v1/need-twitter-message'),
  needOffers: p('/v1/service-provider-needs'),
  impactUpdates: p('/v1/impact-updates'),
  temporaryAccommodation: p('/v1/accommodation')
}
