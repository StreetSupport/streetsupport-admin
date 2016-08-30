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
var adminUrls = require('../../src/js/admin-urls')

describe('Edit Service', () => {
  let Model = require('../../src/js/models/service-provider-services/EditGroupedService')
  let model = null
  let stubbedApi = null
  let stubbedUrlParams = null
  let stubbedBrowser = null

  beforeEach(() => {
    let fakeResolved = {
      then: (success, _) => {
        success({
          'status': 200,
          'data': serviceData()
        })
      }
    }

    stubbedApi = sinon.stub(ajax, 'get').returns(fakeResolved)
    stubbedBrowser = sinon.stub(browser, 'redirect')
    sinon.stub(cookies, 'get').returns('stored-session-token')
    stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter')
    stubbedUrlParams.withArgs('providerId').returns('coffee4craig')
    stubbedUrlParams.withArgs('serviceId').returns('57bdb2c58705422ecc657228')
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
    browser.redirect.restore()
  })

  it('should request for service', () => {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig/services/57bdb2c58705422ecc657228'
    var headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }
    var payload = {}
    var apiCalled = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
    expect(apiCalled).toBeTruthy()
  })

  it('should set serviceProviderId on Service', () => {
    expect(model.service().serviceProviderId).toEqual('coffee4craig')
  })

  it('should set name on Service', () => {
    expect(model.service().name).toEqual('Personal Items')
  })

  it('should set location description on Service', () => {
    expect(model.service().locationDescription()).toEqual('location description')
  })

  it('should set opening times start time on Service', () => {
    expect(model.service().openingTimes()[0].startTime()).toEqual('10:00')
  })

  it('should set opening times end time on Service', () => {
    expect(model.service().openingTimes()[0].endTime()).toEqual('18:00')
  })

  describe('Save', () => {
    beforeEach(() => {
      let fakeResolved = {
        then: (success, _) => {
          success({
            'status': 200,
            'data': serviceData()
          })
        }
      }

      stubbedApi = sinon.stub(ajax, 'put').returns(fakeResolved)

      model.service().save()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should redirect to service provider', () => {
      expect(stubbedBrowser.withArgs(adminUrls.serviceProviders + '?key=coffee4craig').calledOnce).toBeTruthy()
    })
  })
})

function serviceData () {
  return {
    'id': '57bdb2c58705422ecc657228',
    'categoryId': 'items',
    'categoryName': 'Personal Items',
    'categorySynopsis': 'Clothes, blankets, shoes, sleeping bags, and disposable goods including toiletries and sanitary products',
    'info': 'test description',
    'tags': [
      'lesbians'
    ],
    'location': {
      'description': 'location description',
      'streetLine1': 'street 1',
      'streetLine2': 'street 2',
      'streetLine3': '',
      'streetLine4': '',
      'city': 'Manchester',
      'postcode': 'm3 3IF',
      'latitude': 53.4755361548836,
      'longitude': -2.25848699844466
    },
    'openingTimes': [
      {
        'startTime': '10:00',
        'endTime': '18:00',
        'day': 'Tuesday'
      }
    ],
    'serviceProviderId': 'vince-test-provider',
    'serviceProviderName': 'Vince Test Provider',
    'isPublished': false,
    'subCategories': [
      {
        'id': 'clothes',
        'name': 'Clothes'
      },
      {
        'id': 'blankets',
        'name': 'Blankets'
      }
    ]
  }
}
