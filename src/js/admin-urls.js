var htmlfe = '.html'

var s = function (page) {
  return page + htmlfe
}

module.exports = {
  login: '/',
  dashboard: s('dashboard')
}
