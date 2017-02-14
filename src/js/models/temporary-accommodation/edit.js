const ajax = require('../../ajax')
const BaseViewModel = require('../../models/BaseViewModel')
const browser = require('../../browser')
const cookies = require('../../cookies')
const InlineEditableSubEntity = require('../../models/InlineEditableSubEntity')
const querystring = require('../../get-url-parameter')

const ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!

function Model () {
  const self = this
  const id = querystring.parameter('id')
  const headers = self.headers(cookies.get('session-token'))

  self.buildContactDetails = function () {
    const formFields = ko.validatedObservable({
      name: ko.observable().extend({ required: true }),
      additionalInfo: ko.observable().extend({ required: true }),
      email: ko.observable().extend({ email: true }),
      telephone: ko.observable()
    })
    const endpoint = self.endpointBuilder.temporaryAccommodation(id).contactInformation().build()
    return new InlineEditableSubEntity(formFields, endpoint)
  }

  self.buildAddress = function () {
    const formFields = ko.validatedObservable({
      street1: ko.observable().extend({ required: true }),
      street2: ko.observable(),
      street3: ko.observable(),
      city: ko.observable().extend({ required: true }),
      postcode: ko.observable().extend({ required: true }),
      publicTransportInfo: ko.observable(),
      nearestSupportProviderId: ko.observable()
    })
    const endpoint = self.endpointBuilder.temporaryAccommodation(id).address().build()
    return new InlineEditableSubEntity(formFields, endpoint)
  }

  self.buildFeatures = function () {
    const formFields = ko.validatedObservable({
      acceptsHousingBenefit: ko.observable(),
      acceptsPets: ko.observable(),
      acceptsCouples: ko.observable(),
      hasDisabledAccess: ko.observable(),
      isSuitableForWomen: ko.observable(),
      isSuitableForYoungPeople: ko.observable(),
      hasSingleRooms: ko.observable(),
      hasSharedRooms: ko.observable(),
      hasShowerBathroomFacilities: ko.observable(),
      hasAccessToKitchen: ko.observable(),
      hasFlexibleMealTimes: ko.observable(),
      hasLounge: ko.observable(),
      providesCleanBedding: ko.observable(),
      allowsVisitors: ko.observable(),
      hasOnSiteManager: ko.observable(),
      referenceReferralIsRequired: ko.observable(),
      price: ko.observable().extend({ required: true }),
      additionalFeatures: ko.observable(),
      foodIsIncluded: ko.observable(),
      availabilityOfMeals: ko.observable(),
      featuresAvailableAtAdditionalCost: ko.observable()
    })
    const endpoint = self.endpointBuilder.temporaryAccommodation(id).features().build()
    return new InlineEditableSubEntity(formFields, endpoint, ['acceptsPets', 'acceptsCouples'])
  }

  self.contactDetails = ko.observable(self.buildContactDetails())
  self.address = ko.observable(self.buildAddress())
  self.features = ko.observable(self.buildFeatures())

  self.init = () => {
    browser.loading()
    ajax
      .get(self.endpointBuilder.temporaryAccommodation(id).build(), headers)
      .then((result) => {
        self.contactDetails().populateFormFields(result.data.contactInformation)
        self.address().populateFormFields(result.data.address)
        self.features().populateFormFields(result.data.features)
        browser.loaded()
      })
  }
}

Model.prototype = new BaseViewModel()

module.exports = Model
