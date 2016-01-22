var ko = require('knockout')
var Address = require('../Address')

function AddServiceProviderAddress () {
  var self = this
  self.address = ko.observable(new Address({}))
}

module.exports = AddServiceProviderAddress
