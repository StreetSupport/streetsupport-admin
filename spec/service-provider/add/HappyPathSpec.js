/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

let sinon = require('sinon')
let ajax = require('../../../src/js/ajax')
let auth = require('../../../src/js/auth')
let endpoints = require('../../../src/js/api-endpoints')
let adminurls = require('../../../src/js/admin-urls')
let browser = require('../../../src/js/browser')

import { cities } from '../../../src/data/generated/supported-cities'

describe('Add Service Provider', () => {
  let Model = require('../../../src/js/models/AddServiceProvider')
  let model = null

  beforeEach(() => {
    sinon.stub(auth, 'isCityAdmin')
    sinon.stub(auth, 'cityAdminFor')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(browser, 'scrollTo')
    model = new Model()
  })

  afterEach(() => {
    auth.isCityAdmin.restore()
    auth.cityAdminFor.restore()
    browser.loading.restore()
    browser.loaded.restore()
    browser.scrollTo.restore()
  })

  it('should start with Name empty', () => {
    expect(model.name()).toEqual('')
  })

  it('should start with errors false', () => {
    expect(model.hasErrors()).toBeFalsy()
  })

  it('should set cities', () => {
    expect(model.cities().length).toEqual(cities.length)
  })

  describe('Save', () => {
    var stubbedApi
    let stubbedBrowser = null

    beforeEach(() => {
      let fakeResolved = {
        then: (success, _) => {
          success({
            'statusCode': 201
          })
        }
      }

      stubbedApi = sinon.stub(ajax, 'post').returns(fakeResolved)
      stubbedBrowser = sinon.stub(browser, 'redirect')

      model.name('New Service Provider')
      model.cityId('manchester, leeds')
      model.save()
    })

    afterEach(() => {
      ajax.post.restore()
      browser.redirect.restore()
    })

    it('should post service provider name to api', () => {
      var endpoint = endpoints.getServiceProvidersHAL
      var payload = {
        'Name': 'New Service Provider',
        'AssociatedLocations': 'manchester, leeds'
      }

      var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should redirect to dashboard', () => {
      expect(stubbedBrowser.withArgs(adminurls.dashboard).calledOnce).toBeTruthy()
    })
  })

  describe('Save fail', () => {
    var stubbedBrowser
    beforeEach(() => {
      let fakeResolved = {
        then: (result, _) => {
          result({
            'statusCode': 400,
            'data': {
              'messages': ['returned error message 1', 'returned error message 2']
            }
          })
        }
      }

      sinon.stub(ajax, 'post').returns(fakeResolved)
      stubbedBrowser = sinon.stub(browser, 'redirect')

      model.name('New Service Provider')
      model.save()
    })

    afterEach(() => {
      ajax.post.restore()
      browser.redirect.restore()
    })

    it('set errors in message', () => {
      expect(model.errors()[0]).toEqual('returned error message 1')
      expect(model.errors()[1]).toEqual('returned error message 2')
    })

    it('should not redirect to dashboard', () => {
      expect(stubbedBrowser.withArgs(adminurls.dashboard).notCalled).toBeTruthy()
    })
  })
})
