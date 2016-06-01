/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')
var getUrlParameter = require('../../src/js/get-url-parameter')

describe('Show Service Provider', () => {
  var Model = require('../../src/js/models/ServiceProvider')
  var model
  var stubbedApi

  beforeEach(() => {
    let fakeResolved = {
      then: function (success, error) {
        success({
          'status': 200,
          'data': coffee4Craig()
        })
      }
    }

    stubbedApi = sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(cookies, 'get').returns('stored-session-token')
    sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should retrieve service provider from api with session token', () => {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig'
    var headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }
    var payload = {}
    var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
    expect(apiCalledWithExpectedArgs).toBeTruthy()
  })

  it('should set service provider', () => {
    expect(model.serviceProvider().key()).toEqual('coffee4craig')
  })

  it('should set decoded provider short description', () => {
    expect(model.serviceProvider().shortDescription()).toEqual('St Mary\'s Centre provides a range of services for anyone who has been raped or sexually assaulted')
  })

  it('should set decoded provider description', () => {
    expect(model.serviceProvider().description()).toEqual('St Mary\'s Sexual Assault Referral Centre Coffee4Craig is a not-for-profit organisation set up to support, work with and be an all accepting approach to homelessness. ')
  })

  it('should set addresses', () => {
    expect(model.serviceProvider().addresses().length).toEqual(2)
  })

  it('should set addresses\' service provider id', () => {
    expect(model.serviceProvider().addresses()[0].serviceProviderId).toEqual('coffee4craig')
  })

  it('should set services\' service provider id', () => {
    expect(model.serviceProvider().services()[0].serviceProviderId).toEqual('coffee4craig')
  })

  it('should set needs\' service provider id', () => {
    expect(model.serviceProvider().needs()[0].serviceProviderId).toEqual('coffee4craig')
  })

  it('should set link to add address', () => {
    expect(model.serviceProvider().addAddressUrl).toEqual('add-service-provider-address.html?providerId=coffee4craig')
  })

  it('should set link to manage services', () => {
    expect(model.serviceProvider().addServiceUrl).toEqual('add-service-provider-service.html?providerId=coffee4craig')
  })

  it('should set link to manage needs', () => {
    expect(model.serviceProvider().addNeedUrl).toEqual('add-service-provider-need.html?providerId=coffee4craig')
  })
})

function coffee4Craig () {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'isVerified': false,
    'isPublished': true,
    'shortDescription': 'St Mary&#39;s Centre provides a range of services for anyone who has been raped or sexually assaulted',
    'description': 'St Mary&#39;s Sexual Assault Referral Centre Coffee4Craig is a not-for-profit organisation set up to support, work with and be an all accepting approach to homelessness. ',
    'establishedDate': '0001-01-03T00:00:00.0000000Z',
    'areaServiced': 'Manchester & South Wales',
    'email': 'risha@coffee4craig.com',
    'telephone': '07973955003',
    'website': 'http://www.coffee4craig.com/',
    'facebook': 'https://www.facebook.com/Coffee4Craig/?fref=ts',
    'twitter': '@Coffee4Craig',
    'addresses': [{
      'key': '1234',
      'street': '7-11 Lancaster Rd',
      'street1': null,
      'street2': null,
      'street3': null,
      'city': 'Salford',
      'postcode': 'M6 8AQ'
    }, {
      'key': '5678',
      'street': 'Manchester Picadilly',
      'street1': null,
      'street2': null,
      'street3': null,
      'city': null,
      'postcode': 'M1 1AF'
    }],
    'providedServices': [{
      'key': '569d2b468705432268b65c75',
      'name': 'Meals',
      'info': 'Breakfast',
      'openingTimes': [{
        'startTime': '09:00',
        'endTime': '10:00',
        'day': 'Monday'
      }, {
        'startTime': '09:00',
        'endTime': '10:00',
        'day': 'Tuesday'
      }],
      'address': {
        'key': '7a6ff0f3-5b04-4bd9-b088-954e473358f5',
        'street': 'Booth Centre',
        'street1': null,
        'street2': 'Edward Holt House',
        'street3': 'Pimblett Street',
        'city': 'Manchester',
        'postcode': 'M3 1FU',
        'openingTimes': null
      },
      'tags': ['some tags']
    }],
    'needs': [{
      'id': '56ca227f92855621e8d60318',
      'description': 'some new description.',
      'serviceProviderId': 'coffee4craig'
    }]
  }
}
