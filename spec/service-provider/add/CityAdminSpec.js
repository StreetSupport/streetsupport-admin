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
let cookies = require('../../../src/js/cookies')

describe('Add Service Provider as City Admin', () => {
  let Model = require('../../../src/js/models/AddServiceProvider')
  let model = null
  let cookiesStub = null

  beforeEach(() => {
    sinon.stub(auth, 'isCityAdmin').returns(true)
    sinon.stub(auth, 'cityAdminFor').returns('timbuktu')
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
      cookiesStub = sinon.stub(cookies, 'get')
      cookiesStub.withArgs('session-token').returns('stored-session-token')
      cookiesStub.withArgs('auth-claims').returns('CityAdminFor:timbuktu,CityAdmin')
      stubbedBrowser = sinon.stub(browser, 'redirect')

      model.name('New Service Provider')
      model.save()
    })

    afterEach(() => {
      ajax.post.restore()
      cookies.get.restore()
      browser.redirect.restore()
    })

    it('should post service provider name to api', () => {
      var endpoint = endpoints.getServiceProviders
      var payload = {
        'Name': 'New Service Provider',
        'AssociatedCity': 'timbuktu'
      }
      var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should redirect to dashboard', () => {
      expect(stubbedBrowser.withArgs(adminurls.dashboard).calledOnce).toBeTruthy()
    })
  })
})
