/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const srcRoot = '../../../../src/'
const jsRoot = `${srcRoot}js/`
const ajax = require(`${jsRoot}ajax`)
const auth = require(`${jsRoot}auth`)
const endpoints = require(`${jsRoot}api-endpoints`)
const browser = require(`${jsRoot}browser`)
const querystring = require(`${jsRoot}get-url-parameter`)

const { testData, publishedServiceProviderData } = require('../testData')

import { categories } from '../../../../src/data/generated/accommodation-categories'

describe('Accommodation - Edit General Information', () => {
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

  it('- should load name', () => {
    expect(sut.generalDetails().formFields().name()).toEqual('name')
  })

  it('- should load synopsis', () => {
    expect(sut.generalDetails().formFields().synopsis()).toEqual('synopsis')
  })

  it('- should load synopsisReadOnly', () => {
    expect(sut.generalDetails().formFields().synopsisReadOnly()).toEqual('<p>synopsis</p>\n')
  })

  it('- should load description', () => {
    expect(sut.generalDetails().formFields().description()).toEqual('description')
  })

  it('- should load descriptionReadOnly', () => {
    expect(sut.generalDetails().formFields().descriptionReadOnly()).toEqual('<p>description</p>\n')
  })

  it('- should have available accommodation types', () => {
    expect(sut.generalDetails().accommodationTypes().length).toEqual(categories.length)
  })

  it('- should load service provider', () => {
    expect(sut.generalDetails().formFields().serviceProviderId()).toEqual('service-provider-id')
  })

  it('- should load support providers', () => {
    expect(sut.generalDetails().serviceProviders().length).toEqual(publishedServiceProviderData.length)
  })

  it('- should notify user it is loaded', () => {
    expect(browserLoadedStub.called).toBeTruthy()
  })

  describe('- edit general information', () => {
    beforeEach(() => {
      sut.generalDetails().edit()

      sut.generalDetails().formFields().name('new name')
      sut.generalDetails().formFields().synopsis('new synopsis')
      sut.generalDetails().formFields().description('new description')
      sut.generalDetails().formFields().isOpenAccess(true)
      sut.generalDetails().formFields().isPubliclyVisible(true)
      sut.generalDetails().formFields().accommodationType('accommodation type')
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
        const payload = { Name: 'new name',
          Synopsis: 'new synopsis',
          Description: 'new description',
          IsOpenAccess: true,
          IsPubliclyVisible: true,
          AccommodationType: 'accommodation type',
          ServiceProviderId: 'service-provider-id'
        }
        const patchAsExpected = ajaxPatchStub
          .withArgs(endpoint, payload)
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
