/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const ajax = require(`../../../../src/js/ajax`)
const endpoints = require(`../../../../src/js/api-endpoints`)
const browser = require(`../../../../src/js/browser`)
const cookies = require(`../../../../src/js/cookies`)
const querystring = require(`../../../../src/js/get-url-parameter`)
const Model = require(`../../../../src/js/models/temporary-accommodation/reviews/app`)

describe('Temporary Accommodation Listing', () => {
  let sut = null
  let browserLoadingStub = null
  let browserLoadedStub = null
  let ajaxPostStub = null

  const headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }

  beforeEach(() => {
    sinon.stub(querystring, 'parameter').withArgs('id').returns(accomData.id)

    sinon
      .stub(ajax, 'get')
      .withArgs(`${endpoints.prefix(accomData.links.self)}?expand=reviews`, headers)
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': accomData
          })
        }
      })

    ajaxPostStub = sinon
      .stub(ajax, 'post')
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 201,
            'data': {
              id: 'new-review-id'
            }
          })
        }
      })

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    sinon.stub(cookies, 'get').returns('stored-session-token')

    sut = new Model()
    sut.init()

    browser.loading.reset()
    browser.loaded.reset()

    sut.newItem().formFields().hasCentralHeating(2)
    sut.newItem().formFields().hasHotWater(2)
    sut.newItem().formFields().hasElectricity(2)
    sut.newItem().formFields().hasLockOnRoom(true)
    sut.newItem().formFields().hasLockOnFrontDoor(true)
    sut.newItem().formFields().hasAggressiveTenants(true)
    sut.newItem().formFields().hasExcessiveNoise(true)
    sut.newItem().formFields().foodRating(1)
    sut.newItem().formFields().cleanlinessRating(2)
    sut.newItem().formFields().staffHelpfulnessRating(3)
    sut.newItem().formFields().staffSupportivenessRating(4)
    sut.newItem().formFields().staffDealingWithProblemsRating(5)
    sut.newItem().formFields().staffTimelinessWithIssuesRating(1)

    sut.newItem().save()
  })

  afterEach(() => {
    ajax.get.restore()
    ajax.post.restore()
    browser.loading.restore()
    browser.loaded.restore()
    cookies.get.restore()
    querystring.parameter.restore()
  })

  it('- should show user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('- should post new review data', () => {
    const endpoint = `${endpoints.temporaryAccommodation}/${accomData.id}/reviews`
    const payload = {
      HasCentralHeating: 2,
      HasHotWater: 2,
      HasElectricity: 2,
      FoodRating: 1,
      HasLockOnRoom: true,
      HasLockOnFrontDoor: true,
      HasAggressiveTenants: true,
      HasExcessiveNoise: true,
      CleanlinessRating: 2,
      StaffHelpfulnessRating: 3,
      StaffSupportivenessRating: 4,
      StaffDealingWithProblemsRating: 5,
      StaffTimelinessWithIssuesRating: 1
    }
    const postCalledAsExpected = ajaxPostStub
      .withArgs(endpoint, headers, payload)
      .calledAfter(browserLoadingStub)
    expect(postCalledAsExpected).toBeTruthy()
  })

  it('- should show user it has loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxPostStub)).toBeTruthy()
  })

  it('- should reset new item form', () => {
    Object.keys(sut.newItem().formFields())
      .filter((k) => !k.endsWith('ReadOnly'))
      .forEach((k) => {
        expect(sut.newItem().formFields()[k]()).toEqual(null)
      })
  })

  it('- should add new item to top of collection', () => {
    expect(sut.items()[0].formFields().idReadOnly()).toEqual('new-review-id')
  })

  it('- should retain temporary accommodation id', () => {
    expect(sut.items()[0].formFields().temporaryAccommodationIdReadOnly()).toEqual(accomData.id)
  })
})

const accomData = {
  'links': {
    'self': '/v1/temporary-accommodation/58a2df876a38c33d389e00e8'
  },
  'embedded': {
    'reviews': []
  },
  'id': '58a2df876a38c33d389e00e8',
  'contactInformation': {
    'name': 'Vince Test',
    'additionalInfo': 'Vince test description',
    'email': 'test@test.com',
    'telephone': '0123456789'
  },
  'address': {
    'street1': 'test 1',
    'street2': null,
    'street3': null,
    'city': 'manchester',
    'postcode': 'M3 4BD',
    'latitude': 53.4755361548836,
    'longitude': -2.25848699844466,
    'publicTransportInfo': 'get a bus',
    'nearestSupportProviderId': 'self-help'
  },
  'features': {
    'acceptsHousingBenefit': false,
    'acceptsPets': 1,
    'acceptsCouples': 2,
    'hasDisabledAccess': true,
    'isSuitableForWomen': true,
    'isSuitableForYoungPeople': true,
    'hasSingleRooms': false,
    'hasSharedRooms': false,
    'hasShowerBathroomFacilities': false,
    'hasAccessToKitchen': false,
    'hasFlexibleMealTimes': true,
    'hasLounge': false,
    'providesCleanBedding': false,
    'allowsVisitors': false,
    'hasOnSiteManager': false,
    'referenceReferralIsRequired': false,
    'price': 0,
    'additionalFeatures': 'seswe3ww',
    'foodIsIncluded': false,
    'availabilityOfMeals': null,
    'featuresAvailableAtAdditionalCost': null
  }
}