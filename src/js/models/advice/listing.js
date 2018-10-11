const ko = require('knockout')
const htmlencode = require('htmlencode')

const adminUrls = require('../../admin-urls')
const auth = require('../../auth')
const ListingBaseViewModel = require('../ListingBaseViewModel')

import { cities as locations } from '../../../data/generated/supported-cities'

const Model = function () {
  const self = this

  const locationsForUser = auth.isCityAdmin()
    ? locations.filter((l) => auth.locationsAdminFor().includes(l.id))
    : locations

  self.mapItems = (i) => {
    return {
      title: ko.observable(htmlencode.htmlDecode(i.title)),
      locationKey: ko.observable(i.locationKey),
      tags: ko.observable(i.tags)
    }
  }

  self.filters = []
  self.baseUrl = self.endpointBuilder.faqs().build()

  self.init(self)
}

Model.prototype = new ListingBaseViewModel()

module.exports = Model
