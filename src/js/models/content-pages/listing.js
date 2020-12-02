const ko = require('knockout')
const htmlencode = require('htmlencode')
const ListingBaseViewModel = require('../ListingBaseViewModel')

const Model = function () {
  const self = this
  self.availableTypes = ko.observableArray(['advice', 'guides'])
  self.nameToFilterOn = ko.observable()
  self.typeToFilterOn = ko.observable('advice')

  self.mapItems = (i) => {
    return {
      id: ko.observable(i.id),
      editUrl: ko.observable(`edit?id=${i.id}`),
      title: ko.observable(htmlencode.htmlDecode(i.title)),
      type: ko.observable(i.type),
      tags: ko.observable(i.tags)
    }
  }
  self.filters = [
    { key: 'type', setValue: (vm, value) => vm.typeToFilterOn(value), getValue: (vm) => vm.typeToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'searchTerm', setValue: (vm, value) => vm.nameToFilterOn(value), getValue: (vm) => { return vm.nameToFilterOn() ? vm.nameToFilterOn().trim() : vm.nameToFilterOn() }, isSet: (val) => val !== undefined && val.length > 0 }
  ]
  self.baseUrl = self.endpointBuilder.contentPages().build()

  self.init(self)
}

Model.prototype = new ListingBaseViewModel()

module.exports = Model
