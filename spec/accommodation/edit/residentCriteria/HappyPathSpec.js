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

const { testData, publishedServiceProviderData } = require('../testData')

describe('Accommodation - Edit residentCriteria', () => {
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
            'data': publishedServiceProviderData
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

  it('- should load residentCriteria', () => {
    expect(sut.residentCriteria().formFields().acceptsMen()).toBeTruthy()
    expect(sut.residentCriteria().formFields().acceptsWomen()).toBeTruthy()
    expect(sut.residentCriteria().formFields().acceptsCouples()).toBeTruthy()
    expect(sut.residentCriteria().formFields().acceptsSingleSexCouples()).toBeTruthy()
    expect(sut.residentCriteria().formFields().acceptsYoungPeople()).toBeTruthy()
    expect(sut.residentCriteria().formFields().acceptsFamilies()).toBeTruthy()
    expect(sut.residentCriteria().formFields().acceptsBenefitsClaimants()).toBeTruthy()
  })

  describe('- edit resident criteria', () => {
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

      sut.residentCriteria().edit()

      sut.residentCriteria().formFields().acceptsMen(false)
      sut.residentCriteria().formFields().acceptsWomen(false)
      sut.residentCriteria().formFields().acceptsCouples(false)
      sut.residentCriteria().formFields().acceptsSingleSexCouples(false)
      sut.residentCriteria().formFields().acceptsYoungPeople(false)
      sut.residentCriteria().formFields().acceptsFamilies(false)
      sut.residentCriteria().formFields().acceptsBenefitsClaimants(false)
    })

    afterEach(() => {
      ajax.patch.restore()
    })

    it('- should set isEditable to true', () => {
      expect(sut.residentCriteria().isEditable()).toBeTruthy()
    })

    describe('- submit', () => {
      beforeEach(() => {
        browserLoadingStub.reset()
        browserLoadedStub.reset()

        sut.residentCriteria().save()
      })

      it('- should notify user it is loading', () => {
        expect(browserLoadingStub.calledOnce).toBeTruthy()
      })

      it('- should patch new data', () => {
        const endpoint = `${endpoints.temporaryAccommodation}/${testData.id}/residents-criteria`
        const headers = {
          'content-type': 'application/json',
          'session-token': 'stored-session-token'
        }
        const payload = {
          AcceptsMen: false,
          AcceptsWomen: false,
          AcceptsCouples: false,
          AcceptsSingleSexCouples: false,
          AcceptsYoungPeople: false,
          AcceptsFamilies: false,
          AcceptsBenefitsClaimants: false
        }

        const patchAsExpected = ajaxPatchStub
          .withArgs(endpoint, headers, payload)
          .calledAfter(browserLoadingStub)
        expect(patchAsExpected).toBeTruthy()
      })

      it('- should notify user it has loaded', () => {
        expect(browserLoadedStub.calledAfter(ajaxPatchStub)).toBeTruthy()
      })

      it('- should set residentCriteria to read only', () => {
        expect(sut.residentCriteria().isEditable()).toBeFalsy()
      })

      describe('- edit again, then cancel', () => {
        beforeEach(() => {
          sut.residentCriteria().formFields().acceptsMen(true)
          sut.residentCriteria().formFields().acceptsWomen(true)
          sut.residentCriteria().formFields().acceptsCouples(true)
          sut.residentCriteria().formFields().acceptsSingleSexCouples(true)
          sut.residentCriteria().formFields().acceptsYoungPeople(true)
          sut.residentCriteria().formFields().acceptsFamilies(true)
          sut.residentCriteria().formFields().acceptsBenefitsClaimants(true)

          sut.residentCriteria().cancel()
        })

        it('- should set isEditable to false', () => {
          expect(sut.residentCriteria().isEditable()).toBeFalsy()
        })

        it('- should reset fields', () => {
          expect(sut.residentCriteria().formFields().acceptsMen()).toBeFalsy()
          expect(sut.residentCriteria().formFields().acceptsWomen()).toBeFalsy()
          expect(sut.residentCriteria().formFields().acceptsCouples()).toBeFalsy()
          expect(sut.residentCriteria().formFields().acceptsSingleSexCouples()).toBeFalsy()
          expect(sut.residentCriteria().formFields().acceptsYoungPeople()).toBeFalsy()
          expect(sut.residentCriteria().formFields().acceptsFamilies()).toBeFalsy()
          expect(sut.residentCriteria().formFields().acceptsBenefitsClaimants()).toBeFalsy()
        })
      })
    })

    describe('- cancel', () => {
      beforeEach(() => {
        sut.residentCriteria().cancel()
      })

      it('- should set isEditable to false', () => {
        expect(sut.residentCriteria().isEditable()).toBeFalsy()
      })

      it('- should reset fields', () => {
        expect(sut.residentCriteria().formFields().acceptsMen()).toBeTruthy()
        expect(sut.residentCriteria().formFields().acceptsWomen()).toBeTruthy()
        expect(sut.residentCriteria().formFields().acceptsCouples()).toBeTruthy()
        expect(sut.residentCriteria().formFields().acceptsSingleSexCouples()).toBeTruthy()
        expect(sut.residentCriteria().formFields().acceptsYoungPeople()).toBeTruthy()
        expect(sut.residentCriteria().formFields().acceptsFamilies()).toBeTruthy()
        expect(sut.residentCriteria().formFields().acceptsBenefitsClaimants()).toBeTruthy()
      })
    })
  })
})
