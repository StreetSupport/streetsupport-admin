import ajax from '../../ajax'
import browser from '../../browser'
import endpoints from '../../api-endpoints'
import querystring from '../../get-url-parameter'
import ko from 'knockout'

const Model = function () {
  const self = this
  self.categories = ko.observableArray()

  const dataReceived = () => {
    if (self.allCategories === undefined ||
        self.providerCategories === undefined) return

    self.categories((self.allCategories().map((c) => {
      return {
        key: c.key,
        value: c.value,
        isChecked: self.providerCategories.indexOf(c.key) >= 0
      }
    })))

    browser.loaded()
  }

  const getCategories = () => {
    ajax
      .get(endpoints.needCategories)
      .then((result) => {
        self.allCategories = ko.observableArray(result.data)
        dataReceived()
      }, (_) => {
        browser.redirect('/500')
      })
  }

  const getProvider = () => {
    const providerId = querystring.parameter('providerId')
    const providerEndpoint = endpoints.getServiceProviders + '/' + providerId
    ajax
      .get(providerEndpoint)
      .then((result) => {
        self.providerCategories = ko.observableArray(result.data.needCategories)
        dataReceived()
      }, (_) => {
        browser.redirect('/500')
      })
  }

  self.init = () => {
    browser.loading()
    getCategories()
    getProvider()
  }

  self.init()
}

module.exports = Model
