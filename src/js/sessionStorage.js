/* global sessionStorage */

module.exports = {
  get: function (key) {
    return sessionStorage.getItem(key)
  },
  set: function (key, value) {
    sessionStorage.setItem(key, value)
  },
  remove: function (key) {
    sessionStorage.removeItem(key)
  }
}
