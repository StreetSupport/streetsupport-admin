const ko = require('knockout')
const htmlencode = require('htmlencode')

const auth = require('../../auth')
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
    { key: 'type', getValue: (vm) => vm.typeToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 },
    { key: 'searchTerm', getValue: (vm) => vm.nameToFilterOn(), isSet: (val) => val !== undefined && val.length > 0 }
    // { key: 'tags', getValue: (vm) => 'alone', isSet: (val) => val !== undefined && val.length > 0 }, 
    // { key: 'parentScenarioId', getValue: (vm) => '5f69bf51a27c1c3b84fe6448', isSet: (val) => val !== undefined && val.length > 0 }
  ]
  self.baseUrl = self.endpointBuilder.contentPages().build()

  self.init(self)
}

Model.prototype = new ListingBaseViewModel()

module.exports = Model
