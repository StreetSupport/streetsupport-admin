/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const ajax = require('../../src/js/ajax')
const endpoints = require('../../src/js/api-endpoints')
const browser = require('../../src/js/browser')
const cookies = require('../../src/js/cookies')
const spTags = require('../../src/js/serviceProviderTags')
const getUrlParameter = require('../../src/js/get-url-parameter')

describe('Edit Service Provider General Details', () => {
  const Model = require('../../src/js/models/ServiceProvider')
  let model = null

  beforeEach(() => {
    let fakeResolved = {
      then: (success, _) => {
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
    sinon.stub(spTags, 'all').returns(['Tag A', 'Tag B', 'Tag C', 'Tag D', 'Tag E'])

    model = new Model()

    model.editGeneralDetails()
  })

  afterEach(() => {
    ajax.get.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
    browser.loaded.restore()
    browser.loading.restore()
    spTags.all.restore()
  })

  it('should set isEditingGeneralDetails to true', () => {
    expect(model.isEditingGeneralDetails).toBeTruthy()
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

      model.serviceProvider().description('new description')
      model.serviceProvider().shortDescription('new short description')
      model.serviceProvider().tags()[0].isSelected(true)
      model.serviceProvider().tags()[1].isSelected(true)
      model.serviceProvider().tags()[2].isSelected(true)
      model.serviceProvider().tags()[3].isSelected(false)
      model.serviceProvider().tags()[4].isSelected(false)

      model.saveGeneralDetails()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should put service provider general details to api with session token', () => {
      var endpoint = endpoints.getServiceProviders + '/coffee4craig/general-information'
      var headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      var payload = {
        'Description': 'new description',
        'ShortDescription': 'new short description',
        'Tags': ['tag-a', 'tag-b', 'tag-c']
      }
      var apiCalledWithExpectedArgs = stubbedPutApi.withArgs(endpoint, headers, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should set isEditingGeneralDetails to false', () => {
      expect(model.isEditingGeneralDetails()).toBeFalsy()
    })
  })

  describe('Invalid submission', () => {
    beforeEach(() => {
      const fakeResolved = {
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

      model.serviceProvider().description('new description')

      model.saveGeneralDetails()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should set message as joined error messages', () => {
      expect(model.errors()[1]).toEqual('returned error message 2')
    })

    it('should keep isEditingGeneralDetails as true', () => {
      expect(model.isEditingGeneralDetails()).toBeTruthy()
    })
  })

  describe('Invalid submission then valid submission', () => {
    beforeEach(() => {
      let fakeResolved = {
        then: (success, _) => {
          success({
            'status': 200,
            'data': {}
          })
        }
      }

      sinon.stub(ajax, 'put').returns(fakeResolved)

      model.errors(['error a', 'error b'])
      model.serviceProvider().description('new description')
      model.serviceProvider().shortDescription('new short description')

      model.saveGeneralDetails()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should clear errors', () => {
      expect(model.hasErrors()).toBeFalsy()
    })
  })
})

function coffee4Craig () {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'description': 'initial description',
    'addresses': [],
    'groupedServices': [],
    'providedServices': [],
    'tags': ['tag-a', 'tag-c', 'tag-d']
  }
}
