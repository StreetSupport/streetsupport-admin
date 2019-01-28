import * as ko from 'knockout'
import moment from 'moment'
import htmlEncode from 'htmlencode'

const adminUrls = require('../../admin-urls')
const ajax = require('../../ajax')
const EndpointBuilder = require('../../endpoint-builder')

class SearchResult {
  constructor (sp, index) {
    this.name = htmlEncode.htmlDecode(sp.name)
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
    this.serviceProviderName = htmlEncode.htmlDecode(data.serviceProviderName)
    this.description = data.description
    this.neededDate = moment(data.neededDate).format('DD/MM/YY')
  }

  get viewSPUrl () {
    return `${adminUrls.serviceProviderNeedsEdit}?providerId=${this.serviceProviderId}&needId=${this.id}`
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

class ServiceProvider { 
  constructor (data) {
    this.key = data.key
    this.name = htmlEncode.htmlDecode(data.name)
  }

  get viewSPUrl () {
    return `${adminUrls.serviceProviders}?key=${this.key}`
  }
}

class NewlyRegisteredProviders {
  constructor () {
    this.providers = ko.observableArray([])

    ajax
      .get(`${new EndpointBuilder().serviceProvidersv3().build()}?pageSize=10&isPublished=false&sortBy=creationDate`)
      .then((result) => {
        const providers = result.data.items
          .map((p) => new ServiceProvider(p))

          console.log(result.data.items, providers)
        this.providers(providers)
      })
  }
}

function Dashboard () {
  const self = this
  self.spSearch = new SPSearch({ tabIndex: 100 })
  self.latestNeeds = new LatestNeeds()
  self.newlyRegisteredProviders = new NewlyRegisteredProviders()
}

module.exports = Dashboard
