var htmlfe = '.html'

var s = function (page) {
  return page + htmlfe
}

module.exports = {
  login: s('login'),
  dashboard: s('dashboard'),
  serviceProviders: s('service-providers'),
  notFound: s('404'),
  serviceProviderAddresses: s('service-provider-addresses'),
  serviceProviderAddressesAdd: s('add-service-provider-address'),
  serviceProviderAddressesEdit: s('edit-service-provider-address'),
  serviceProviderAddressesDelete: s('delete-service-provider-address'),
  serviceProviderServices: s('service-provider-services'),
  serviceProviderServicesAdd: s('add-service-provider-service'),
  serviceProviderServicesEdit: s('edit-service-provider-service'),
  userAdd: s('add-user')
}
