/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const ko = require('knockout')
const sinon = require('sinon')
const ajax = require('../../src/js/ajax')
const browser = require('../../src/js/browser')
const getUrlParameter = require('../../src/js/get-url-parameter')

describe('Edit Service Provider Admin Information', () => {
  const Model = require('../../src/js/models/service-providers/ServiceProviderDetails')
  let model = null

  beforeEach(() => {
    let fakeResolved = {
      then: function (success, error) {
        success({
          'statusCode': 200,
          'data': coffee4Craig()
        })
      }
    }

    sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(browser, 'scrollTo')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    getUrlParameter.parameter.restore()
    browser.loaded.restore()
    browser.loading.restore()
    browser.scrollTo.restore()
  })

  it('should set lastUpdateDate', () => {
    expect(model.serviceProvider().lastUpdateDate()).toEqual(new Date(coffee4Craig().documentModifiedDate).toLocaleString())
  })

  it('should set empty selectedAdministrator', () => {
    expect(model.serviceProvider().selectedAdministrator()).toEqual('')
  })

  describe('Save', () => {
    var stubbedPutApi

    beforeEach(() => {
      sinon.stub(global.window, 'alert')

      let fakeResolved = {
        then: (success, _) => {
          success({
            'statusCode': 200,
            'data': { 'documentModifiedDate': '2021-09-16T13:45:49.3600000Z' }
          })
        }
      }

      stubbedPutApi = sinon.stub(ajax, 'put').returns(fakeResolved)
      model.saveAdminDetails({ 'selectedAdministrator': ko.observable('test2@email.com')})
    })

    afterEach(() => {
      global.window.alert.restore()
      ajax.put.restore()
    })

    it('should put service provider contact details to api', () => {
      var endpoint = model.endpointBuilder.serviceProviders(getUrlParameter.parameter('key')).adminDetails().build()
      var payload = {
        'SelectedAdministratorEmail': 'test2@email.com',
      }
      var apiCalledWithExpectedArgs = stubbedPutApi.withArgs(endpoint, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should update lastUpdateDate', () => {
      expect(model.serviceProvider().lastUpdateDate()).toEqual(new Date('2021-09-16T13:45:49.3600000Z').toLocaleString())
    })
  })

    describe('Save', () => {
    var stubbedPutApi

    beforeEach(() => {
      sinon.stub(global.window, 'alert')

      let fakeResolved = {
        then: (success, _) => {
          success({
            'statusCode': 200,
            'data': { 'documentModifiedDate': '2021-09-16T13:45:49.3600000Z' }
          })
        }
      }

      stubbedPutApi = sinon.stub(ajax, 'put').returns(fakeResolved)
      model.saveAdminDetails({ 'selectedAdministrator': ko.observable('test2@email.com')})
    })

    afterEach(() => {
      global.window.alert.restore()
      ajax.put.restore()
    })

    it('should put service provider contact details to api', () => {
      var endpoint = model.endpointBuilder.serviceProviders(getUrlParameter.parameter('key')).adminDetails().build()
      var payload = {
        'SelectedAdministratorEmail': 'test2@email.com',
      }
      var apiCalledWithExpectedArgs = stubbedPutApi.withArgs(endpoint, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should update lastUpdateDate', () => {
      expect(model.serviceProvider().lastUpdateDate()).toEqual(new Date('2021-09-16T13:45:49.3600000Z').toLocaleString())
    })
  })
})

function coffee4Craig () {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'email': 'risha@coffee4craig.com',
    'telephone': '07973955003',
    'website': 'http://www.coffee4craig.com/',
    'facebook': 'https://www.facebook.com/Coffee4Craig/?fref=ts',
    'twitter': '@Coffee4Craig',
    'addresses': [],
    'groupedServices': [],
    'providedServices': [],
    'documentModifiedDate': '2021-09-15T13:45:49.3600000Z',
    'administrators': [{ 'email': "test@email.com", "isSelected": false },
                       { 'email': "test2@email.com", "isSelected": false }]
  }
}
