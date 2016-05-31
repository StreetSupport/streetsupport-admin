/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('basic-ajax')
var endpoints = require('../../src/js/api-endpoints')
var cookies = require('../../src/js/cookies')
var getUrlParameter = require('../../src/js/get-url-parameter')

describe('Delete Service', () => {
  var Model = require('../../src/js/models/Service')
  let model = new Model(getData())
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

    model.deleteService()
  })

  afterEach(() => {
    ajax.delete.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
  })

  it('should delete service id to api create endpoint with session token', () => {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig/services/' + model.id()
    var headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }
    var payload = JSON.stringify({})
    var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
    expect(apiCalledWithExpectedArgs).toBeTruthy()
  })
})

function getData () {
  return {
    'key': '569d2b468705432268b65c75',
    'name': 'Meals',
    'info': 'Breakfast',
    'openingTimes': [{
      'startTime': '10:00',
      'endTime': '16:30',
      'day': 'Monday'
    }, {
      'startTime': '10:00',
      'endTime': '16:30',
      'day': 'Tuesday'
    }],
    'address': {
      'key': '7a6ff0f3-5b04-4bd9-b088-954e473358f5',
      'street': 'Booth Centre',
      'street1': null,
      'street2': 'Edward Holt House',
      'street3': 'Pimblett Street',
      'city': 'Manchester',
      'postcode': 'M3 1FU',
      'openingTimes': null
    },
  'tags': ['some tags']
  }
}
