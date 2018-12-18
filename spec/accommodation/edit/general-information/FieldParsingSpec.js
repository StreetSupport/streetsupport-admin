/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const srcRoot = '../../../../src/'
const jsRoot = `${srcRoot}js/`
const ajax = require(`${jsRoot}ajax`)
const auth = require(`${jsRoot}auth`)
const browser = require(`${jsRoot}browser`)
const endpoints = require(`${jsRoot}api-endpoints`)
const querystring = require(`${jsRoot}get-url-parameter`)

const origTestData = require('../testData')

const testData = JSON.parse(JSON.stringify(origTestData.testData))
testData.generalInfo.name = 'bob&#39;s burgers'
testData.generalInfo.description = 'bob&#39;s burgers&#10;&#10;* fries&#10;* burgers&#10;* hotdogs'
const serviceProviderData = origTestData.publishedServiceProviderData

describe('Accommodation - Edit General Information - Field Parsing', () => {
  const Model = require(`${jsRoot}models/accommodation/edit`)
  let sut = null

  let ajaxGetStub = null

  beforeEach(() => {
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
            'data': serviceProviderData
          })
        }
      })
    sinon.stub(auth, 'isSuperAdmin')
    sinon.stub(auth, 'getLocationsForUser').returns([])
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

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
    browser.loading.restore()
    browser.loaded.restore()
    querystring.parameter.restore()
  })

  it('- should decode name', () => {
    expect(sut.generalDetails().formFields().name()).toEqual(`bob's burgers`)
  })

  it('- should load description', () => {
    expect(sut.generalDetails().formFields().description()).toEqual(`bob's burgers\n\n* fries\n* burgers\n* hotdogs`)
  })
})
