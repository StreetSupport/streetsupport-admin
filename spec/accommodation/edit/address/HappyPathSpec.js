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

const { testData, publishedServiceProviderData } = require('../testData')

describe('Accommodation - Edit Address', () => {
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
    sinon.stub(auth, 'isSuperAdmin')
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
    expect(sut.address().formFields().nearestSupportProviderId()).toEqual('provider-b')
  })

  it('- should load support providers', () => {
    expect(sut.address().serviceProviders().length).toEqual(6)
  })

  it('- should set support providers id', () => {
    expect(sut.address().serviceProviders()[2].id).toEqual('provider-c')
  })

  it('- should set support providers name', () => {
    expect(sut.address().serviceProviders()[2].name).toEqual(`Provider C`)
  })

  it('- should set selected support providers read only name', () => {
    expect(sut.address().formFields().nearestSupportProviderIdReadOnly()).toEqual(`Provider B`)
  })

  it('- should notify user it is loaded', () => {
    expect(browserLoadedStub.called).toBeTruthy()
  })

  describe('- edit address', () => {
    beforeEach(() => {
      sut.address().edit()

      Object.keys(sut.address().formFields())
        .filter((k) => !k.endsWith('ReadOnly'))
        .forEach((k) => {
          sut.address().formFields()[k](`new ${sut.address().formFields()[k]()}`)
        })
    })

    it('- should set isEditable to true', () => {
      expect(sut.address().isEditable()).toBeTruthy()
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

        sut.address().save()
      })

      afterEach(() => {
        ajax.patch.restore()
      })

      it('- should notify user it is loading', () => {
        expect(browserLoadingStub.calledOnce).toBeTruthy()
      })

      it('- should patch new data', () => {
        const endpoint = `${endpoints.temporaryAccommodation}/${testData.id}/address`
        const headers = {
          'content-type': 'application/json',
          'session-token': 'stored-session-token'
        }
        const payload = {
          Street1: 'new street line 1',
          Street2: 'new street line 2',
          Street3: 'new street line 3',
          City: 'new city',
          Postcode: 'new m1 3fy',
          PublicTransportInfo: 'new public transport info',
          NearestSupportProviderId: 'new provider-b',
          AddressIsPubliclyHidden: 'new false'
        }
        const patchAsExpected = ajaxPatchStub
          .withArgs(endpoint, headers, payload)
          .calledAfter(browserLoadingStub)
        expect(patchAsExpected).toBeTruthy()
      })

      it('- should notify user it has loaded', () => {
        expect(browserLoadedStub.calledAfter(ajaxPatchStub)).toBeTruthy()
      })

      it('- should set address to read only', () => {
        expect(sut.address().isEditable()).toBeFalsy()
      })

      describe('- edit again, then cancel', () => {
        beforeEach(() => {
          Object.keys(sut.address().formFields())
            .filter((k) => !k.endsWith('ReadOnly'))
            .forEach((k) => {
              sut.address().formFields()[k](`another ${sut.address().formFields()[k]()}`)
            })

          sut.address().cancel()
        })

        it('- should set isEditable to false', () => {
          expect(sut.address().isEditable()).toBeFalsy()
        })

        it('- should reset fields', () => {
          Object.keys(sut.address().formFields())
            .filter((k) => !k.endsWith('ReadOnly'))
            .forEach((k) => {
              expect(sut.address().formFields()[k]()).toEqual(`new ${testData.address[k]}`)
            })
        })
      })
    })

    describe('- cancel', () => {
      beforeEach(() => {
        sut.address().cancel()
      })

      it('- should set isEditable to false', () => {
        expect(sut.address().isEditable()).toBeFalsy()
      })

      it('- should reset fields', () => {
        Object.keys(sut.address().formFields())
          .filter((k) => !k.endsWith('ReadOnly'))
          .forEach((k) => {
            expect(sut.address().formFields()[k]()).toEqual(testData.address[k])
          })
      })
    })
  })
})
