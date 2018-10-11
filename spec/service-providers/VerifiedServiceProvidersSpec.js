/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const ajax = require('../../src/js/ajax')
const auth = require('../../src/js/auth')
const endpoints = require('../../src/js/api-endpoints')
const browser = require('../../src/js/browser')

describe('VerifiedServiceProviders', () => {
  const Dashboard = require('../../src/js/models/service-providers/listing')
  let dashboard

  beforeEach(() => {
    let fakeResolved = {
      then: function (success, error) {
        success({
          'status': 200,
          'data': {
            'items': [
              {
                'key': 'albert-kennedy-trust',
                'name': 'Albert Kennedy Trust',
                'isVerified': true,
                'isPublished': false,
                'associatedCityId': 'manchester'
              },
              {
                'key': 'coffee4craig',
                'name': 'Coffee4Craig',
                'isVerified': false,
                'associatedCityId': 'manchester'
              }
            ]
          }
        })
      }
    }

    sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(auth, 'isCityAdmin').returns(false)
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    dashboard = new Dashboard()
  })

  afterEach(() => {
    ajax.get.restore()
    auth.isCityAdmin.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should set verified labels', () => {
    expect(dashboard.items()[0].verifiedLabel()).toEqual('verified')
  })

  it('should set un-verified labels', () => {
    expect(dashboard.items()[1].verifiedLabel()).toEqual('under review')
  })

  it('should set toggle verification button labels', () => {
    expect(dashboard.items()[0].toggleVerificationButtonLabel()).toEqual('un-verify')
    expect(dashboard.items()[1].toggleVerificationButtonLabel()).toEqual('verify')
  })

  describe('Toggle Verified status', () => {
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

      stubbedPutApi = sinon.stub(ajax, 'put')
      stubbedPutApi.returns(fakePostResolved)

      dashboard.toggleVerified(dashboard.items()[0])
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should send inverse of current isVerified to api', () => {
      var endpoint = endpoints.getServiceProviders + '/albert-kennedy-trust/is-verified'
      var payload = {
        'IsVerified': false
      }
      var apiCalledWithExpectedArgs = stubbedPutApi.withArgs(endpoint, payload).calledOnce

      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should invert isVerified', () => {
      expect(dashboard.items()[0].isVerified()).toBeFalsy()
    })

    it('should not change isPublished', () => {
      expect(dashboard.items()[0].isPublished()).toBeFalsy()
    })

    it('should set verified labels', () => {
      expect(dashboard.items()[0].verifiedLabel()).toEqual('under review')
    })

    it('should set toggle verification button labels', () => {
      expect(dashboard.items()[0].toggleVerificationButtonLabel()).toEqual('verify')
    })
  })
})
