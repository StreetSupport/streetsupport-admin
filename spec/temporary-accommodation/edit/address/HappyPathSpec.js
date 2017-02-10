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

describe('Temporary Accommodation - Edit Address', () => {
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

  it('- should load address line 1', () => {
    expect(sut.address().formFields().street1()).toEqual('street line 1')
  })

  it('- should load address line 2', () => {
    expect(sut.address().formFields().street2()).toEqual('street line 2')
  })

  it('- should load address line 3', () => {
    expect(sut.address().formFields().street3()).toEqual('street line 3')
  })

  it('- should load address city', () => {
    expect(sut.address().formFields().city()).toEqual('city')
  })

  it('- should load address postcode', () => {
    expect(sut.address().formFields().postcode()).toEqual('m1 3fy')
  })

  it('- should load address public transport info', () => {
    expect(sut.address().formFields().publicTransportInfo()).toEqual('public transport info')
  })

  it('- should load address nearest support provider', () => {
    expect(sut.address().formFields().nearestSupportProviderId()).toEqual('nearest support provider')
  })

  it('- should notify user it is loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })

  describe('- edit contact information', () => {
    beforeEach(() => {
      sut.contactDetails().edit()

      sut.contactDetails().formFields().name('new name')
      sut.contactDetails().formFields().additionalInfo('new additionalInfo')
      sut.contactDetails().formFields().email('new-test@email.com')
      sut.contactDetails().formFields().telephone('new telephone')
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

        sut.contactDetails().save()
      })

      afterEach(() => {
        ajax.patch.restore()
      })

      it('- should notify user it is loading', () => {
        expect(browserLoadingStub.calledOnce).toBeTruthy()
      })

      it('- should patch new data', () => {
        const endpoint = `${endpoints.temporaryAccommodation}/${testData.id}/contact-information`
        const headers = {
          'content-type': 'application/json',
          'session-token': 'stored-session-token'
        }
        const payload = {
          'Name': 'new name',
          'AdditionalInfo': 'new additionalInfo',
          'Email': 'new-test@email.com',
          'Telephone': 'new telephone'
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
        expect(sut.contactDetails().isEditable()).toBeFalsy()
      })

      describe('- edit again, then cancel', () => {
        beforeEach(() => {
          sut.contactDetails().formFields().name('another name')
          sut.contactDetails().formFields().additionalInfo('another additionalInfo')
          sut.contactDetails().formFields().email('another-email@test.com')
          sut.contactDetails().formFields().telephone('another telephone')

          sut.contactDetails().cancel()
        })

        it('- should set isEditable to false', () => {
          expect(sut.contactDetails().isEditable()).toBeFalsy()
        })

        it('- should reset fields', () => {
          expect(sut.contactDetails().formFields().name()).toEqual('new name')
          expect(sut.contactDetails().formFields().additionalInfo()).toEqual('new additionalInfo')
          expect(sut.contactDetails().formFields().email()).toEqual('new-test@email.com')
          expect(sut.contactDetails().formFields().telephone()).toEqual('new telephone')
        })
      })
    })

    describe('- cancel', () => {
      beforeEach(() => {
        sut.contactDetails().cancel()
      })

      it('- should set isEditable to false', () => {
        expect(sut.contactDetails().isEditable()).toBeFalsy()
      })

      it('- should reset fields', () => {
        expect(sut.contactDetails().formFields().name()).toEqual(testData.contactInformation.name)
        expect(sut.contactDetails().formFields().additionalInfo()).toEqual(testData.contactInformation.additionalInfo)
        expect(sut.contactDetails().formFields().email()).toEqual(testData.contactInformation.email)
        expect(sut.contactDetails().formFields().telephone()).toEqual(testData.contactInformation.telephone)
      })
    })
  })
})
