/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminurls = require('../../src/js/admin-urls')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')

describe('Service Providers', () => {
  var Dashboard = require('../../src/js/models/ServiceProviders')
  var dashboard
  var stubbedApi
  var browserLoadingStub
  var browserLoadedStub

  beforeEach(() => {
    let fakeResolved = {
      then: function (success, error) {
        success({
          'status': 200,
          'data': [
            {
              'key': 'albert-kennedy-trust',
              'name': 'Albert Kennedy Trust',
              'isVerified': false,
              'isPublished': false,
              'associatedCityId': 'manchester'
            },
            {
              'key': 'booth-centre',
              'name': 'Booth Centre',
              'isVerified': true,
              'isPublished': true,
              'associatedCityId': 'leeds'
            },
            {
              'key': 'coffee4craig',
              'name': 'Coffee4Craig',
              'isVerified': false,
              'isPublished': true,
              'associatedCityId': 'brighton'
            }
          ]
        })
      }
    }

    stubbedApi = sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(cookies, 'get').returns('stored-session-token')
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    dashboard = new Dashboard()
  })

  afterEach(() => {
    ajax.get.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should tell user loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('should retrieve service providers from api with session token', () => {
    var endpoint = endpoints.getServiceProviders
    var headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }
    var payload = {}
    var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
    expect(apiCalledWithExpectedArgs).toBeTruthy()
  })

  it('should tell user loaded', () => {
    expect(browserLoadedStub.calledAfter(stubbedApi)).toBeTruthy()
  })

  it('should populate service provider collection', () => {
    expect(dashboard.serviceProviders().length).toEqual(3)
  })

  it('should sort service provider by name', () => {
    expect(dashboard.serviceProviders()[0].key).toEqual('albert-kennedy-trust')
    expect(dashboard.serviceProviders()[1].key).toEqual('booth-centre')
    expect(dashboard.serviceProviders()[2].key).toEqual('coffee4craig')
  })

  it('should sort service provider by city id', () => {
    expect(dashboard.serviceProviders()[0].cityId).toEqual('manchester')
    expect(dashboard.serviceProviders()[1].cityId).toEqual('leeds')
    expect(dashboard.serviceProviders()[2].cityId).toEqual('brighton')
  })

  it('should set service provider url', () => {
    expect(dashboard.serviceProviders()[0].url).toEqual(adminurls.serviceProviders + '?key=albert-kennedy-trust')
  })

  it('should set create new user url', () => {
    expect(dashboard.serviceProviders()[0].newUserUrl).toEqual(adminurls.userAdd + '?key=albert-kennedy-trust')
  })

  it('should have verifiedLabel equal to the providers verification status', () => {
    expect(dashboard.serviceProviders()[0].verifiedLabel()).toEqual('under review')
    expect(dashboard.serviceProviders()[1].verifiedLabel()).toEqual('verified')
  })

  it('should have verifiedLabelClass based on the providers verification status', () => {
    expect(dashboard.serviceProviders()[0].verifiedLabelClass()).toEqual('status status--false')
    expect(dashboard.serviceProviders()[1].verifiedLabelClass()).toEqual('status status--true')
  })

  it('should have publishedLabel equal to the providers publication status', () => {
    expect(dashboard.serviceProviders()[0].publishedLabel()).toEqual('disabled')
    expect(dashboard.serviceProviders()[1].publishedLabel()).toEqual('published')
  })

  it('should have publishedLabelClass based on the providers publication status', () => {
    expect(dashboard.serviceProviders()[0].publishedLabelClass()).toEqual('status status--false')
    expect(dashboard.serviceProviders()[1].publishedLabelClass()).toEqual('status status--true')
  })

  it('- should set available cities', () => {
    expect(dashboard.availableCities().length).toEqual(3)
  })

  describe('- filter by city', () => {
    beforeEach(() => {
      dashboard.cityFilter('leeds')
      dashboard.filterByCity()
    })

    it('- should filter to providers in selected city', () => {
      expect(dashboard.serviceProviders().length).toEqual(1)
      expect(dashboard.serviceProviders()[0].key).toEqual('booth-centre')
    })
  })

  describe('- view all', () => {
    beforeEach(() => {
      dashboard.filterByCity()
    })

    it('- should show all providers', () => {
      expect(dashboard.serviceProviders().length).toEqual(3)
    })
  })

  describe('- filter by status', () => {
    beforeEach(() => {
      dashboard.isVerifiedFilter('true')
      dashboard.filterByVerified()
    })

    it('- should filter to providers with selected status', () => {
      expect(dashboard.serviceProviders().length).toEqual(1)
      expect(dashboard.serviceProviders()[0].key).toEqual('booth-centre')
    })
  })

  describe('- view all', () => {
    beforeEach(() => {
      dashboard.filterByVerified()
    })

    it('- should show all providers', () => {
      expect(dashboard.serviceProviders().length).toEqual(3)
    })
  })
})
