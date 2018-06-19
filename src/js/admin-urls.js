var htmlfe = '.html'

var s = function (page) {
  return page + htmlfe
}

module.exports = {
  redirector: s('/index'),
  fiveHundred: s('/500'),
  login: '/login',
  dashboard: s('/dashboard'),
  serviceProviders: s('/service-providers'),
  notFound: s('/404'),
  serverError: s('/500'),
  serviceProviderAddresses: s('/service-provider-addresses'),
  serviceProviderAddressesAdd: s('/add-service-provider-address'),
  serviceProviderAddressesEdit: s('/edit-service-provider-address'),
  serviceProviderAddressesDelete: s('/delete-service-provider-address'),
  serviceProviderServices: s('/service-provider-services'),
  serviceProviderServicesAdd: s('/add-service-provider-service'),
  serviceProviderServicesEdit: s('/edit-service-provider-service'),
  serviceProviderNeedsAdd: s('/add-service-provider-need'),
  serviceProviderNeedsEdit: s('/edit-service-provider-need'),
  userAdd: s('/add-user'),
  contactVolunteer: s('/contact-volunteer'),
  shareVolunteer: s('/share-volunteer'),
  contactAboutOffer: '/offers-of-items/contact/',
  shareOffer: '/offers-of-items/share',
  actionGroups: '/action-groups/',
  charter: s('/charter-pledges'),
  serviceProviderNeedCategoriesEdit: s('/edit-service-provider-need-categories'),
  needOffers: '/needs/responses',
  temporaryAccommodation: '/accommodation'
}
