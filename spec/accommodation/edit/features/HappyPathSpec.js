/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const jsRoot = '../../../../src/js/'
const ajax = require(`${jsRoot}ajax`)
const auth = require(`${jsRoot}auth`)
const endpoints = require(`${jsRoot}api-endpoints`)
const browser = require(`${jsRoot}browser`)
const querystring = require(`${jsRoot}get-url-parameter`)

const { testData, publishedServiceProviderData } = require('../testData')

const boolDiscFields = ['acceptsPets', 'acceptsCouples', 'hasDisabledAccess', 'hasSingleRooms', 'hasSharedRooms', 'hasShowerBathroomFacilities', 'hasAccessToKitchen', 'hasFlexibleMealTimes', 'hasLounge', 'hasLaundryFacilities', 'providesCleanBedding', 'allowsVisitors']

describe('Accommodation - Edit Features', () => {
  const Model = require(`${jsRoot}models/accommodation/edit`)
  let sut = null

  let ajaxGetStub = null
  let browserLoadingStub = null
  let browserLoadedStub = null

  beforeEach(() => {
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    ajaxGetStub = sinon.stub(ajax, 'get')
    ajaxGetStub
      .withArgs(`${endpoints.temporaryAccommodation}/${testData.id}`)
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': testData
          })
        }
      })
    ajaxGetStub
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': publishedServiceProviderData
          })
        }
      })
    sinon.stub(auth, 'isSuperAdmin')
    sinon.stub(auth, 'getLocationsForUser').returns([])

    sinon.stub(querystring, 'parameter')
      .withArgs('id')
      .returns(testData.id)

    sut = new Model()
    sut.init()
  })

  afterEach(() => {
    ajax.get.restore()
    auth.isSuperAdmin.restore()
    auth.getLocationsForUser.restore()
    browser.loaded.restore()
    browser.loading.restore()
    querystring.parameter.restore()
  })

  it('- should notify user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('- should load features', () => {
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
    expect(sut.features().formFields().acceptsPetsReadOnly()).toEqual('Don\'t Know/Ask')
  })

  it('- should set additional features read only value', () => {
    expect(sut.features().formFields().additionalFeaturesReadOnly()).toEqual('<p>additional features</p>\n')
  })

  describe('- edit features', () => {
    beforeEach(() => {
      sut.features().edit()

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
      expect(sut.features().isEditable()).toBeTruthy()
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
        const payload = {
          'AcceptsPets': 1,
          'AcceptsCouples': 1,
          'HasDisabledAccess': 1,
          'HasSingleRooms': 1,
          'HasSharedRooms': 1,
          'HasShowerBathroomFacilities': 1,
          'HasAccessToKitchen': 1,
          'HasFlexibleMealTimes': 1,
          'HasLounge': 1,
          'HasLaundryFacilities': 1,
          'ProvidesCleanBedding': 1,
          'AllowsVisitors': 1,
          'AdditionalFeatures': 'new additional features',
          'AvailabilityOfMeals': 'new availability of meals'
        }
        const patchAsExpected = ajaxPatchStub
          .withArgs(endpoint, payload)
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
          expect(sut.features().formFields().acceptsPets()).toEqual(1)
          expect(sut.features().formFields().acceptsPetsReadOnly()).toEqual('Yes')
          expect(sut.features().formFields().hasDisabledAccess()).toEqual(1)
          expect(sut.features().formFields().hasSingleRooms()).toEqual(1)
          expect(sut.features().formFields().hasSharedRooms()).toEqual(1)
          expect(sut.features().formFields().hasShowerBathroomFacilities()).toEqual(1)
          expect(sut.features().formFields().hasAccessToKitchen()).toEqual(1)
          expect(sut.features().formFields().hasFlexibleMealTimes()).toEqual(1)
          expect(sut.features().formFields().hasLounge()).toEqual(1)
          expect(sut.features().formFields().hasLaundryFacilities()).toEqual(1)
          expect(sut.features().formFields().providesCleanBedding()).toEqual(1)
          expect(sut.features().formFields().allowsVisitors()).toEqual(1)
          expect(sut.features().formFields().additionalFeatures()).toEqual('new additional features')
          expect(sut.features().formFields().availabilityOfMeals()).toEqual('new availability of meals')
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
            if (k === 'additionalFeaturesReadOnly') {
              expect(sut.features().formFields()[k]()).toEqual('<p>additional features</p>\n')
            } else if (k.endsWith('ReadOnly')) {
              expect(sut.features().formFields()[k]()).toEqual('Don\'t Know/Ask')
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
