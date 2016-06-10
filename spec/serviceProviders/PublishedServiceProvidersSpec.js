/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')

describe('VerifiedServiceProviders', () => {
  var Dashboard = require('../../src/js/models/ServiceProviders')
  var dashboard

  beforeEach(() => {
    let fakeResolved = {
      then: function (success, error) {
        success({
          'status': 200,
          'data': [
            {
              'key': 'albert-kennedy-trust',
              'name': 'Albert Kennedy Trust',
              'isPublished': true
            },
            {
              'key': 'coffee4craig',
              'name': 'Coffee4Craig',
              'isPublished': false
            }
          ]
        })
      }
    }

    sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(cookies, 'get').returns('stored-session-token')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    dashboard = new Dashboard()
  })

  afterEach(() => {
    ajax.get.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should set published labels', () => {
    expect(dashboard.serviceProviders()[0].publishedLabel()).toEqual('published')
  })

  it('should set un-published labels', () => {
    expect(dashboard.serviceProviders()[1].publishedLabel()).toEqual('disabled')
  })

  it('should set toggle publish button labels', () => {
    expect(dashboard.serviceProviders()[0].togglePublishButtonLabel()).toEqual('disable')
    expect(dashboard.serviceProviders()[1].togglePublishButtonLabel()).toEqual('publish')
  })

  describe('Toggle Published status', () => {
    var stubbedPutApi

    beforeEach(() => {
      let fakePostResolved = {
        then: function (success, error) {
          success({
            'status': 200,
            'data': {}
          })
        }
      }

      stubbedPutApi = sinon.stub(ajax, 'put').returns(fakePostResolved)

      dashboard.togglePublished(dashboard.serviceProviders()[0])
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should send inverse of current isPublished to api', () => {
      var endpoint = endpoints.getServiceProviders + '/albert-kennedy-trust/is-published'
      var headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      var payload = {
        'IsPublished': false
      }
      var apiCalledWithExpectedArgs = stubbedPutApi.withArgs(endpoint, headers, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should invert isPublished', () => {
      expect(dashboard.serviceProviders()[0].isPublished()).toBeFalsy()
    })

    it('should set published labels', () => {
      expect(dashboard.serviceProviders()[0].publishedLabel()).toEqual('disabled')
    })

    it('should set toggle publish button labels', () => {
      expect(dashboard.serviceProviders()[0].togglePublishButtonLabel()).toEqual('publish')
    })
  })
})
