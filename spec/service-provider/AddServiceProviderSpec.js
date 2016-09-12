/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

let sinon = require('sinon')
let ajax = require('../../src/js/ajax')
let endpoints = require('../../src/js/api-endpoints')
let adminurls = require('../../src/js/admin-urls')
let browser = require('../../src/js/browser')
let cookies = require('../../src/js/cookies')

describe('Add Service Provider', () => {
  let Model = require('../../src/js/models/AddServiceProvider')
  let model = null
  let browserLoading = null
  let browserLoaded = null
  let ajaxGet = null

  beforeEach(() => {
    ajaxGet = sinon
      .stub(ajax, 'get')
      .returns({
        then: (success, _) => {
          success({
            'statusCode': 200,
            'data': cityData
          })
        }
      })
    browserLoading = sinon.stub(browser, 'loading')
    browserLoaded = sinon.stub(browser, 'loaded')
    sinon.stub(browser, 'scrollTo')
    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
    browser.scrollTo.restore()
  })

  it('should notify user it is loading', () => {
    expect(browserLoading.calledOnce).toBeTruthy()
  })

  it('should start with Name empty', () => {
    expect(model.name()).toEqual('')
  })

  it('should start with errors false', () => {
    expect(model.hasErrors()).toBeFalsy()
  })

  it('should set cities', () => {
    expect(model.cities().length).toEqual(2)
  })

  it('should set city id', () => {
    expect(model.cities()[1].Id).toEqual('leeds')
  })

  it('should set city name', () => {
    expect(model.cities()[1].Name).toEqual('Leeds')
  })

  it('should notify user it has loaded', () => {
    expect(browserLoaded.calledAfter(ajaxGet)).toBeTruthy()
  })

  describe('Save', () => {
    var stubbedApi
    let stubbedBrowser = null

    beforeEach(() => {
      let fakeResolved = {
        then: (success, _) => {
          success({
            'status': 201
          })
        }
      }

      stubbedApi = sinon.stub(ajax, 'post').returns(fakeResolved)
      sinon.stub(cookies, 'get').returns('stored-session-token')
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
      var headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      var payload = {
        'Name': 'New Service Provider'
      }
      var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
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
        then: (_, error) => {
          error({
            'status': 400,
            'response': JSON.stringify({
              'messages': ['returned error message 1', 'returned error message 2']
            })
          })
        }
      }

      sinon.stub(ajax, 'post').returns(fakeResolved)
      sinon.stub(cookies, 'get').returns('stored-session-token')
      stubbedBrowser = sinon.stub(browser, 'redirect')

      model.name('New Service Provider')
      model.save()
    })

    afterEach(() => {
      ajax.post.restore()
      cookies.get.restore()
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

let cityData = [
  {
    Id: 'manchester',
    Name: 'Manchester',
    Longitude: -2.24455696347558,
    Latitude: 53.4792777155671
  },
  {
    Id: 'leeds',
    Name: 'Leeds',
    Longitude: -1.54511238485298,
    Latitude: 53.7954906003838
  }
]
