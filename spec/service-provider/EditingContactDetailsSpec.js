/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const ajax = require('../../src/js/ajax')
const endpoints = require('../../src/js/api-endpoints')
const browser = require('../../src/js/browser')
const cookies = require('../../src/js/cookies')
const getUrlParameter = require('../../src/js/get-url-parameter')

describe('Edit Service Provider Contact Information', () => {
  const Model = require('../../src/js/models/ServiceProvider')
  let model = null

  beforeEach(() => {
    let fakeResolved = {
      then: function (success, error) {
        success({
          'status': 200,
          'data': coffee4Craig()
        })
      }
    }

    sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(cookies, 'get').returns('stored-session-token')
    sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()

    model.editContactDetails()
  })

  afterEach(() => {
    ajax.get.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
    browser.loaded.restore()
    browser.loading.restore()
  })

  it('should set isEditingContactDetails to true', () => {
    expect(model.isEditingContactDetails).toBeTruthy()
  })

  describe('Save', () => {
    var stubbedPutApi

    beforeEach(() => {
      let fakeResolved = {
        then: (success, _) => {
          success({
            'status': 200,
            'data': {}
          })
        }
      }

      stubbedPutApi = sinon.stub(ajax, 'put').returns(fakeResolved)

      model.serviceProvider().telephone('new telephone')
      model.serviceProvider().email('new email')
      model.serviceProvider().website('new website')
      model.serviceProvider().facebook('new facebook')
      model.serviceProvider().twitter('new twitter')

      model.saveContactDetails()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should put service provider contact details to api with session token', () => {
      var endpoint = endpoints.getServiceProviders + '/coffee4craig/contact-details'
      var headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      var payload = JSON.stringify({
        'Telephone': 'new telephone',
        'Email': 'new email',
        'Website': 'new website',
        'Facebook': 'new facebook',
        'Twitter': 'new twitter'
      })
      var apiCalledWithExpectedArgs = stubbedPutApi.withArgs(endpoint, headers, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should set isEditingContactDetails to false', () => {
      expect(model.isEditingContactDetails()).toBeFalsy()
    })
  })

  describe('Invalid submission', () => {
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

      sinon.stub(ajax, 'put').returns(fakeResolved)

      model.serviceProvider().telephone('new telephone')
      model.serviceProvider().email('new email')
      model.serviceProvider().website('new website')
      model.serviceProvider().facebook('new facebook')
      model.serviceProvider().twitter('new twitter')

      model.saveContactDetails()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should set message as joined error messages', () => {
      expect(model.errors()[0]).toEqual('returned error message 1')
      expect(model.errors()[1]).toEqual('returned error message 2')
    })

    it('should keep isEditingContactDetails as true', () => {
      expect(model.isEditingContactDetails()).toBeTruthy()
    })
  })
})

function coffee4Craig() {
  return {
    "key": "coffee4craig",
    "name": "Coffee 4 Craig",
    "email": "risha@coffee4craig.com",
    "telephone": "07973955003",
    "website": "http://www.coffee4craig.com/",
    "facebook": "https://www.facebook.com/Coffee4Craig/?fref=ts",
    "twitter": "@Coffee4Craig",
    "addresses": [],
    "providedServices": []
  }
}
