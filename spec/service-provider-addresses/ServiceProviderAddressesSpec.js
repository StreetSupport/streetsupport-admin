/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const ajax = require('../../src/js/ajax')
const endpoints = require('../../src/js/api-endpoints')
const cookies = require('../../src/js/cookies')
const getUrlParameter = require('../../src/js/get-url-parameter')

describe('Service Provider Addresses', () => {
  let Model = require('../../src/js/models/ServiceProviderAddresses')
  let model = null
  let stubbedApi = null

  beforeEach(() => {
    const fakeResolved = {
      then: function (success, error) {
        success({
          'status': 200,
          'data': addresses()
        })
      }
    }

    stubbedApi = sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(cookies, 'get').returns('stored-session-token')
    sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
  })

  it('should retrieve service provider from api with session token', () => {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig/addresses'
    var headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }
    var payload = {}
    var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
    expect(apiCalledWithExpectedArgs).toBeTruthy()
  })

  describe('Add new Address', () => {
    beforeEach(() => {
      model.serviceProvider().addAddress()
    })

    it('should add an empty address to the view model', () => {
      expect(model.serviceProvider().addresses().length).toEqual(3)
    })

    it('should set the new address in edit mode', () => {
      expect(model.serviceProvider().addresses()[2].isEditing()).toBeTruthy()
    })
  })

  describe('Add two new Addresses then cancel first', () => {
    beforeEach(() => {
      model.serviceProvider().addAddress()
      model.serviceProvider().addAddress()
      model.serviceProvider().addresses()[2].cancel()
    })

    it('should remove it from the collection', () => {
      expect(model.serviceProvider().addresses().length).toEqual(3)
    })
  })

  describe('Delete Address', () => {
    beforeEach(() => {
      const fakeResolved = {
        then: function (success, error) {
          success({
            'status': 200
          })
        }
      }

      sinon.stub(ajax, 'delete').returns(fakeResolved)

      model.serviceProvider().addresses()[0].deleteAddress()
    })

    afterEach(() => {
      ajax.delete.restore()
    })

    it('should remove the address from the collection', () => {
      expect(model.serviceProvider().addresses().length).toEqual(1)
      expect(model.serviceProvider().addresses()[0].key()).toEqual(2)
    })
  })
})

function addresses () {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'addresses': [{
      'key': 1,
      'street': '5 Oak Street',
      'street1': null,
      'street2': null,
      'street3': null,
      'city': 'Manchester',
      'postcode': 'M4 5JD',
      'openingTimes': [{
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Monday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Tuesday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Wednesday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Thursday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Friday'
      }]
    },
    {
      'key': 2,
      'street': '5 Oak Street',
      'street1': null,
      'street2': null,
      'street3': null,
      'city': 'Manchester',
      'postcode': 'M4 5JD',
      'openingTimes': [{
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Monday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Tuesday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Wednesday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Thursday'
      }, {
        'startTime': '10:00',
        'endTime': '16:30',
        'day': 'Friday'
      }]
    }]
  }
}
