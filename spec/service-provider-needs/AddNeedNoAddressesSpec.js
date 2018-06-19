/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var getUrlParameter = require('../../src/js/get-url-parameter')

describe('Add individual Need with no addresses', () => {
  var Model = require('../../src/js/models/service-provider-needs/AddServiceProviderNeed')
  var model

  beforeEach(() => {
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(getUrlParameter, 'parameter').withArgs('providerId').returns('coffee4craig')

    let fakeGetResolution = {
      then: function (success, error) {
        success({
          'statusCode': 200,
          'data': []
        })
      }
    }
    sinon.stub(ajax, 'get').withArgs(
      endpoints.getServiceProviders + '/coffee4craig/addresses'
    ).returns(fakeGetResolution)
    model = new Model()
  })

  afterEach(() => {
    browser.loading.restore()
    browser.loaded.restore()
    getUrlParameter.parameter.restore()
    ajax.get.restore()
  })

  it('should set postcode to empty string', () => {
    expect(model.need().postcode()).toEqual('')
  })
})
