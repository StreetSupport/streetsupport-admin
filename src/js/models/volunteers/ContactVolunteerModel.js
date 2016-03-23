var BaseViewModel = require('../BaseViewModel')
var browser = require('../../browser')

var ContactVolunteerModel = function () {
  var self = this

  self.submit = function () {
    browser.loading()
  }
}

ContactVolunteerModel.prototype = new BaseViewModel()

module.exports = ContactVolunteerModel
