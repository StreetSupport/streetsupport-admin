var cookies = require('cookie-cutter')

var set = function (key, value) {
  cookies.set(key, value)
}

module.exports = {
  'set': set
}
