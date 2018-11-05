const ko = require('knockout')
const htmlencode = require('htmlencode')

const ListingBaseViewModel = require('../ListingBaseViewModel')

const Model = function () {
  const self = this

  self.mapItems = (i) => {
    return {
      id: ko.observable(i.id),
      editUrl: ko.observable(`edit?id=${i.id}`),
      title: ko.observable(htmlencode.htmlDecode(i.title)),
      locationKey: ko.observable(i.locationKey),
      tags: ko.observable(i.tags)
    }
  }
  self.filters = []
  self.baseUrl = self.endpointBuilder.faqs().build()

  self.init(self)
}

Model.prototype = new ListingBaseViewModel()

module.exports = Model
