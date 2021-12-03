const ko = require('knockout')
const htmlencode = require('htmlencode')
const ListingBaseViewModel = require('../ListingBaseViewModel')

const Model = function () {
  const self = this
  self.nameToFilterOn = ko.observable()

  self.mapItems = (i) => {
    return {
      id: ko.observable(i.id),
      editUrl: ko.observable(`edit?id=${i.id}`),
      name: ko.observable(htmlencode.htmlDecode(i.name)),
      tags: ko.observable(i.tags)
    }
  }
  self.filters = [
    { key: 'searchTerm', setValue: (vm, value) => vm.nameToFilterOn(value), getValue: (vm) => { return vm.nameToFilterOn() ? vm.nameToFilterOn().trim() : vm.nameToFilterOn() }, isSet: (val) => val !== undefined && val.length > 0 }
  ]
  self.baseUrl = self.endpointBuilder.parentScenarios().build() + '/list'

  self.init(self)
}

Model.prototype = new ListingBaseViewModel()

module.exports = Model
