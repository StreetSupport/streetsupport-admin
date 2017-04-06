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

describe('Accommodation - Edit General Information', () => {
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

  it('- should load name', () => {
    expect(sut.generalDetails().formFields().name()).toEqual('name')
  })

  it('- should load description', () => {
    expect(sut.generalDetails().formFields().description()).toEqual('description')
  })

  it('- should notify user it is loaded', () => {
    expect(browserLoadedStub.called).toBeTruthy()
  })

  describe('- edit general information', () => {
    beforeEach(() => {
      sut.generalDetails().edit()

      sut.generalDetails().formFields().name('new name')
      sut.generalDetails().formFields().description('new description')
    })

    it('- should set isEditable to true', () => {
      expect(sut.generalDetails().isEditable()).toBeTruthy()
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

        sut.generalDetails().save()
      })

      afterEach(() => {
        ajax.patch.restore()
      })

      it('- should notify user it is loading', () => {
        expect(browserLoadingStub.calledOnce).toBeTruthy()
      })

      it('- should patch new data', () => {
        const endpoint = `${endpoints.temporaryAccommodation}/${testData.id}/general-details`
        const headers = {
          'content-type': 'application/json',
          'session-token': 'stored-session-token'
        }
        const payload = {
          'Name': 'new name',
          'Description': 'new description'
        }
        const patchAsExpected = ajaxPatchStub
          .withArgs(endpoint, headers, payload)
          .calledAfter(browserLoadingStub)
        expect(patchAsExpected).toBeTruthy()
      })

      it('- should notify user it has loaded', () => {
        expect(browserLoadedStub.calledAfter(ajaxPatchStub)).toBeTruthy()
      })

      it('- should set general details to read only', () => {
        expect(sut.generalDetails().isEditable()).toBeFalsy()
      })

      describe('- edit again, then cancel', () => {
        beforeEach(() => {
          sut.generalDetails().formFields().name('another contact name')
          sut.generalDetails().formFields().description('another description')

          sut.generalDetails().cancel()
        })

        it('- should set isEditable to false', () => {
          expect(sut.generalDetails().isEditable()).toBeFalsy()
        })

        it('- should reset fields', () => {
          expect(sut.generalDetails().formFields().name()).toEqual('new name')
          expect(sut.generalDetails().formFields().description()).toEqual('new description')
        })
      })
    })

    describe('- cancel', () => {
      beforeEach(() => {
        sut.generalDetails().cancel()
      })

      it('- should set isEditable to false', () => {
        expect(sut.generalDetails().isEditable()).toBeFalsy()
      })

      it('- should reset fields', () => {
        expect(sut.generalDetails().formFields().name()).toEqual(testData.generalInfo.name)
        expect(sut.generalDetails().formFields().description()).toEqual(testData.generalInfo.description)
      })
    })
  })
})
