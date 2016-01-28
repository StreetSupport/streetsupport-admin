var cookieCutter = require('cookie-cutter')

var set = function (key, value) {
  cookieCutter.set(key, value)
}

var get = function (key) {
  return cookieCutter.get(key)
}

module.exports = {
  'set': set,
  'get': get
}
