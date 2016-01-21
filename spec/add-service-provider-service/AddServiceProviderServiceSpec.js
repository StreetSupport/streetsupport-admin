var sinon =           require('sinon')
var ajax =            require('basic-ajax')
var endpoints =       require('../../src/js/api-endpoints')
var endPointBuilder = require('../../src/js/endpoint-builder')
var cookies =         require('../../src/js/cookies')
var getUrlParameter = require('../../src/js/get-url-parameter')

describe('Save new Service', function () {
  var Model = require('../../src/js/models/AddServiceProviderService'),
  model,
  stubbedApi,
  stubbedCookies,
  stubbedUrlParams

  beforeEach (function () {
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

    stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
    stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

    model = new Model()
  })

  afterEach(function () {
    ajax.get.restore()
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
})

function categories() {
  return [{
    "key": "accom",
    "sortOrder": 90,
    "name": "Accommodation",
    "synopsis": "Permanent and temporary accomodation.",
    "subCategories": [{
      "key": "emergency",
      "name": "Emergency",
      "synopsis": "Emergency accomodation"
    }, {
      "key": "hostel",
      "name": "Hostel",
      "synopsis": "Hostel accomodation"
    }, {
      "key": "hosted",
      "name": "Hosted",
      "synopsis": "Hosted accomodation"
    }, {
      "key": "rented",
      "name": "Rented",
      "synopsis": "Rented accomodation in the private sector"
    }, {
      "key": "supported",
      "name": "Supported",
      "synopsis": "Supported lodgings"
    }, {
      "key": "social",
      "name": "Social Housing",
      "synopsis": "Social Housing"
    }, {
      "key": "shelter",
      "name": "Night shelter",
      "synopsis": "Night shelter"
    }],
    "documentCreationDate": "2015-12-16T16:12:49.8370000Z",
    "documentModifiedDate": "2015-12-16T16:12:49.8370000Z"
  }, {
    "key": "communications",
    "sortOrder": 0,
    "name": "Communications",
    "synopsis": "Internet and telephone access, and postal services.",
    "subCategories": [{
      "key": "telephone",
      "name": "Telephone",
      "synopsis": "Free telephone use"
    }, {
      "key": "internet",
      "name": "Internet access",
      "synopsis": "Internet access"
    }],
    "documentCreationDate": "2015-12-16T16:12:49.8370000Z",
    "documentModifiedDate": "2015-12-16T16:12:49.8370000Z"
  }]
}

function addresses() {
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
