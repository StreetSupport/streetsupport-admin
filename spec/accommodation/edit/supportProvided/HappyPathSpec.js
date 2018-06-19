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
const cookies = require(`${jsRoot}cookies`)
const querystring = require(`${jsRoot}get-url-parameter`)
const storage = require(`${jsRoot}localStorage`)

const { testData, publishedServiceProviderData } = require('../testData')

describe('Accommodation - Edit SupportProvided', () => {
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
    sinon.stub(auth, 'isSuperAdmin')
    sinon.stub(storage, 'get').withArgs('roles').returns('superadmin')
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
    auth.isSuperAdmin.restore()
    cookies.get.restore()
    querystring.parameter.restore()
    storage.get.restore()
  })

  it('- should notify user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('- should get data', () => {
    expect(ajaxGetStub.calledTwice).toBeTruthy()
  })

  it('- should load supportProvided', () => {
    expect(sut.supportProvided().formFields().hasOnSiteManager()).toEqual(`${testData.supportProvided.hasOnSiteManager}`)
    expect(sut.supportProvided().formFields().supportInfo()).toEqual(testData.supportProvided.supportInfo)
    expect(sut.supportProvided().formFields().supportOffered()).toEqual(testData.supportProvided.supportOffered)
  })

  it('- should set boolean/discretionary read only value', () => {
    expect(sut.supportProvided().formFields().hasOnSiteManagerReadOnly()).toEqual('Don\'t Know/Ask')
  })

  it('- should set text area read only values', () => {
    expect(sut.supportProvided().formFields().supportInfoReadOnly()).toEqual('<p>support info</p>\n')
  })

  it('- should set string collection read only values', () => {
    expect(sut.supportProvided().formFields().supportOfferedReadOnly()).toEqual('support a, support b')
  })

  describe('- edit support provided', () => {
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

      sut.supportProvided().edit()

      sut.supportProvided().formFields().hasOnSiteManager(1)
      sut.supportProvided().formFields().supportInfo('new support info')
      sut.supportProvided().formFields().supportOffered(['support a', 'support c'])
    })

    afterEach(() => {
      ajax.patch.restore()
    })

    it('- should set isEditable to true', () => {
      expect(sut.supportProvided().isEditable()).toBeTruthy()
    })

    describe('- submit', () => {
      beforeEach(() => {
        browserLoadingStub.reset()
        browserLoadedStub.reset()

        sut.supportProvided().save()
      })

      it('- should notify user it is loading', () => {
        expect(browserLoadingStub.calledOnce).toBeTruthy()
      })

      it('- should patch new data', () => {
        const endpoint = `${endpoints.temporaryAccommodation}/${testData.id}/support-offered`
        const headers = {
          'content-type': 'application/json',
          'session-token': 'stored-session-token'
        }
        const payload = {
          'HasOnSiteManager': 1,
          'SupportInfo': 'new support info',
          'SupportOffered': [ 'support a', 'support c' ]
        }

        const patchAsExpected = ajaxPatchStub
          .withArgs(endpoint, headers, payload)
          .calledAfter(browserLoadingStub)
        expect(patchAsExpected).toBeTruthy()
      })

      it('- should notify user it has loaded', () => {
        expect(browserLoadedStub.calledAfter(ajaxPatchStub)).toBeTruthy()
      })

      it('- should set supportProvided to read only', () => {
        expect(sut.supportProvided().isEditable()).toBeFalsy()
      })

      describe('- edit again, then cancel', () => {
        beforeEach(() => {
          sut.supportProvided().formFields().hasOnSiteManager(0)
          sut.supportProvided().formFields().supportInfo('another support info')
          sut.supportProvided().formFields().supportOffered(['support d'])

          sut.supportProvided().cancel()
        })

        it('- should set isEditable to false', () => {
          expect(sut.supportProvided().isEditable()).toBeFalsy()
        })

        it('- should reset fields', () => {
          expect(sut.supportProvided().formFields().hasOnSiteManager()).toEqual(1)
          expect(sut.supportProvided().formFields().supportInfo()).toEqual('new support info')
          expect(sut.supportProvided().formFields().supportOffered()).toEqual([ 'support a', 'support c' ])
        })
      })
    })

    describe('- cancel', () => {
      beforeEach(() => {
        sut.supportProvided().cancel()
      })

      it('- should set isEditable to false', () => {
        expect(sut.supportProvided().isEditable()).toBeFalsy()
      })

      it('- should reset fields', () => {
        expect(sut.supportProvided().formFields().hasOnSiteManager()).toEqual('2')
        expect(sut.supportProvided().formFields().supportInfo()).toEqual('support info')
        expect(sut.supportProvided().formFields().supportOffered()).toEqual([ 'support a', 'support b' ])
      })
    })
  })
})
