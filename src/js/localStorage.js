/* global localStorage */

module.exports = {
  get: function (key) {
    return localStorage.getItem(key)
  },
  set: function (key, value) {
    localStorage.setItem(key, value)
  },
  remove: function (key) {
    localStorage.removeItem(key)
  }
}
