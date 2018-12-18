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
const validation = require(`${jsRoot}validation`)

const { testData, publishedServiceProviderData } = require('../testData')

describe('Accommodation - Edit Address - no street1 set', () => {
  const Model = require(`${jsRoot}models/accommodation/edit`)
  let sut = null
  let validationStub = null
  let ajaxGetStub = null
  let ajaxPatchStub = null

  beforeEach(() => {
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    ajaxGetStub = sinon.stub(ajax, 'get')
    ajaxGetStub.withArgs(`${endpoints.temporaryAccommodation}/${testData.id}`)
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
            'data': publishedServiceProviderData
          })
        }
      })
    sinon.stub(auth, 'isSuperAdmin')
    sinon.stub(auth, 'getLocationsForUser').returns([0])
    validationStub = sinon.stub(validation, 'showErrors')

    sinon.stub(querystring, 'parameter')
      .withArgs('id')
      .returns(testData.id)

    sut = new Model()
    sut.init()

    ajaxPatchStub = sinon.stub(ajax, 'patch')

    sut.address().edit()

    Object.keys(sut.address().formFields())
      .filter((k) => !k.endsWith('ReadOnly'))
      .forEach((k) => {
        sut.address().formFields()[k](`new ${sut.address().formFields()[k]()}`)
      })

    sut.address().formFields().street1('')

    sut.address().save()
  })

  afterEach(() => {
    ajax.get.restore()
    ajax.patch.restore()
    auth.isSuperAdmin.restore()
    auth.getLocationsForUser.restore()
    browser.loaded.restore()
    browser.loading.restore()
    querystring.parameter.restore()
    validation.showErrors.restore()
  })

  it('- should not patch new data', () => {
    expect(ajaxPatchStub.called).toBeFalsy()
  })

  it('- should show errors', () => {
    expect(validationStub.calledOnce).toBeTruthy()
  })
})
