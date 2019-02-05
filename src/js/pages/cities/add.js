import '../../common'

require.ensure(['knockout', '../../models/cities/AddModel'], function (require) {
  const ko = require('knockout')
  const Model = require('../../models/cities/AddModel')
  ko.applyBindings(new Model())
})
