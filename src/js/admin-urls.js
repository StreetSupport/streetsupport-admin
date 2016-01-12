var htmlfe = '.html'

var s = function (page) {
  return page + htmlfe
}

module.exports = {
  login: '/',
  dashboard: s('dashboard'),
  serviceProviders: s('service-providers'),
  notFound: s('404'),
  serviceProviderAddresses: s('service-provider-addresses')
}
