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

const origTestData = require('../testData')

const testData = JSON.parse(JSON.stringify(origTestData.testData))
testData.features.additionalFeatures = '* fries&#10;* burgers&#10;* hotdogs'
testData.features.featuresAvailableAtAdditionalCost = '* coke&#10;* sprite&#10;* fanta'

describe('Accommodation - Edit Features - field parsing', () => {
  const Model = require(`${jsRoot}models/accommodation/edit`)
  let sut = null

  let ajaxGetStub = null

  beforeEach(() => {
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
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
            'data': origTestData.publishedServiceProviderData
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

  it('- should decode Additional Features', () => {
    expect(sut.features().formFields().additionalFeatures()).toEqual(`* fries
* burgers
* hotdogs`)
  })
})
