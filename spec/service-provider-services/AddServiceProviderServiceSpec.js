/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('basic-ajax')
var endpoints = require('../../src/js/api-endpoints')
var cookies = require('../../src/js/cookies')
var getUrlParameter = require('../../src/js/get-url-parameter')
var browser = require('../../src/js/browser')
var adminUrls = require('../../src/js/admin-urls')

describe('Save new Service', function () {
  var Model = require('../../src/js/models/service-provider-services/AddServiceProviderService')
  var model
  var stubbedApi

  beforeEach(function () {
    function categoriesPromise (value) {
      return {
        then: function (success, error) {
          success({
            'status': 200,
            'json': categories()
          })
        }
      }
    }

    function providerPromise (value) {
      return {
        then: function (success, error) {
          success({
            'status': 200,
            'json': addresses()
          })
        }
      }
    }

    stubbedApi = sinon.stub(ajax, 'get')

    var headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }

    stubbedApi.withArgs(endpoints.getServiceCategories,
      headers,
      {}).returns(categoriesPromise())

    stubbedApi.withArgs(endpoints.getServiceProviders + '/coffee4craig',
      headers,
      {}).returns(providerPromise())

    sinon.stub(cookies, 'get').returns('stored-session-token')
    sinon.stub(getUrlParameter, 'parameter').withArgs('providerId').returns('coffee4craig')

    sinon.stub(browser, 'dataLoaded')

    model = new Model()
  })

  afterEach(function () {
    ajax.get.restore()
    browser.dataLoaded.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
  })

  it('should request categories', function () {
    var endpoint = endpoints.getServiceCategories
    var headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }
    var payload = {}
    var apiCalled = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
    expect(apiCalled).toBeTruthy()
  })

  it('should request for provider', function () {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig'
    var headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }
    var payload = {}
    var apiCalled = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
    expect(apiCalled).toBeTruthy()
  })

  it('should populate categories', function () {
    expect(model.categories().length).toEqual(2)
  })

  it('should populate addresses', function () {
    expect(model.addresses().length).toEqual(2)
  })

  it('address street should start empty', function () {
    expect(model.address().street1()).toEqual(undefined)
  })

  it('address street should start empty', function () {
    expect(model.address().street1()).toEqual(undefined)
  })

  describe('select category', function () {
    beforeEach(function () {
      model.category(model.categories()[0])
      model.setAvailableSubCategories()
    })

    it('should set subCategories', function () {
      expect(model.subCategories().length).toEqual(7)
    })

    it('should map subCategory key', function () {
      expect(model.subCategories()[0].key).toEqual('emergency')
    })

    it('should map subCategory name', function () {
      expect(model.subCategories()[0].name).toEqual('Emergency')
    })

    it('should set subCategory isSelected to false', function () {
      expect(model.subCategories()[0].isSelected()).toBeFalsy()
    })
  })

  describe('select existing address', function () {
    beforeEach(function () {
      model.preselectedAddress(model.addresses()[0])
      model.prefillAddress()
    })

    it('should set address street 1', function () {
      expect(model.address().street1()).toEqual('5 Oak Street')
    })

    it('should set address street 2', function () {
      expect(model.address().street2()).toEqual('street 2')
    })

    it('should set address street 3', function () {
      expect(model.address().street3()).toEqual('street 3')
    })

    it('should set address street 4', function () {
      expect(model.address().street4()).toEqual('street 4')
    })

    it('should set address city', function () {
      expect(model.address().city()).toEqual('Manchester')
    })

    it('should set address postcode', function () {
      expect(model.address().postcode()).toEqual('M4 5JD')
    })

    it('should set opening time start time', function () {
      expect(model.address().openingTimes()[0].startTime()).toEqual('10:00')
    })

    it('should set opening time end time', function () {
      expect(model.address().openingTimes()[0].endTime()).toEqual('16:30')
    })

    it('should set opening time day', function () {
      expect(model.address().openingTimes()[0].day()).toEqual('Monday')
    })
  })

  describe('save', function () {
    var stubbedPostApi
    var browserSpy

    beforeEach(function () {
      let savePromise = {
        then: function (success, error) {
          success({
            'status': 200,
            'json': 'wang'
          })
        }
      }
      stubbedPostApi = sinon.stub(ajax, 'post').returns(savePromise)
      browserSpy = sinon.stub(browser, 'redirect')

      model.category(model.categories()[0])
      model.setAvailableSubCategories()
      model.subCategories()[1].isSelected(true)
      model.subCategories()[3].isSelected(true)

      model.info('new info')
      model.locationDescription('new location description')
      model.targetAudience('tag a, tag b')
      model.preselectedAddress(model.addresses()[0])
      model.prefillAddress()

      model.save()
    })

    afterEach(function () {
      ajax.post.restore()
      browser.redirect.restore()
    })

    it('should post service details with new to api with session token', function () {
      var endpoint = endpoints.getServiceProviders + '/coffee4craig/services'
      var headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      var payload = JSON.stringify({
        'Info': 'new info',
        'LocationDescription': 'new location description',
        'Tags': ['tag a', 'tag b'],
        'Category': 'accom',
        'SubCategories': ['hostel', 'rented'],
        'OpeningTimes': [{
          'StartTime': '10:00',
          'EndTime': '16:30',
          'Day': 'Monday'
        }, {
          'StartTime': '10:00',
          'EndTime': '16:30',
          'Day': 'Tuesday'
        }],
        'Street1': '5 Oak Street',
        'Street2': 'street 2',
        'Street3': 'street 3',
        'Street4': 'street 4',
        'City': 'Manchester',
        'Postcode': 'M4 5JD'
      })

      var apiCalledWithExpectedArgs = stubbedPostApi.withArgs(endpoint, headers, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should redirect to services list', function () {
      var redirect = adminUrls.serviceProviders + '?key=coffee4craig'
      expect(browserSpy.withArgs(redirect).calledOnce).toBeTruthy()
    })
  })
})

function categories () {
  return [{
    'key': 'accom',
    'sortOrder': 90,
    'name': 'Accommodation',
    'synopsis': 'Permanent and temporary accomodation.',
    'subCategories': [{
      'key': 'emergency',
      'name': 'Emergency',
      'synopsis': 'Emergency accomodation'
    }, {
      'key': 'hostel',
      'name': 'Hostel',
      'synopsis': 'Hostel accomodation'
    }, {
      'key': 'hosted',
      'name': 'Hosted',
      'synopsis': 'Hosted accomodation'
    }, {
      'key': 'rented',
      'name': 'Rented',
      'synopsis': 'Rented accomodation in the private sector'
    }, {
      'key': 'supported',
      'name': 'Supported',
      'synopsis': 'Supported lodgings'
    }, {
      'key': 'social',
      'name': 'Social Housing',
      'synopsis': 'Social Housing'
    }, {
      'key': 'shelter',
      'name': 'Night shelter',
      'synopsis': 'Night shelter'
    }],
    'documentCreationDate': '2015-12-16T16:12:49.8370000Z',
    'documentModifiedDate': '2015-12-16T16:12:49.8370000Z'
  }, {
    'key': 'communications',
    'sortOrder': 0,
    'name': 'Communications',
    'synopsis': 'Internet and telephone access, and postal services.',
    'subCategories': [{
      'key': 'telephone',
      'name': 'Telephone',
      'synopsis': 'Free telephone use'
    }, {
      'key': 'internet',
      'name': 'Internet access',
      'synopsis': 'Internet access'
    }],
    'documentCreationDate': '2015-12-16T16:12:49.8370000Z',
    'documentModifiedDate': '2015-12-16T16:12:49.8370000Z'
  }]
}

function addresses() {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'addresses': [{
      'key': 1,
      'street': '5 Oak Street',
      'street1': 'street 2',
      'street2': 'street 3',
      'street3': 'street 4',
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
    }, {
      'key': 2,
      'street': 'Another address',
      'street1': null,
      'street2': null,
      'street3': null,
      'city': 'Manchester',
      'postcode': 'M1 2FY',
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
      }]
    }]
  }
}
