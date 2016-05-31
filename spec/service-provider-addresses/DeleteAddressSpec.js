/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var cookies = require('../../src/js/cookies')
var getUrlParameter = require('../../src/js/get-url-parameter')
var guid = require('node-uuid')

describe('Delete Address', () => {
  var Model = require('../../src/js/models/Address')
  let model = new Model(getAddressData())
  let stubbedApi = null

  beforeEach(() => {
    let fakeResolved = {
      then: function (success, error) {
        success({
          'status': 200
        })
      }
    }

    stubbedApi = sinon.stub(ajax, 'delete').returns(fakeResolved)
    sinon.stub(cookies, 'get').returns('stored-session-token')
    sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

    model.deleteAddress()
  })

  afterEach(() => {
    ajax.delete.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
  })

  it('should delete address key to api create endpoint with session token', () => {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig/addresses/' + model.key()
    var headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }
    var payload = JSON.stringify({})
    var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
    expect(apiCalledWithExpectedArgs).toBeTruthy()
  })
})

function getAddressData () {
  return {
    'key': guid.v4(),
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
    }]
  }
}
