import * as ko from 'knockout'

const adminUrls = require('../../admin-urls')
const ajax = require('../../ajax')
const EndpointBuilder = require('../../endpoint-builder')

export class Offer {
  constructor (data) {
    this.id = data.id
    this.description = ko.observable(`${data.description}`)
  }

  get viewUrl () {
    return `${adminUrls.contactAboutOffer}?id=${this.id}`
  }
}

export class LatestOffers {
  constructor () {
    this.offers = ko.observableArray([])
    ajax
      .get(`${new EndpointBuilder().offersOfItems().build()}?pageSize=5&sortBy=creationDate`)
      .then((result) => {
        const offers = result.data.items
          .map((p) => new Offer(p))
        this.offers(offers)
      })
  }
}
