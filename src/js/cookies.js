var cookies = require('cookie-cutter')

var set = function (key, value) {
  cookies.set(key, value)
}

var get = function (key) {
  return cookies.get(key)
}

module.exports = {
  'set': set,
  'get': get
}
