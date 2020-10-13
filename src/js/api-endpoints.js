var env = require('./env')

var local = 'http://localhost:55881' // eslint-disable-line
var dev = 'https://ssn-api-dev.azurewebsites.net' // eslint-disable-line
var staging = 'https://ssn-api-uat.azurewebsites.net' // eslint-disable-line
var live = 'https://ssn-api-prod.azurewebsites.net' // eslint-disable-line

var envs = [local, dev, staging, live]

function p (addr) {
  return envs[env] + addr
}

module.exports = {
  prefix: p,
  actionGroups: p('/v1/action-groups/members'),
  charterPledges: p('/v1/charter-supporters'),
  cities: p('/v1/cities'),
  clientGroups: p('/v1/client-groups'),
  faqs: p('/v1/faqs'),
  getPublishedServiceProviders: p('/v2/service-providers'),
  getServiceCategories: p('/v2/service-categories/'),
  getServiceProviders: p('/v1/all-service-providers'),
  getServiceProvidersHAL: p('/v2/all-service-providers'),
  getServiceProvidersv3: p('/v3/service-providers'),
  impactUpdates: p('/v1/impact-updates'),
  mailingListMembers: p('/v1/mailing-list-members'),
  needCategories: p('/v1/service-provider-needs/categories/'),
  needTweetMessage: p('/v1/need-twitter-message'),
  offersOfItems: p('/v1/offers-of-items'),
  resetPassword: p('/v1/reset-password-applications'),
  serviceProviderNeeds: p('/v2/service-provider-needs'),
  needResponses: p('/v2/service-provider-needs/responses'),
  shareVolunteer: p('/v1/volunteer-shares'),
  temporaryAccommodation: p('/v1/accommodation'),
  unverifiedCityAdmins: p('/v1/unverified-city-admins'),
  unverifiedSuperAdmins: p('/v1/unverified-super-admins'),
  charterAdmins: p('/v1/charter-admins'),
  accomReviewAdmins: p('/v1/accommodation-review-admins'),
  accomProviderAdmins: p('/v1/accommodation-provider-admins'),
  unverifiedUsers: p('/v1/unverified-users'),
  users: p('/v1/users'),
  verifiedUsers: p('/v1/verified-users'),
  volunteerCategories: p('/v1/volunteer-categories'),
  volunteers: p('/v1/volunteer-enquiries'),
  parentScenarios: p('/v1/parent-scenarios'),
  contentPages: p('/v1/content-pages')
}
