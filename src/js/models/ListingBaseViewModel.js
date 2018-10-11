const ko = require('knockout')

const ajax = require('../ajax')
const browser = require('../browser')
const BaseViewModel = require('./BaseViewModel')
import ListingPagination from './ListingPagination'

function ListingBaseViewModel () {
  const self = this

  self.pagination = new ListingPagination(self)
  self.paginationLinks = ko.observableArray([])
  self.items = ko.observableArray()

  self.buildGetUrl = () => {
    const filterQueryString = self.vm.filters
      .filter((f) => f.isSet(f.getValue(self.vm)))
      .map((f) => `${f.key}=${f.getValue(self.vm)}`)
      .join('&')

    return `${self.vm.baseUrl}?pageSize=${self.pagination.pageSize}&index=${self.pagination.index}&${filterQueryString}`
  }

  self.init = function (vm) {
    self.vm = vm

    self.loadDocuments()
  }

  self.loadDocuments = function () {
    browser.loading()
    ajax
      .get(self.buildGetUrl(), {})
      .then(function (result) {
        self.pagination.updateData(result.data)
        self.items(result.data.items.map((i) => self.vm.mapItems(i)))

        browser.loaded()
      },
        function (error) {
          self.handleError(error)
        })
  }
}

ListingBaseViewModel.prototype = new BaseViewModel()

module.exports = ListingBaseViewModel
