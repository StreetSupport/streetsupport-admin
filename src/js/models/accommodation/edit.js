const ajax = require('../../ajax')
const BaseViewModel = require('../../models/BaseViewModel')
const browser = require('../../browser')
const cookies = require('../../cookies')
const InlineEditableSubEntity = require('../../models/InlineEditableSubEntity')
const querystring = require('../../get-url-parameter')

const htmlEncode = require('htmlencode')
const ko = require('knockout')
require('knockout.validation') // No variable here is deliberate!
const marked = require('marked')

import { categories } from '../../../data/generated/service-categories'
import { supportTypes } from '../../../data/generated/support-types'

function Model () {
  const self = this
  const id = querystring.parameter('id')
  const headers = self.headers(cookies.get('session-token'))

  const parseMarkdown = (src) => marked(htmlEncode.htmlDecode(src))

  self.buildGeneralDetails = () => {
    const formFields = ko.validatedObservable({
      name: ko.observable().extend({ required: true }),
      synopsis: ko.observable(),
      description: ko.observable(),
      isOpenAccess: ko.observable(),
      isPubliclyVisible: ko.observable(),
      accommodationType: ko.observable(),
      serviceProviderId: ko.observable(),
      supportOffered: ko.observableArray()
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
        sourceField: 'supportOffered',
        destField: 'supportOfferedReadOnly',
        computation: (src) => src.join(', ')
      }, {
        sourceField: 'description',
        destField: 'descriptionReadOnly',
        computation: parseMarkdown
      }, {
        sourceField: 'synopsis',
        destField: 'synopsisReadOnly',
        computation: parseMarkdown
      }]
    })

    model.supportTypes = ko.observableArray(supportTypes)
    return model
  }

  self.buildContactDetails = function () {
    const formFields = ko.validatedObservable({
      name: ko.observable().extend({ required: true }),
      additionalInfo: ko.observable(),
      email: ko.observable().extend({ email: true }),
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
      publicTransportInfo: ko.observable(),
      nearestSupportProviderId: ko.observable()
    })
    const endpoint = self.endpointBuilder.temporaryAccommodation(id).address().build()
    return new InlineEditableSubEntity({
      formFields: formFields,
      patchEndpoint: endpoint,
      dropdownFields: [{ fieldId: 'nearestSupportProviderId', collection: 'serviceProviders' }]
    })
  }

  self.buildFeatures = function () {
    const formFields = ko.validatedObservable({
      acceptsHousingBenefit: ko.observable(),
      acceptsNoHousingBenefitWithServiceProviderSupport: ko.observable(),
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
      allowsChildren: ko.observable(),
      hasOnSiteManager: ko.observable(),
      referenceReferralIsRequired: ko.observable(),
      price: ko.observable().extend({ required: true }),
      additionalFeatures: ko.observable(),
      foodIsIncluded: ko.observable(),
      availabilityOfMeals: ko.observable(),
      featuresAvailableAtAdditionalCost: ko.observable()
    })
    const endpoint = self.endpointBuilder.temporaryAccommodation(id).features().build()
    return new InlineEditableSubEntity({
      formFields: formFields,
      patchEndpoint: endpoint,
      boolDiscFields: ['acceptsHousingBenefit', 'acceptsPets', 'acceptsCouples', 'hasDisabledAccess', 'isSuitableForWomen', 'isSuitableForYoungPeople', 'hasSingleRooms', 'hasSharedRooms', 'hasShowerBathroomFacilities', 'hasAccessToKitchen', 'hasFlexibleMealTimes', 'hasLounge', 'providesCleanBedding', 'allowsVisitors', 'allowsChildren', 'hasOnSiteManager', 'referenceReferralIsRequired', 'foodIsIncluded'],
      computedFields: [{
        sourceField: 'additionalFeatures',
        destField: 'additionalFeaturesReadOnly',
        computation: parseMarkdown
      }, {
        sourceField: 'featuresAvailableAtAdditionalCost',
        destField: 'featuresAvailableAtAdditionalCostReadOnly',
        computation: parseMarkdown
      }]
    })
  }

  self.generalDetails = ko.observable(self.buildGeneralDetails())
  self.contactDetails = ko.observable(self.buildContactDetails())
  self.address = ko.observable(self.buildAddress())
  self.features = ko.observable(self.buildFeatures())

  self.init = () => {
    browser.loading()
    ajax
      .get(self.endpointBuilder.temporaryAccommodation(id).build(), headers)
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
            { fieldId: 'additionalFeatures', cleanFunction: htmlEncode.htmlDecode },
            { fieldId: 'featuresAvailableAtAdditionalCost', cleanFunction: htmlEncode.htmlDecode }
          ]
        })

        self.generalDetails().accommodationTypes = ko.observableArray(categories
          .find((c) => c.key === 'accom')
          .subCategories)

        browser.loaded()
      })
    ajax
      .get(self.endpointBuilder.serviceProvidersHAL().build(), headers)
      .then((result) => {
          const serviceProviders = result.data.items
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
        self.generalDetails().serviceProviders(serviceProviders)
      }, () => {

      })
  }
}

Model.prototype = new BaseViewModel()

module.exports = Model
