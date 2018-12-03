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

describe('Accommodation - Edit Contact Information - invalid email set', () => {
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
    validationStub = sinon.stub(validation, 'showErrors')

    sinon.stub(querystring, 'parameter')
      .withArgs('id')
      .returns(testData.id)

    sut = new Model()
    sut.init()

    ajaxPatchStub = sinon.stub(ajax, 'patch')

    sut.contactDetails().edit()

    sut.contactDetails().formFields().name('new name')
    sut.contactDetails().formFields().additionalInfo('new additional info')
    sut.contactDetails().formFields().email('invalid email')
    sut.contactDetails().formFields().telephone('new telephone')

    sut.contactDetails().save()
  })

  afterEach(() => {
    ajax.get.restore()
    ajax.patch.restore()
    auth.getLocationsForUser.restore()
    auth.isSuperAdmin.restore()
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
