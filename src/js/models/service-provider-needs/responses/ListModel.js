const ajax = require('../../../ajax')
const cookies = require('../../../cookies')
const querystring = require('../../../get-url-parameter')
import BaseViewModel from '../../BaseViewModel'
const ko = require('knockout')
const moment = require('moment')

const ListModel = function () {
  const self = this
  self.need = ko.observable()
  self.offers = ko.observableArray()
  self.hasOffers = ko.computed(() => {
    return self.offers().length > 0
  }, self)

  self.init = () => {
    self.needId = querystring.parameter('needId')
    const endpoint = self.endpointBuilder.needOffers(self.needId).build()
    ajax
      .get(`${endpoint}/offers-to-help`, self.headers(cookies.get('session-token')))
      .then((result) => {
        self.need(result.data.need)
        const offers = result.data.helpOffers
        offers
          .forEach((o) => {
            o.emailLink = `mailto:${o.email}?subject=Thanks for your offer to help with '${result.data.need.description}' via Street Support!`
            o.createdOn = moment(o.documentCreationDate).format('DD/MM/YY')
          })
        self.offers(result.data.helpOffers)
      }, (error) => {
        self.handleServerError(error)
      })
  }

  self.init()
}

ListModel.prototype = new BaseViewModel()

module.exports = ListModel
