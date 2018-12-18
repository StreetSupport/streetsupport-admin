const ajax = require('../../ajax')
const auth = require('../../auth')
const BaseViewModel = require('../../models/BaseViewModel')
const browser = require('../../browser')
const InlineEditableSubEntity = require('../../models/InlineEditableSubEntity')
const querystring = require('../../get-url-parameter')

const htmlEncode = require('htmlencode')
const ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!
const marked = require('marked')

import { categories } from '../../../data/generated/accommodation-categories'
import { supportTypes } from '../../../data/generated/support-types'

function Model () {
  const self = this
  const id = querystring.parameter('id')

  const parseMarkdown = (src) => marked(htmlEncode.htmlDecode(src))

  self.buildGeneralDetails = () => {
    const formFields = ko.validatedObservable({
      name: ko.observable().extend({ required: true }),
      synopsis: ko.observable(),
      description: ko.observable(),
      isOpenAccess: ko.observable(),
      isPubliclyVisible: ko.observable(),
      accommodationType: ko.observable(),
      serviceProviderId: ko.observable()
    })
    const endpoint = self.endpointBuilder.temporaryAccommodation(id).generalDetails().build()
    const model = new InlineEditableSubEntity({
      formFields: formFields,
      patchEndpoint: endpoint,
      dropdownFields: [
        { fieldId: 'accommodationType', collection: 'accommodationTypes' },
        { fieldId: 'serviceProviderId', collection: 'serviceProviders' }
      ],
      computedFields: [{
        sourceField: 'description',
        destField: 'descriptionReadOnly',
        computation: parseMarkdown
      }, {
        sourceField: 'synopsis',
        destField: 'synopsisReadOnly',
        computation: parseMarkdown
      }]
    })
    return model
  }

  self.buildContactDetails = function () {
    const formFields = ko.validatedObservable({
      name: ko.observable().extend({ required: true }),
      additionalInfo: ko.observable(),
      email: ko.observable().extend({ email: true, required: false }),
      telephone: ko.observable()
    })
    const endpoint = self.endpointBuilder.temporaryAccommodation(id).contactInformation().build()
    return new InlineEditableSubEntity({
      formFields: formFields,
      patchEndpoint: endpoint
    })
  }

  self.buildAddress = function () {
    const formFields = ko.validatedObservable({
      street1: ko.observable().extend({ required: true }),
      street2: ko.observable(),
      street3: ko.observable(),
      city: ko.observable().extend({ required: true }),
      postcode: ko.observable().extend({ required: true }),
      associatedCityId: ko.observable().extend(),
      publicTransportInfo: ko.observable(),
      nearestSupportProviderId: ko.observable(),
      addressIsPubliclyHidden: ko.observable()
    })
    const endpoint = self.endpointBuilder.temporaryAccommodation(id).address().build()
    return new InlineEditableSubEntity({
      formFields: formFields,
      patchEndpoint: endpoint,
      dropdownFields: [
        { fieldId: 'associatedCityId', collection: 'locations' },
        { fieldId: 'nearestSupportProviderId', collection: 'serviceProviders' }
      ]
    })
  }

  self.buildFeatures = function () {
    const formFields = ko.validatedObservable({
      acceptsPets: ko.observable(),
      acceptsCouples: ko.observable(),
      hasDisabledAccess: ko.observable(),
      hasSingleRooms: ko.observable(),
      hasSharedRooms: ko.observable(),
      hasShowerBathroomFacilities: ko.observable(),
      hasAccessToKitchen: ko.observable(),
      hasFlexibleMealTimes: ko.observable(),
      hasLounge: ko.observable(),
      hasLaundryFacilities: ko.observable(),
      providesCleanBedding: ko.observable(),
      allowsVisitors: ko.observable(),
      additionalFeatures: ko.observable(),
      availabilityOfMeals: ko.observable()
    })
    const endpoint = self.endpointBuilder.temporaryAccommodation(id).features().build()
    return new InlineEditableSubEntity({
      formFields: formFields,
      patchEndpoint: endpoint,
      boolDiscFields: ['acceptsPets', 'acceptsCouples', 'hasDisabledAccess', 'hasSingleRooms', 'hasSharedRooms',
        'hasShowerBathroomFacilities', 'hasAccessToKitchen', 'hasFlexibleMealTimes', 'hasLounge', 'hasLaundryFacilities',
        'providesCleanBedding', 'allowsVisitors' ],
      computedFields: [{
        sourceField: 'additionalFeatures',
        destField: 'additionalFeaturesReadOnly',
        computation: parseMarkdown
      }]
    })
  }

  self.buildPricingAndRequirements = function () {
    const formFields = ko.validatedObservable({
      referralIsRequired: ko.observable(),
      referralNotes: ko.observable(),
      price: ko.observable().extend({ number: true }),
      foodIsIncluded: ko.observable(),
      availabilityOfMeals: ko.observable(),
      featuresAvailableAtAdditionalCost: ko.observable()
    })
    const endpoint = self.endpointBuilder.temporaryAccommodation(id).pricingAndRequirements().build()
    return new InlineEditableSubEntity({
      formFields: formFields,
      patchEndpoint: endpoint,
      boolDiscFields: ['foodIsIncluded'],
      computedFields: [{
        sourceField: 'availabilityOfMeals',
        destField: 'availabilityOfMealsReadOnly',
        computation: parseMarkdown
      }, {
        sourceField: 'featuresAvailableAtAdditionalCost',
        destField: 'featuresAvailableAtAdditionalCostReadOnly',
        computation: parseMarkdown
      }, {
        sourceField: 'referralNotes',
        destField: 'referralNotesReadOnly',
        computation: parseMarkdown
      }]
    })
  }

  self.buildSupportProvided = function () {
    const formFields = ko.validatedObservable({
      hasOnSiteManager: ko.observable(),
      supportInfo: ko.observable(),
      supportOffered: ko.observableArray()
    })
    const endpoint = self.endpointBuilder.temporaryAccommodation(id).supportProvided().build()
    const model = new InlineEditableSubEntity({
      formFields: formFields,
      patchEndpoint: endpoint,
      boolDiscFields: ['hasOnSiteManager'],
      computedFields: [{
        sourceField: 'supportInfo',
        destField: 'supportInfoReadOnly',
        computation: parseMarkdown
      }, {
        sourceField: 'supportOffered',
        destField: 'supportOfferedReadOnly',
        computation: (src) => src.join(', ')
      }]
    })

    model.supportTypes = ko.observableArray(supportTypes)

    return model
  }

  self.buildResidentCriteria = function () {
    const formFields = ko.validatedObservable({
      acceptsMen: ko.observable(false),
      acceptsWomen: ko.observable(false),
      acceptsCouples: ko.observable(false),
      acceptsSingleSexCouples: ko.observable(false),
      acceptsYoungPeople: ko.observable(false),
      acceptsFamilies: ko.observable(false),
      acceptsBenefitsClaimants: ko.observable(false)
    })
    const endpoint = self.endpointBuilder.temporaryAccommodation(id).residentCriteria().build()
    const model = new InlineEditableSubEntity({
      formFields: formFields,
      patchEndpoint: endpoint
    })

    model.supportTypes = ko.observableArray(supportTypes)

    return model
  }

  self.generalDetails = ko.observable(self.buildGeneralDetails())
  self.contactDetails = ko.observable(self.buildContactDetails())
  self.address = ko.observable(self.buildAddress())
  self.features = ko.observable(self.buildFeatures())
  self.pricingAndRequirements = ko.observable(self.buildPricingAndRequirements())
  self.supportProvided = ko.observable(self.buildSupportProvided())
  self.residentCriteria = ko.observable(self.buildResidentCriteria())

  self.updateServiceProviders = function (locationId) {
    const publisherEndpoint = auth.isSuperAdmin()
      ? `${self.endpointBuilder.serviceProvidersv3().build()}?location=${locationId}`
      : `${self.endpointBuilder.publishedOrgs().build()}/${locationId}`

    const mapDataToKeyValues = auth.isSuperAdmin()
      ? (result) => result.data.items
      : (result) => result.data

    ajax
      .get(publisherEndpoint)
      .then((result) => {
        const serviceProviders = mapDataToKeyValues(result)
          .map((p) => {
            return {
              id: p.key,
              name: htmlEncode.htmlDecode(p.name)
            }
          })
          .sort((a, b) => {
            if (a.name > b.name) return 1
            if (a.name < b.name) return -1
            return 0
          })
        self.address().serviceProviders(serviceProviders)
        self.address().locations(auth.getLocationsForUser())
        self.generalDetails().serviceProviders(serviceProviders)
      }, () => {

      })
  }

  self.init = () => {
    browser.loading()
    ajax
      .get(self.endpointBuilder.temporaryAccommodation(id).build())
      .then((result) => {
        self.generalDetails().populateFormFields({
          data: result.data.generalInfo,
          preParseFields: [
            { fieldId: 'name', cleanFunction: htmlEncode.htmlDecode },
            { fieldId: 'description', cleanFunction: htmlEncode.htmlDecode }
          ]
        })
        self.contactDetails().populateFormFields({ data: result.data.contactInformation })
        self.address().populateFormFields({ data: result.data.address })
        self.features().populateFormFields({
          data: result.data.features,
          preParseFields: [
            { fieldId: 'additionalFeatures', cleanFunction: htmlEncode.htmlDecode }
          ]
        })
        self.pricingAndRequirements().populateFormFields({
          data: result.data.pricingAndRequirements,
          preParseFields: [
            { fieldId: 'availabilityOfMeals', cleanFunction: htmlEncode.htmlDecode },
            { fieldId: 'referralNotesReadOnly', cleanFunction: htmlEncode.htmlDecode },
            { fieldId: 'featuresAvailableAtAdditionalCost', cleanFunction: htmlEncode.htmlDecode }
          ]
        })
        self.supportProvided().populateFormFields({
          data: result.data.supportProvided,
          preParseFields: [
          ]
        })
        self.residentCriteria().populateFormFields({
          data: result.data.residentCriteria,
          preParseFields: [
          ]
        })

        self.generalDetails().accommodationTypes = ko.observableArray(categories)

        self.updateServiceProviders(self.address().formFields().associatedCityId())
        self.address().formFields().associatedCityId.subscribe((newLocationId) => {
          self.updateServiceProviders(newLocationId)
        })

        browser.loaded()
      })
  }
}

Model.prototype = new BaseViewModel()

module.exports = Model
