/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
let ajax = require('../../src/js/ajax')
let endpoints = require('../../src/js/api-endpoints')
let adminurls = require('../../src/js/admin-urls')
let getUrlParameter = require('../../src/js/get-url-parameter')

describe('Service Provider Services', () => {
  var Model = require('../../src/js/models/ServiceProviderServices')
  let model = null
  let stubbedApi = null

  beforeEach(() => {
    let fakeResolved = {
      then: (success, error) => {
        success({
          'status': 200,
          'data': coffee4Craig()
        })
      }
    }

    stubbedApi = sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(getUrlParameter, 'parameter').withArgs('providerId').returns('coffee4craig')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    getUrlParameter.parameter.restore()
  })

  it('should set link to add new service to this provider', () => {
    expect(model.addServiceLink).toEqual(adminurls.addServiceProviderService + '?key=coffee4craig')
  })

  it('should retrieve service provider from api with session token', () => {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig'
    var payload = {}
    var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, payload).calledOnce
    expect(apiCalledWithExpectedArgs).toBeTruthy()
  })

  describe('Delete Service', () => {
    beforeEach(() => {
      let fakeResolved = {
        then: function (success, error) {
          success({
            'status': 200
          })
        }
      }
      sinon.stub(ajax, 'delete').returns(fakeResolved)
      model.serviceProvider().services()[0].deleteService()
    })

    afterEach(() => {
      ajax.delete.restore()
    })

    it('should remove the service from the collection', () => {
      expect(model.serviceProvider().services().length).toEqual(1)
      expect(model.serviceProvider().services()[0].id()).toEqual(2)
    })
  })
})

function coffee4Craig () {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'isVerified': false,
    'isPublished': true,
    'description': 'Coffee4Craig is a not-for-profit organisation set up to support, work with and be an all accepting approach to homelessness. ',
    'establishedDate': '0001-01-03T00:00:00.0000000Z',
    'areaServiced': 'Manchester & South Wales',
    'email': 'risha@coffee4craig.com',
    'telephone': '07973955003',
    'website': 'http://www.coffee4craig.com/',
    'facebook': 'https://www.facebook.com/Coffee4Craig/?fref=ts',
    'twitter': '@Coffee4Craig',
    'addresses': [{
      'street': '7-11 Lancaster Rd',
      'street1': null,
      'street2': null,
      'street3': null,
      'city': 'Salford',
      'postcode': 'M6 8AQ'
    }, {
      'street': 'Manchester Picadilly',
      'street1': null,
      'street2': null,
      'street3': null,
      'city': null,
      'postcode': 'M1 1AF'
    }],
    'providedServices': [{
      'key': 1,
      'name': 'Meals',
      'info': 'Breakfast',
      'openingTimes': [{
        'startTime': '09:00',
        'endTime': '10:00',
        'day': 'Monday'
      }, {
        'startTime': '09:00',
        'endTime': '10:00',
        'day': 'Tuesday'
      }, {
        'startTime': '09:00',
        'endTime': '10:00',
        'day': 'Wednesday'
      }, {
        'startTime': '09:00',
        'endTime': '10:00',
        'day': 'Thursday'
      }, {
        'startTime': '09:00',
        'endTime': '10:00',
        'day': 'Friday'
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
      'tags': null
    }, {
      'key': 2,
      'name': 'Meals',
      'info': 'Lunch',
      'openingTimes': [{
        'startTime': '12:00',
        'endTime': '13:00',
        'day': 'Monday'
      }, {
        'startTime': '12:00',
        'endTime': '13:00',
        'day': 'Tuesday'
      }, {
        'startTime': '12:00',
        'endTime': '13:00',
        'day': 'Wednesday'
      }, {
        'startTime': '12:00',
        'endTime': '13:00',
        'day': 'Thursday'
      }, {
        'startTime': '12:00',
        'endTime': '13:00',
        'day': 'Friday'
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
      'tags': null
    }]
  }
}
