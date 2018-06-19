/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminurls = require('../../src/js/admin-urls')
var browser = require('../../src/js/browser')
var getUrlParameter = require('../../src/js/get-url-parameter')

describe('Edit individual Address', () => {
  var Model = require('../../src/js/models/service-provider-addresses/EditServiceProviderAddress')
  var model
  var stubbedApi
  var stubbedUrlParams

  beforeEach(() => {
    let fakeResolved = {
      then: function (success, error) {
        success({
          'statusCode': 200,
          'data': addressData()
        })
      }
    }

    stubbedApi = sinon.stub(ajax, 'get').returns(fakeResolved)
    stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter')
    stubbedUrlParams.withArgs('providerId').returns('coffee4craig')
    stubbedUrlParams.withArgs('addressId').returns('1234')
    sinon.stub(browser, 'loaded')
    sinon.stub(browser, 'loading')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loaded.restore()
    browser.loading.restore()
    getUrlParameter.parameter.restore()
  })

  it('should retrieve address from api', () => {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig/addresses/1234'
    var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint).calledOnce
    expect(apiCalledWithExpectedArgs).toBeTruthy()
  })

  it('should map and decode Address street line 1', () => {
    expect(model.address().street1()).toEqual('St Mary\'s street 1')
  })

  it('should map and decode Address street line 2', () => {
    expect(model.address().street2()).toEqual('St Mary\'s street 2')
  })

  it('should map and decode Address street line 3', () => {
    expect(model.address().street3()).toEqual('St Mary\'s street 3')
  })

  it('should map and decode Address street line 4', () => {
    expect(model.address().street4()).toEqual('St Mary\'s street 4')
  })

  it('should map and decode Address city', () => {
    expect(model.address().city()).toEqual('St Mary\'s city')
  })

  it('should map Address postcode', () => {
    expect(model.address().postcode()).toEqual('M4 5JD')
  })

  describe('Save', () => {
    var browserSpy

    beforeEach(() => {
      let fakeResolved = {
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': {}
          })
        }
      }

      browserSpy = sinon.stub(browser, 'redirect')
      sinon.stub(ajax, 'put').returns(fakeResolved)

      model.address().save()
    })

    afterEach(() => {
      ajax.put.restore()
      browser.redirect.restore()
    })

    it('should redirect to service provider', () => {
      var redirect = adminurls.serviceProviders + '?key=coffee4craig'
      expect(browserSpy.withArgs(redirect).calledOnce).toBeTruthy()
    })
  })
})

function addressData () {
  return {
    'key': 1234,
    'street': 'St Mary&#39;s street 1',
    'street1': 'St Mary&#39;s street 2',
    'street2': 'St Mary&#39;s street 3',
    'street3': 'St Mary&#39;s street 4',
    'city': 'St Mary&#39;s city',
    'postcode': 'M4 5JD',
    'openingTimes': [{
      'startTime': '10:00',
      'endTime': '16:30',
      'day': 'Monday'
    }, {
      'startTime': '10:00',
      'endTime': '16:30',
      'day': 'Tuesday'
    }]
  }
}
