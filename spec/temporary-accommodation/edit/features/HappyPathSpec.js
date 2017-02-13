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

const testData = require('../testData')

describe('Temporary Accommodation - Edit Features', () => {
  const Model = require(`${jsRoot}models/temporary-accommodation/edit`)
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
    Object.keys(testData.features)
      .forEach((k) => {
        expect(sut.features().formFields()[k]()).toEqual(testData.features[k])
      })
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
          'AcceptsHousingBenefit': false,
          'AcceptsPets': 1,
          'AcceptsCouples': 1,
          'HasDisabledAccess': false,
          'IsSuitableForWomen': false,
          'IsSuitableForYoungPeople': false,
          'HasSingleRooms': false,
          'HasSharedRooms': false,
          'HasShowerBathroomFacilities': false,
          'HasAccessToKitchen': false,
          'HasFlexibleMealTimes': false,
          'HasLounge': false,
          'ProvidesCleanBedding': false,
          'AllowsVisitors': false,
          'HasOnSiteManager': false,
          'ReferenceReferralIsRequired': false,
          'Price': 678.9,
          'AdditionalFeatures': 'new additional features',
          'FoodIsIncluded': false,
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
          expect(sut.features().formFields().acceptsHousingBenefit()).toEqual(false)
          expect(sut.features().formFields().acceptsPets()).toEqual(1)
          expect(sut.features().formFields().acceptsCouples()).toEqual(1)
          expect(sut.features().formFields().hasDisabledAccess()).toEqual(false)
          expect(sut.features().formFields().isSuitableForWomen()).toEqual(false)
          expect(sut.features().formFields().isSuitableForYoungPeople()).toEqual(false)
          expect(sut.features().formFields().hasSingleRooms()).toEqual(false)
          expect(sut.features().formFields().hasSharedRooms()).toEqual(false)
          expect(sut.features().formFields().hasShowerBathroomFacilities()).toEqual(false)
          expect(sut.features().formFields().hasAccessToKitchen()).toEqual(false)
          expect(sut.features().formFields().hasFlexibleMealTimes()).toEqual(false)
          expect(sut.features().formFields().hasLounge()).toEqual(false)
          expect(sut.features().formFields().providesCleanBedding()).toEqual(false)
          expect(sut.features().formFields().allowsVisitors()).toEqual(false)
          expect(sut.features().formFields().hasOnSiteManager()).toEqual(false)
          expect(sut.features().formFields().referenceReferralIsRequired()).toEqual(false)
          expect(sut.features().formFields().price()).toEqual(678.9)
          expect(sut.features().formFields().additionalFeatures()).toEqual('new additional features')
          expect(sut.features().formFields().foodIsIncluded()).toEqual(false)
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
        Object.keys(sut.features().formFields())
          .forEach((k) => {
            expect(sut.features().formFields()[k]()).toEqual(testData.features[k])
          })
      })
    })
  })
})
