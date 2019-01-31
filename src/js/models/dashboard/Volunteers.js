import * as ko from 'knockout'

const adminUrls = require('../../admin-urls')
const ajax = require('../../ajax')
const EndpointBuilder = require('../../endpoint-builder')

export class Volunteer {
  constructor (data) {
    this.id = data.id
    this.skills = ko.observable(data.skillsAndExperience.description)
    this.resources = ko.observable(data.resources.description)
  }

  get viewUrl () {
    return `${adminUrls.contactVolunteer}?id=${this.id}`
  }
}

export class LatestVolunteers {
  constructor () {
    this.volunteers = ko.observableArray([])
    ajax
      .get(`${new EndpointBuilder().volunteers().build()}?pageSize=5&sortBy=creationDate`)
      .then((result) => {
        const volunteers = result.data.items
          .map((p) => new Volunteer(p))
        this.volunteers(volunteers)
      })
  }
}
