/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const adminurls = require('../../src/js/admin-urls')
const ajax = require('../../src/js/ajax')
const browser = require('../../src/js/browser')
const endpoints = require('../../src/js/api-endpoints')

import { cities } from '../../src/data/generated/supported-cities'

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
          'data': {
            items: [
              {
                'key': 'albert-kennedy-trust',
                'name': 'Albert Kennedy Trust',
                'isVerified': false,
                'isPublished': false,
                'associatedLocationIds': 'manchester'
              },
              {
                'key': 'booth-centre',
                'name': 'Booth Centre',
                'isVerified': true,
                'isPublished': true,
                'associatedLocationIds': 'leeds'
              },
              {
                'key': 'coffee4craig',
                'name': 'Coffee4Craig',
                'isVerified': false,
                'isPublished': true,
                'associatedLocationIds': 'brighton'
              }
            ]
          }
        })
      }
    }

    stubbedApi = sinon.stub(ajax, 'get').returns(fakeResolved)
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    dashboard = new Dashboard()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should tell user loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('should retrieve service providers from api', () => {
    var endpoint = endpoints.getServiceProvidersHAL
    var payload = {}
    var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, payload).calledOnce
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
    expect(dashboard.availableCities().length).toEqual(cities.length)
  })

  describe('- filter by city', () => {
    beforeEach(() => {
      dashboard.cityFilter('leeds')
      dashboard.filter()
    })

    it('- should filter to providers in selected city', () => {
      expect(dashboard.serviceProviders().length).toEqual(1)
      expect(dashboard.serviceProviders()[0].key).toEqual('booth-centre')
    })
  })

  describe('- filter by status', () => {
    beforeEach(() => {
      dashboard.isVerifiedFilter('true')
      dashboard.filter()
    })

    it('- should filter to providers with selected status', () => {
      expect(dashboard.serviceProviders().length).toEqual(1)
      expect(dashboard.serviceProviders()[0].key).toEqual('booth-centre')
    })
  })

  describe('- filter by published', () => {
    beforeEach(() => {
      dashboard.isPublishedFilter('true')
      dashboard.filter()
    })

    it('- should filter to providers with selected status', () => {
      expect(dashboard.serviceProviders().length).toEqual(2)
      expect(dashboard.serviceProviders()[0].key).toEqual('booth-centre')
    })
  })

  describe('- view all', () => {
    beforeEach(() => {
      dashboard.filter()
    })

    it('- should show all providers', () => {
      expect(dashboard.serviceProviders().length).toEqual(3)
    })
  })

  describe('- filter by all', () => {
    beforeEach(() => {
      dashboard.isVerifiedFilter('true')
      dashboard.cityFilter('manchester')
      dashboard.isPublishedFilter('true')
      dashboard.filter()
    })

    it('- should filter to providers', () => {
      expect(dashboard.serviceProviders().length).toEqual(0)
    })
  })
})
