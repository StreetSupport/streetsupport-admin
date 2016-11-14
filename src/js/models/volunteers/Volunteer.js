'use strict'

const adminUrls = require('../../admin-urls')
const moment = require('moment')
const ko = require('knockout')

const Volunteer = function (data) {
  let self = this
  self.id = data.id
  self.person = {
    firstName: data.person.firstName,
    lastName: data.person.lastName,
    email: data.person.email,
    telephone: data.person.telephone,
    postcode: data.person.postcode,
    city: data.person.city
  }
  self.skillsAndExperience = {
    description: data.skillsAndExperience.description
  }
  self.availability = {
    description: data.availability.description
  }
  self.resources = {
    description: data.resources.description
  }

  self.contactUrl = adminUrls.contactVolunteer + '?id=' + data.id
  self.creationDate = moment(data.creationDate).format('DD/MM/YY')
  self.isHighlighted = ko.observable(false)
  self.highlighted = ko.computed(() => {
    return self.isHighlighted()
      ? 'volunteer volunteer--highlighted'
      : 'volunteer'
  }, self)
}

module.exports = Volunteer
