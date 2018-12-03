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
const validation = require(`${jsRoot}validation`)

const { testData, publishedServiceProviderData } = require('../testData')

const boolDiscFields = ['foodIsIncluded']

describe('Accommodation - Edit PricingAndRequirements', () => {
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
      .withArgs(`${endpoints.getPublishedServiceProviders}`)
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
    browser.loading.restore()
    browser.loaded.restore()
    ajax.get.restore()
    auth.isSuperAdmin.restore()
    auth.getLocationsForUser.restore()
    querystring.parameter.restore()
  })

  it('- should notify user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('- should load pricingAndRequirements', () => {
    Object.keys(testData.pricingAndRequirements)
      .forEach((k) => {
        if (boolDiscFields.includes(k)) {
          expect(sut.pricingAndRequirements().formFields()[k]()).toEqual(`${testData.pricingAndRequirements[k]}`)
        } else {
          expect(sut.pricingAndRequirements().formFields()[k]()).toEqual(testData.pricingAndRequirements[k])
        }
      })
  })

  it('- should set boolean/discretionary read only value', () => {
    expect(sut.pricingAndRequirements().formFields().foodIsIncludedReadOnly()).toEqual('Don\'t Know/Ask')
  })

  it('- should set text area read only values', () => {
    expect(sut.pricingAndRequirements().formFields().referralNotesReadOnly()).toEqual('<p>referral notes</p>\n')
    expect(sut.pricingAndRequirements().formFields().availabilityOfMealsReadOnly()).toEqual('<p>availability of meals</p>\n')
    expect(sut.pricingAndRequirements().formFields().featuresAvailableAtAdditionalCostReadOnly()).toEqual('<p>features available at additional cost</p>\n')
  })

  describe('- edit pricing and requirements', () => {
    let ajaxPatchStub = null
    beforeEach(() => {
      ajaxPatchStub = sinon.stub(ajax, 'patch')
        .returns({
          then: function (success, error) {
            success({
              'statusCode': 200
            })
          }
        })

      sut.pricingAndRequirements().edit()

      Object.keys(testData.pricingAndRequirements)
        .forEach((k) => {
          if (testData.pricingAndRequirements[k] === true) {
            sut.pricingAndRequirements().formFields()[k](false)
          } else if (testData.pricingAndRequirements[k] === 2) {
            sut.pricingAndRequirements().formFields()[k](1)
          } else if (k === 'price') {
            sut.pricingAndRequirements().formFields()[k](678.90)
          } else {
            sut.pricingAndRequirements().formFields()[k](`new ${testData.pricingAndRequirements[k]}`)
          }
        })
    })

    afterEach(() => {
      ajax.patch.restore()
    })

    it('- should set isEditable to true', () => {
      expect(sut.pricingAndRequirements().isEditable()).toBeTruthy()
    })

    describe('- non numerical price', () => {
      beforeEach(() => {
        sinon.stub(validation, 'showErrors')
        sut.pricingAndRequirements().formFields().price('not a number')
        sut.pricingAndRequirements().save()
      })

      afterEach(() => {
        validation.showErrors.restore()
      })

      it('- should not patch', () => {
        expect(ajaxPatchStub.called).toBeFalsy()
      })
    })

    describe('- submit', () => {
      beforeEach(() => {
        browserLoadingStub.reset()
        browserLoadedStub.reset()

        sut.pricingAndRequirements().save()
      })

      it('- should notify user it is loading', () => {
        expect(browserLoadingStub.calledOnce).toBeTruthy()
      })

      it('- should patch new data', () => {
        const endpoint = `${endpoints.temporaryAccommodation}/${testData.id}/pricing-and-requirements`
        const payload = {
          'ReferralIsRequired': false,
          'ReferralNotes': 'new referral notes',
          'Price': 678.90,
          'FoodIsIncluded': 1,
          'AvailabilityOfMeals': 'new availability of meals',
          'FeaturesAvailableAtAdditionalCost': 'new features available at additional cost'
        }

        const patchAsExpected = ajaxPatchStub
          .withArgs(endpoint, payload)
          .calledAfter(browserLoadingStub)
        expect(patchAsExpected).toBeTruthy()
      })

      it('- should notify user it has loaded', () => {
        expect(browserLoadedStub.calledAfter(ajaxPatchStub)).toBeTruthy()
      })

      it('- should set pricingAndRequirements to read only', () => {
        expect(sut.pricingAndRequirements().isEditable()).toBeFalsy()
      })

      describe('- edit again, then cancel', () => {
        beforeEach(() => {
          Object.keys(testData.pricingAndRequirements)
            .forEach((k) => {
              if (testData.pricingAndRequirements[k] === false) {
                sut.pricingAndRequirements().formFields()[k](true)
              } else if (testData.pricingAndRequirements[k] === 1) {
                sut.pricingAndRequirements().formFields()[k](0)
              } else if (k === 'price') {
                sut.pricingAndRequirements().formFields()[k](8765.23)
              } else {
                sut.pricingAndRequirements().formFields()[k](`another ${testData.pricingAndRequirements[k]}`)
              }
            })

          sut.pricingAndRequirements().cancel()
        })

        it('- should set isEditable to false', () => {
          expect(sut.pricingAndRequirements().isEditable()).toBeFalsy()
        })

        it('- should reset fields', () => {
          expect(sut.pricingAndRequirements().formFields().referralIsRequired()).toEqual(false)
          expect(sut.pricingAndRequirements().formFields().referralNotes()).toEqual('new referral notes')
          expect(sut.pricingAndRequirements().formFields().price()).toEqual(678.9)
          expect(sut.pricingAndRequirements().formFields().foodIsIncluded()).toEqual(1)
          expect(sut.pricingAndRequirements().formFields().availabilityOfMeals()).toEqual('new availability of meals')
          expect(sut.pricingAndRequirements().formFields().featuresAvailableAtAdditionalCost()).toEqual('new features available at additional cost')
        })
      })
    })

    describe('- cancel', () => {
      beforeEach(() => {
        sut.pricingAndRequirements().cancel()
      })

      it('- should set isEditable to false', () => {
        expect(sut.pricingAndRequirements().isEditable()).toBeFalsy()
      })

      it('- should reset fields', () => {
        expect(sut.pricingAndRequirements().formFields().referralIsRequired()).toEqual(testData.pricingAndRequirements.referralIsRequired)
        expect(sut.pricingAndRequirements().formFields().referralNotes()).toEqual(testData.pricingAndRequirements.referralNotes)
        expect(sut.pricingAndRequirements().formFields().price()).toEqual(testData.pricingAndRequirements.price)
        expect(sut.pricingAndRequirements().formFields().foodIsIncluded()).toEqual(`${testData.pricingAndRequirements.foodIsIncluded}`)
        expect(sut.pricingAndRequirements().formFields().availabilityOfMeals()).toEqual(testData.pricingAndRequirements.availabilityOfMeals)
        expect(sut.pricingAndRequirements().formFields().featuresAvailableAtAdditionalCost()).toEqual(testData.pricingAndRequirements.featuresAvailableAtAdditionalCost)
      })
    })
  })
})
