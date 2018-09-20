import '../../common'

require.ensure(['knockout', '../../models/service-providers/listing'], function (require) {
  var ko = require('knockout')
  var Model = require('../../models/service-providers/listing')
  ko.applyBindings(new Model())
})
