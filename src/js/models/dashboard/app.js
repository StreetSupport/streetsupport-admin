import * as ko from 'knockout'
import moment from 'moment'

const adminUrls = require('../../admin-urls')
const ajax = require('../../ajax')
const EndpointBuilder = require('../../endpoint-builder')

class SearchResult {
  constructor (sp, index) {
    this.name = sp.name
    this.key = sp.key
    this.tabIndex = index
  }

  get url () {
    return `${adminUrls.serviceProviders}?key=${this.key}`
  }

  get hasUrl () {
    return this.key !== undefined
  }
}
class SPSearch {
  constructor (options) {
    this.tabIndex = options.tabIndex
    this.nameQuery = ko.observable('')
    this.searchResults = ko.observableArray([])

    this.nameQuery.subscribe((newQuery) => {
      if (newQuery.length >= 3) {
        const endpoint = `${new EndpointBuilder().serviceProvidersv3().build()}?name=${newQuery}`
        ajax
          .get(endpoint)
          .then((result) => {
            const items = result.data.items
              .map((sp, i) => new SearchResult(sp, this.tabIndex + i + 1))
            if (items.length > 0) {
              this.searchResults(items)
            } else {
              this.searchResults([
                new SearchResult({ name: 'No results' })
              ])
            }
          })
      } else {
        this.searchResults([])
      }
    })
  }

  submitSearch () {
    // swallow event of user hitting return
  }

  clear () {
    this.nameQuery('')
    this.searchResults([])
  }

  get canClearResults () {
    return this.searchResults().length > 0
  }
}

class Need {
  constructor (data) {
    this.id = data.id
    this.serviceProviderId = data.serviceProviderId
    this.serviceProviderName = data.serviceProviderName
    this.description = data.description
    this.neededDate = moment(data.neededDate).format('DD/MM/YY')
  }

  get viewSPUrl () {
    return `${adminUrls.serviceProviders}?key=${this.serviceProviderId}`
  }
}

class LatestNeeds {
  constructor () {
    this.needs = ko.observableArray([])

    ajax
      .get(`${new EndpointBuilder().serviceProviderNeeds().build()}?pageSize=10`)
      .then((result) => {
        const needs = result.data.items
          .map((n) => new Need(n))
        this.needs(needs)
      })
  }
}

function Dashboard () {
  const self = this
  self.spSearch = new SPSearch({ tabIndex: 100 })
  self.latestNeeds = new LatestNeeds()
}

module.exports = Dashboard
