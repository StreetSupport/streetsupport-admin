const ko = require('knockout')

const ajax = require('../ajax')
const browser = require('../browser')
const BaseViewModel = require('./BaseViewModel')
import ListingPagination from './ListingPagination'

function ListingBaseViewModel () {
  const self = this

  self.pagination = new ListingPagination(self, 10)
  self.paginationLinks = ko.observableArray([])
  self.items = ko.observableArray()
  self.csvItems = ko.observableArray()

  self.viewingAsCsv = ko.observable(false)
  self.previousPageSize = self.pagination.pageSize
  self.previousIndex = self.pagination.index
  self.hasOptedInFilter = ko.observable(false)

  self.viewAsCsv = function () {
    self.viewingAsCsv(!self.viewingAsCsv())
    if (!self.viewingAsCsv()) {
      self.pagination.pageSize = self.previousPageSize
      self.pagination.index = self.previousIndex
      self.loadDocuments()
    } else {
      self.previousIndex = self.pagination.index
      self.pagination.pageSize = 1000
      self.pagination.index = 0

      self.hasOptedInFilter(self.vm.filterOnIsOptedIn !== undefined)

      if (self.hasOptedInFilter) {
        self.vm.filterOnIsOptedIn(true)
      }

      self.loadDocuments()
    }
  }

  self.buildGetUrl = () => {
    const filters = self.vm.filters
      .filter((f) => f.isSet(f.getValue(self.vm)))
      .map((f) => `${f.key}=${f.getValue(self.vm)}`)

    const paginationParts = [
<<<<<<< HEAD
      { key: 'pageSize', value: self.pagination.pageSize },
      { key: 'index', value: self.pagination.index }
=======
     { key: 'pageSize', value: self.pagination.pageSize },
     { key: 'index', value: self.pagination.index }
>>>>>>> paginate and search charter supporters
    ]
      .map((kvp) => `${kvp.key}=${kvp.value}`)

    const qs = [...filters, ...paginationParts]
      .join('&')

    return `${self.vm.baseUrl}?${qs}`
  }

  self.delete = function (item) {
    const id = item.id()
    ajax
      .delete(`${self.vm.baseUrl}/${id}`)
      .then(function () {
        self.items(self.items().filter((i) => i.id() !== id))

        browser.loaded()
      },
        function (error) {
          self.handleError(error)
        })
  }

  self.init = function (vm) {
    self.vm = vm
    self.loadDocuments()
  }

  self.submitSearch = function () {
    self.pagination.changePage(1)
  }

  self.loadDocuments = function () {
    browser.loading()
    ajax
      .get(self.buildGetUrl())
      .then(function (result) {
        browser.loaded()
        self.pagination.updateData(result.data)
        self.items(result.data.items.map((i) => self.vm.mapItems(i)))
        if (self.viewingAsCsv() && self.vm.mapCsvItems) {
          self.csvItems(result.data.items.map((i) => self.vm.mapCsvItems(i)))
        }
      },
        function (error) {
          self.handleError(error)
        })
  }
}

ListingBaseViewModel.prototype = new BaseViewModel()

module.exports = ListingBaseViewModel
