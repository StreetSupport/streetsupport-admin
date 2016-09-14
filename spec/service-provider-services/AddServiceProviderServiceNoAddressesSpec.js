/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var cookies = require('../../src/js/cookies')
var getUrlParameter = require('../../src/js/get-url-parameter')
var browser = require('../../src/js/browser')

describe('Add Service Provider Service, no addresses', () => {
  var Model = require('../../src/js/models/service-provider-services/AddServiceProviderService')
  var model
  var stubbedApi

  beforeEach(() => {
    function categoriesPromise (value) {
      return {
        then: function (success, error) {
          success({
            'status': 200,
            'data': categories()
          })
        }
      }
    }

    function providerPromise (value) {
      return {
        then: function (success, error) {
          success({
            'status': 200,
            'data': addresses()
          })
        }
      }
    }

    stubbedApi = sinon.stub(ajax, 'get')

    var headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }

    stubbedApi.withArgs(endpoints.getServiceCategories,
      headers,
      {}).returns(categoriesPromise())

    stubbedApi.withArgs(endpoints.getServiceProviders + '/coffee4craig',
      headers,
      {}).returns(providerPromise())

    sinon.stub(cookies, 'get').returns('stored-session-token')
    sinon.stub(getUrlParameter, 'parameter').withArgs('providerId').returns('coffee4craig')

    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
  })

  it('should populate addresses', () => {
    expect(model.addresses().length).toEqual(0)
  })

  it('- should set hasAddresses', () => {
    expect(model.hasAddresses()).toBeFalsy()
  })

  it('address street should start empty', () => {
    expect(model.address().street1()).toEqual('')
  })
})

function categories () {
  return [{
    'key': 'accom',
    'sortOrder': 90,
    'name': 'Accommodation',
    'synopsis': 'Permanent and temporary accomodation.',
    'subCategories': [{
      'key': 'emergency',
      'name': 'Emergency',
      'synopsis': 'Emergency accomodation'
    }, {
      'key': 'hostel',
      'name': 'Hostel',
      'synopsis': 'Hostel accomodation'
    }, {
      'key': 'hosted',
      'name': 'Hosted',
      'synopsis': 'Hosted accomodation'
    }, {
      'key': 'rented',
      'name': 'Rented',
      'synopsis': 'Rented accomodation in the private sector'
    }, {
      'key': 'supported',
      'name': 'Supported',
      'synopsis': 'Supported lodgings'
    }, {
      'key': 'social',
      'name': 'Social Housing',
      'synopsis': 'Social Housing'
    }, {
      'key': 'shelter',
      'name': 'Night shelter',
      'synopsis': 'Night shelter'
    }],
    'documentCreationDate': '2015-12-16T16:12:49.8370000Z',
    'documentModifiedDate': '2015-12-16T16:12:49.8370000Z'
  }, {
    'key': 'communications',
    'sortOrder': 0,
    'name': 'Communications',
    'synopsis': 'Internet and telephone access, and postal services.',
    'subCategories': [{
      'key': 'telephone',
      'name': 'Telephone',
      'synopsis': 'Free telephone use'
    }, {
      'key': 'internet',
      'name': 'Internet access',
      'synopsis': 'Internet access'
    }],
    'documentCreationDate': '2015-12-16T16:12:49.8370000Z',
    'documentModifiedDate': '2015-12-16T16:12:49.8370000Z'
  }]
}

function addresses () {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'addresses': []
  }
}
