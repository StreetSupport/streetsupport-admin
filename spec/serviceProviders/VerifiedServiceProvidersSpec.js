/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('basic-ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')

describe('VerifiedServiceProviders', function () {
  var Dashboard = require('../../src/js/models/ServiceProviders')
  var dashboard
  var stubbedApi

  beforeEach(function () {
    let fakeResolved = {
      then: function (success, error) {
        success({
          'status': 200,
          'json': [
            {
              'key': 'albert-kennedy-trust',
              'name': 'Albert Kennedy Trust',
              'isVerified': true,
              'isPublished': false
            },
            {
              'key': 'coffee4craig',
              'name': 'Coffee4Craig',
              'isVerified': false
            }
          ]
        })
      }
    }

    stubbedApi = sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(cookies, 'get').returns('stored-session-token')

    dashboard = new Dashboard()
  })

  afterEach(function () {
    ajax.get.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should set verified labels', function () {
    expect(dashboard.serviceProviders()[0].verifiedLabel()).toEqual('verified')
  })

  it('should set un-verified labels', function () {
    expect(dashboard.serviceProviders()[1].verifiedLabel()).toEqual('under review')
  })

  it('should set toggle verification button labels', function () {
    expect(dashboard.serviceProviders()[0].toggleVerificationButtonLabel()).toEqual('un-verify')
    expect(dashboard.serviceProviders()[1].toggleVerificationButtonLabel()).toEqual('verify')
  })

  describe('Toggle Verified status', function () {
    var stubbedPutApi

    beforeEach(function () {
      let fakePostResolved = {
        then: function (success, error) {
          success({
            'status': 200,
            'json': {}
          })
        }
      }

      stubbedPutApi = sinon.stub(ajax, 'put')
      stubbedPutApi.returns(fakePostResolved)

      dashboard.toggleVerified(dashboard.serviceProviders()[0])
    })

    afterEach(function () {
      ajax.put.restore()
    })

    it('should send inverse of current isVerified to api', function () {
      var endpoint = endpoints.getServiceProviders + '/albert-kennedy-trust/is-verified'
      var payload = JSON.stringify({
        'IsVerified': false
      })
      var headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      var apiCalledWithExpectedArgs = stubbedPutApi.withArgs(endpoint, headers, payload).calledOnce

      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should invert isVerified', function () {
      expect(dashboard.serviceProviders()[0].isVerified()).toBeFalsy()
    })

    it('should not change isPublished', function () {
      expect(dashboard.serviceProviders()[0].isPublished()).toBeFalsy()
    })

    it('should set verified labels', function () {
      expect(dashboard.serviceProviders()[0].verifiedLabel()).toEqual('under review')
    })

    it('should set toggle verification button labels', function () {
      expect(dashboard.serviceProviders()[0].toggleVerificationButtonLabel()).toEqual('verify')
    })
  })
})
