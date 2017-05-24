/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const srcRoot = '../../../../src/'
const jsRoot = `${srcRoot}js/`
const ajax = require(`${jsRoot}ajax`)
const endpoints = require(`${jsRoot}api-endpoints`)
const browser = require(`${jsRoot}browser`)
const cookies = require(`${jsRoot}cookies`)
const querystring = require(`${jsRoot}get-url-parameter`)

const { testData, allServiceProviderData } = require('../testData')

describe('Accommodation - Edit General Information - as super admin', () => {
  const Model = require(`${jsRoot}models/accommodation/edit`)
  const headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }
  let sut = null

  let ajaxGetStub = null

  beforeEach(() => {
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
      .withArgs(`${endpoints.getServiceProvidersHAL}`, headers)
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': allServiceProviderData
          })
        }
      })

    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    
    const cookiesStub = sinon.stub(cookies, 'get')

    cookiesStub
      .withArgs('session-token')
      .returns('stored-session-token')

    cookiesStub
      .withArgs('auth-claims')
      .returns('SuperAdmin')

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

  it('- should load all service providers', () => {
    expect(sut.generalDetails().serviceProviders().length).toEqual(allServiceProviderData.items.length)
  })
})
