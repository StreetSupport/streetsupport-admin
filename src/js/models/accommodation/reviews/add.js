let ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

let ajax = require('../../../ajax')
let browser = require('../../../browser')
let cookies = require('../../../cookies')
let querystring = require('../../../get-url-parameter')
let BaseViewModel = require('../../BaseViewModel')
let Item = require('./Item')

function Add () {
  let self = this

  const createDefaultNewItem = () => {
    const zeroFields = ['hasCentralHeating', 'hasHotWater', 'hasElectricity', 'hasToilet', 'hasShowerBath',
      'feelingOfSecurityRating', 'noisyRating', 'foodRating', 'cleanlinessRating', 'roomConditionRating',
      'staffFriendlinessRating', 'staffSupportivenessRating', 'staffDealingWithProblemsRating', 'staffTimelinessWithIssuesRating',
      'overallRating']
    const falseFields = ['hasLockOnRoom', 'hasLockOnFrontDoor', 'hasAggressiveTenants', 'hasExcessiveNoise']

    const defaultNewItem = {
      id: null,
      temporaryAccommodationId: querystring.parameter('id'),
      documentCreationDate: new Date().toISOString(),
    }

    zeroFields.forEach((f) => { defaultNewItem[f] = '0' })
    falseFields.forEach((f) => { defaultNewItem[f] = false })

    return defaultNewItem
  }

  self.buildFormFields = (data = createDefaultNewItem()) => {
    const formattedCreationDate = data.documentCreationDate !== undefined
      ? data.documentCreationDate.split('T')[0]
      : ''

    const model = ko.validatedObservable({
      idReadOnly: ko.observable(data.id),
      temporaryAccommodationIdReadOnly: ko.observable(data.temporaryAccommodationId),
      documentCreationDateReadOnly: ko.observable(formattedCreationDate),
      hasCentralHeating: ko.observable(data.hasCentralHeating),
      hasHotWater: ko.observable(data.hasHotWater),
      hasElectricity: ko.observable(data.hasElectricity),
      hasToilet: ko.observable(data.hasToilet),
      hasShowerBath: ko.observable(data.hasShowerBath),
      hasLockOnRoom: ko.observable(data.hasLockOnRoom),
      feelingOfSecurityRating: ko.observable(data.feelingOfSecurityRating),
      hasLockOnFrontDoor: ko.observable(data.hasLockOnFrontDoor),
      noisyRating: ko.observable(data.noisyRating),
      foodRating: ko.observable(data.foodRating),
      cleanlinessRating: ko.observable(data.cleanlinessRating),
      roomConditionRating: ko.observable(data.roomConditionRating),
      staffFriendlinessRating: ko.observable(data.staffFriendlinessRating),
      staffSupportivenessRating: ko.observable(data.staffSupportivenessRating),
      staffDealingWithProblemsRating: ko.observable(data.staffDealingWithProblemsRating),
      staffTimelinessWithIssuesRating: ko.observable(data.staffTimelinessWithIssuesRating),
      overallRating: ko.observable(data.overallRating)
    })
    return model
  }
  self.buildEndpoints = () => {
    return {
      save: (item) => `${item.endpointBuilder.temporaryAccommodation(item.formFields().temporaryAccommodationIdReadOnly()).build()}/reviews`,
      delete: (item) => `${item.endpointBuilder.temporaryAccommodation(item.formFields().temporaryAccommodationIdReadOnly()).build()}/reviews/${item.formFields().idReadOnly()}`
    }
  }

  const defaultNewPersonalFeedback = {
    canBeDisplayedPublically: false,
    reviewerName: '',
    reviewerContactDetails: '',
    body: ''
  }

  self.buildPersonalFeedbackFormFields = (data = defaultNewPersonalFeedback) => {
    const model = ko.validatedObservable({
      idReadOnly: ko.observable(data.id),
      temporaryAccommodationIdReadOnly: ko.observable(data.temporaryAccommodationId),
      canBeDisplayedPublically: ko.observable(data.canBeDisplayedPublically),
      reviewerName: ko.observable(data.reviewerName),
      reviewerContactDetails: ko.observable(data.reviewerContactDetails),
      body: ko.observable(data.body)
    })
    return model
  }
  self.buildPersonalFeedbackEndpoints = () => {
    return {
      update: (item) => `${item.endpointBuilder.temporaryAccommodation(item.formFields().temporaryAccommodationIdReadOnly()).build()}/reviews/${item.formFields().idReadOnly()}`
    }
  }

  self.newItem = ko.observable(new Item(self, self.buildFormFields(), self.buildEndpoints()))
  self.personalFeedback = ko.observable(new Item(self, self.buildPersonalFeedbackFormFields(), self.buildPersonalFeedbackEndpoints()))
  self.address = ko.observable()
  self.reviewIsCreated = ko.observable(false)
  self.personalFeedbackIsSent = ko.observable(false)

  self.itemCreated = (item) => {
    self.reviewIsCreated(true)
    self.personalFeedback().formFields().idReadOnly(item.formFields().idReadOnly())
    self.personalFeedback().formFields().temporaryAccommodationIdReadOnly(item.formFields().temporaryAccommodationIdReadOnly())
  }

  self.itemUpdated = () => {
    self.personalFeedbackIsSent(true)
    self.message('Thank you for your feedback!')
  }

  const retrieveItems = () => {
    browser.loading()
    const id = querystring.parameter('id')
    const endpoint = `${self.endpointBuilder.temporaryAccommodation(id).build()}?expand=reviews`
    const headers = self.headers(cookies.get('session-token'))
    ajax
      .get(endpoint, headers)
      .then((result) => {
        browser.loaded()

        self.newItem().formFields().temporaryAccommodationIdReadOnly(result.data.id)
        const address = [result.data.address.street1, result.data.address.street2, result.data.address.street3, result.data.address.city, result.data.address.postcode]
          .filter((l) => l != null)
          .join(', ')
        self.address(address)
      }, () => {
        self.handleServerError()
      })
  }

  self.init = () => {
    retrieveItems()
  }

  self.init()
}

Add.prototype = new BaseViewModel()

module.exports = Add
