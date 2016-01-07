var cookies = require('cookie-cutter')

var set = function (key, value) {
  console.log(cookies)
  console.log(key)
  console.log(value)
  cookies.set(key, value)
}

module.exports = {
  'set': set
}
