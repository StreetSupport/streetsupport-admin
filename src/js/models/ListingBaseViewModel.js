import ListingPagination from './ListingPagination'

const ko = require('knockout')
const ajax = require('../ajax')
const browser = require('../browser')
const BaseViewModel = require('./BaseViewModel')

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

  self.buildGetUrl = (existingFilters = null) => {
    function getQsFromFilters () {
      const filters = self.vm.filters
        .filter((f) => f.isSet(f.getValue(self.vm)))
        .map((f) => `${f.key}=${f.getValue(self.vm)}`)

      const paginationParts = [
        { key: 'pageSize', value: self.pagination.pageSize },
        { key: 'index', value: self.pagination.index }
      ]
        .map((kvp) => `${kvp.key}=${kvp.value}`)

      return [...filters, ...paginationParts]
        .join('&')
    }

    const qs = existingFilters
      ? existingFilters.substr(1)
      : getQsFromFilters()

    return {
      baseUrl: self.vm.baseUrl,
      qs,
      fullUrl: `${self.vm.baseUrl}?${qs}`
    }
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

  self.setFiltersFromQs = function () {
    const querystring = browser.search()

    if (querystring !== undefined && querystring.length > 0) {
      const allQsFilters = querystring
        .substr(1)
        .split('&')
        .map((kvp) => {
          const [key, value] = kvp.split('=')
          return { key, value }
        })

      self.pagination.pageSize = Number(allQsFilters.find((kvp) => kvp.key === 'pageSize').value)
      self.pagination.index = Number(allQsFilters.find((kvp) => kvp.key === 'index').value)

      allQsFilters
        .filter((f) => self.vm.filters.map((f) => f.key).includes(f.key))
        .forEach((qsf) => {
          self.vm.filters
            .find((f) => f.key === qsf.key)
            .setValue(self.vm, qsf.value)
        })
    }
  }

  self.init = function (vm) {
    self.vm = vm

    self.setFiltersFromQs()
    self.loadDocuments()
  }

  self.submitSearch = function () {
    self.pagination.changePage(1)
  }

  self.loadDocuments = function (existingFilters = null) {
    browser.loading()

    const getUrl = self.buildGetUrl(existingFilters)
    browser.pushHistory({}, '', `?${getUrl.qs}`)

    // We generate this for retrieving the not cached item
    const syntaxSugar = new Date().getTime()
    ajax
      .get(getUrl.fullUrl + `&unique=${syntaxSugar}`)
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
