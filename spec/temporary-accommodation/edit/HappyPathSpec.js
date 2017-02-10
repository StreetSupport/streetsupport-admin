/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const jsRoot = '../../../src/js/'
const ajax = require(`${jsRoot}ajax`)
const endpoints = require(`${jsRoot}api-endpoints`)
const browser = require(`${jsRoot}browser`)
const cookies = require(`${jsRoot}cookies`)
const querystring = require(`${jsRoot}get-url-parameter`)
const validation = require(`${jsRoot}validation`)

describe('Temporary Accommodation - Edit', () => {
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
      .withArgs(`${endpoints.temporaryAccommodation}/${itemData.id}`, headers)
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': itemData
          })
        }
      })
    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    sinon.stub(querystring, 'parameter')
      .withArgs('id')
      .returns(itemData.id)

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

  it('- should load contact information', () => {
    expect(sut.contactDetails().formFields().name()).toEqual('name')
  })

  it('- should load contact information', () => {
    expect(sut.contactDetails().formFields().additionalInfo()).toEqual('additionalInfo')
  })

  it('- should load contact information', () => {
    expect(sut.contactDetails().formFields().email()).toEqual('test@test.com')
  })

  it('- should load contact information', () => {
    expect(sut.contactDetails().formFields().telephone()).toEqual('telephone')
  })

  it('- should notify user it is loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })

  describe('- edit contact information', () => {
    beforeEach(() => {
      sut.contactDetails().edit()

      sut.contactDetails().formFields().name('new name')
      sut.contactDetails().formFields().additionalInfo('new additionalInfo')
      sut.contactDetails().formFields().email('new email')
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
        const endpoint = `${endpoints.temporaryAccommodation}/${itemData.id}/contact-information`
        const headers = {
          'content-type': 'application/json',
          'session-token': 'stored-session-token'
        }
        const payload = {
          'Name': 'new name',
          'AdditionalInfo': 'new additionalInfo',
          'Email': 'new email',
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
          sut.contactDetails().formFields().email('another email')
          sut.contactDetails().formFields().telephone('another telephone')

          sut.contactDetails().cancel()
        })

        it('- should set isEditable to false', () => {
          expect(sut.contactDetails().isEditable()).toBeFalsy()
        })

        it('- should reset fields', () => {
          expect(sut.contactDetails().formFields().name()).toEqual('new name')
          expect(sut.contactDetails().formFields().additionalInfo()).toEqual('new additionalInfo')
          expect(sut.contactDetails().formFields().email()).toEqual('new email')
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
        expect(sut.contactDetails().formFields().name()).toEqual(itemData.contactInformation.name)
        expect(sut.contactDetails().formFields().additionalInfo()).toEqual(itemData.contactInformation.additionalInfo)
        expect(sut.contactDetails().formFields().email()).toEqual(itemData.contactInformation.email)
        expect(sut.contactDetails().formFields().telephone()).toEqual(itemData.contactInformation.telephone)
      })
    })
  })
})

const itemData = {
  'contactInformation': {
    'name': 'name',
    'additionalInfo': 'additionalInfo',
    'email': 'test@test.com',
    'telephone': 'telephone'
  },
  'address': {
    'street1': '1',
    'street2': '2',
    'street3': '3',
    'city': 'city',
    'postcode': 'm1 3fy',
    'latitude': 0,
    'longitude': 0,
    'publicTransportInfo': '',
    'nearestSupportProviderId': ''
  },
  'features': null,
  'id': '589a08ad6a38c32e883f26df',
  'documentCreationDate': '2017-02-07T17:49:33.2570000Z',
  'documentModifiedDate': '2017-02-07T17:49:33.2570000Z'
}
