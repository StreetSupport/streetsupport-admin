/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const jsRoot = '../../../../src/js/'
const ajax = require(`${jsRoot}ajax`)
const endpoints = require(`${jsRoot}api-endpoints`)
const browser = require(`${jsRoot}browser`)
const cookies = require(`${jsRoot}cookies`)
const querystring = require(`${jsRoot}get-url-parameter`)

const { testData, serviceProviderData } = require('../testData')

describe('Accommodation - Edit Features', () => {
  const Model = require(`${jsRoot}models/accommodation/edit`)
  const headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }
  let sut = null

  let ajaxGetStub = null
  let browserLoadingStub = null
  let browserLoadedStub = null

  beforeEach(() => {
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    ajaxGetStub = sinon.stub(ajax, 'get')
    ajaxGetStub
      .withArgs(`${endpoints.temporaryAccommodation}/${testData.id}`, headers)
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': testData
          })
        }
      })
    ajaxGetStub
      .withArgs(`${endpoints.getPublishedServiceProviders}`, headers)
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': serviceProviderData
          })
        }
      })
    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    sinon.stub(querystring, 'parameter')
      .withArgs('id')
      .returns(testData.id)

    sut = new Model()
    sut.init()
  })

  afterEach(() => {
    browser.loading.restore()
    browser.loaded.restore()
    ajax.get.restore()
    cookies.get.restore()
    querystring.parameter.restore()
  })

  it('- should notify user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('- should load features', () => {
    const boolDiscFields = ['acceptsHousingBenefit', 'acceptsPets', 'acceptsCouples', 'hasDisabledAccess', 'isSuitableForWomen', 'isSuitableForYoungPeople', 'hasSingleRooms', 'hasSharedRooms', 'hasShowerBathroomFacilities', 'hasAccessToKitchen', 'hasFlexibleMealTimes', 'hasLounge', 'providesCleanBedding', 'allowsVisitors', 'hasOnSiteManager', 'referenceReferralIsRequired', 'foodIsIncluded']
    Object.keys(testData.features)
      .forEach((k) => {
        if (boolDiscFields.includes(k)) {
          expect(sut.features().formFields()[k]()).toEqual(`${testData.features[k]}`)
        } else {
          expect(sut.features().formFields()[k]()).toEqual(testData.features[k])
        }
      })
  })

  it('- should set boolean/discretionary read only value', () => {
    expect(sut.features().formFields().acceptsPetsReadOnly()).toEqual('Ask Landlord')
    expect(sut.features().formFields().acceptsCouplesReadOnly()).toEqual('Ask Landlord')
  })

  it('- should set additional features read only value', () => {
    expect(sut.features().formFields().additionalFeaturesReadOnly()).toEqual('<p>additional features</p>\n')
  })

  it('- should set featuresAvailableAtAdditionalCost read only value', () => {
    expect(sut.features().formFields().featuresAvailableAtAdditionalCostReadOnly()).toEqual('<p>features available at additional cost</p>\n')
  })

  describe('- edit features', () => {
    beforeEach(() => {
      sut.contactDetails().edit()

      Object.keys(testData.features)
        .forEach((k) => {
          if (testData.features[k] === true) {
            sut.features().formFields()[k](false)
          } else if (testData.features[k] === 2) {
            sut.features().formFields()[k](1)
          } else if (k === 'price') {
            sut.features().formFields()[k](678.90)
          } else {
            sut.features().formFields()[k](`new ${testData.features[k]}`)
          }
        })
    })

    it('- should set isEditable to true', () => {
      expect(sut.contactDetails().isEditable()).toBeTruthy()
    })

    describe('- submit', () => {
      let ajaxPatchStub = null

      beforeEach(() => {
        browserLoadingStub.reset()
        browserLoadedStub.reset()

        ajaxPatchStub = sinon.stub(ajax, 'patch')
          .returns({
            then: function (success, error) {
              success({
                'statusCode': 200
              })
            }
          })

        sut.features().save()
      })

      afterEach(() => {
        ajax.patch.restore()
      })

      it('- should notify user it is loading', () => {
        expect(browserLoadingStub.calledOnce).toBeTruthy()
      })

      it('- should patch new data', () => {
        const endpoint = `${endpoints.temporaryAccommodation}/${testData.id}/features`
        const headers = {
          'content-type': 'application/json',
          'session-token': 'stored-session-token'
        }
        const payload = {
          'AcceptsHousingBenefit': 1,
          'AcceptsNoHousingBenefitWithServiceProviderSupport': 1,
          'AcceptsPets': 1,
          'AcceptsCouples': 1,
          'HasDisabledAccess': 1,
          'IsSuitableForWomen': 1,
          'IsSuitableForYoungPeople': 1,
          'HasSingleRooms': 1,
          'HasSharedRooms': 1,
          'HasShowerBathroomFacilities': 1,
          'HasAccessToKitchen': 1,
          'HasFlexibleMealTimes': 1,
          'HasLounge': 1,
          'ProvidesCleanBedding': 1,
          'AllowsVisitors': 1,
          'HasOnSiteManager': 1,
          'ReferenceReferralIsRequired': 1,
          'Price': 678.9,
          'AdditionalFeatures': 'new additional features',
          'FoodIsIncluded': 1,
          'AvailabilityOfMeals': 'new availability of meals',
          'FeaturesAvailableAtAdditionalCost': 'new features available at additional cost'
        }
        const patchAsExpected = ajaxPatchStub
          .withArgs(endpoint, headers, payload)
          .calledAfter(browserLoadingStub)
        expect(patchAsExpected).toBeTruthy()
      })

      it('- should notify user it has loaded', () => {
        expect(browserLoadedStub.calledAfter(ajaxPatchStub)).toBeTruthy()
      })

      it('- should set contact details to read only', () => {
        expect(sut.features().isEditable()).toBeFalsy()
      })

      describe('- edit again, then cancel', () => {
        beforeEach(() => {
          Object.keys(testData.features)
            .forEach((k) => {
              if (testData.features[k] === false) {
                sut.features().formFields()[k](true)
              } else if (testData.features[k] === 1) {
                sut.features().formFields()[k](0)
              } else if (k === 'price') {
                sut.features().formFields()[k](8765.23)
              } else {
                sut.features().formFields()[k](`another ${testData.features[k]}`)
              }
            })

          sut.features().cancel()
        })

        it('- should set isEditable to false', () => {
          expect(sut.features().isEditable()).toBeFalsy()
        })

        it('- should reset fields', () => {
          expect(sut.features().formFields().acceptsHousingBenefit()).toEqual(1)
          expect(sut.features().formFields().acceptsNoHousingBenefitWithServiceProviderSupport()).toEqual(1)
          expect(sut.features().formFields().acceptsPets()).toEqual(1)
          expect(sut.features().formFields().acceptsPetsReadOnly()).toEqual('Yes')
          expect(sut.features().formFields().acceptsCouples()).toEqual(1)
          expect(sut.features().formFields().hasDisabledAccess()).toEqual(1)
          expect(sut.features().formFields().isSuitableForWomen()).toEqual(1)
          expect(sut.features().formFields().isSuitableForYoungPeople()).toEqual(1)
          expect(sut.features().formFields().hasSingleRooms()).toEqual(1)
          expect(sut.features().formFields().hasSharedRooms()).toEqual(1)
          expect(sut.features().formFields().hasShowerBathroomFacilities()).toEqual(1)
          expect(sut.features().formFields().hasAccessToKitchen()).toEqual(1)
          expect(sut.features().formFields().hasFlexibleMealTimes()).toEqual(1)
          expect(sut.features().formFields().hasLounge()).toEqual(1)
          expect(sut.features().formFields().providesCleanBedding()).toEqual(1)
          expect(sut.features().formFields().allowsVisitors()).toEqual(1)
          expect(sut.features().formFields().hasOnSiteManager()).toEqual(1)
          expect(sut.features().formFields().referenceReferralIsRequired()).toEqual(1)
          expect(sut.features().formFields().price()).toEqual(678.9)
          expect(sut.features().formFields().additionalFeatures()).toEqual('new additional features')
          expect(sut.features().formFields().foodIsIncluded()).toEqual(1)
          expect(sut.features().formFields().availabilityOfMeals()).toEqual('new availability of meals')
          expect(sut.features().formFields().featuresAvailableAtAdditionalCost()).toEqual('new features available at additional cost')
        })
      })
    })

    describe('- cancel', () => {
      beforeEach(() => {
        sut.features().cancel()
      })

      it('- should set isEditable to false', () => {
        expect(sut.features().isEditable()).toBeFalsy()
      })

      it('- should reset fields', () => {
        const boolDiscFields = ['acceptsHousingBenefit', 'acceptsPets', 'acceptsCouples', 'hasDisabledAccess', 'isSuitableForWomen', 'isSuitableForYoungPeople', 'hasSingleRooms', 'hasSharedRooms', 'hasShowerBathroomFacilities', 'hasAccessToKitchen', 'hasFlexibleMealTimes', 'hasLounge', 'providesCleanBedding', 'allowsVisitors', 'hasOnSiteManager', 'referenceReferralIsRequired', 'foodIsIncluded']
        Object.keys(sut.features().formFields())
          .forEach((k) => {
            if (k === 'additionalFeaturesReadOnly') {
              expect(sut.features().formFields()[k]()).toEqual('<p>additional features</p>\n')
            } else if (k === 'featuresAvailableAtAdditionalCostReadOnly') {
              expect(sut.features().formFields()[k]()).toEqual('<p>features available at additional cost</p>\n')
            } else if (k.endsWith('ReadOnly')) {
              expect(sut.features().formFields()[k]()).toEqual('Ask Landlord')
            } else if (boolDiscFields.includes(k)) {
              expect(sut.features().formFields()[k]()).toEqual(`${testData.features[k]}`)
            } else {
              expect(sut.features().formFields()[k]()).toEqual(testData.features[k])
            }
          })
      })
    })
  })
})
