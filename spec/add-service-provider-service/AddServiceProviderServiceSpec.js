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

//   describe('Save', function () {
//     var stubbedApi,
//         stubbedCookies,
//         stubbedUrlParams

//     beforeEach(function () {
//       function fakeResolved(value) {
//         return {
//           then: function (success, error) {
//             success({
//               'status': 200,
//               'json': {
//                 'key': 230680
//               }
//             })
//           }
//         }
//       }

//       stubbedApi = sinon.stub(ajax, 'post').returns(fakeResolved ())
//       stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
//       stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

//       model.street1('new street1')
//       model.street2('new street2')
//       model.street3('new street3')
//       model.street4('new street4')
//       model.city('new city')
//       model.postcode('new postcode')
//       model.newOpeningTime()
//       model.openingTimes()[0].startTime('12:00')
//       model.openingTimes()[0].endTime('16:30')
//       model.openingTimes()[0].day('Monday')
//       model.newOpeningTime()
//       model.openingTimes()[1].startTime('12:00')
//       model.openingTimes()[1].endTime('15:30')
//       model.openingTimes()[1].day('Tuesday')

//       model.save()
//     })

//     afterEach(function () {
//       ajax.post.restore()
//       cookies.get.restore()
//       getUrlParameter.parameter.restore()
//     })

//     it('should post address details to api create endpoint with session token', function () {
//       var endpoint = endpoints.getServiceProviders + '/coffee4craig/addresses'
//       var headers = {
//         'content-type': 'application/json',
//         'session-token': 'stored-session-token'
//       }
//       var payload = JSON.stringify({
//         'Street': 'new street1',
//         'Street1': 'new street2',
//         'Street2': 'new street3',
//         'Street3': 'new street4',
//         'City': 'new city',
//         'Postcode': 'new postcode',
//         'OpeningTimes': [
//           {
//             'startTime': '12:00',
//             'endTime': '16:30',
//             'day': 'Monday'
//           }, {
//             'startTime': '12:00',
//             'endTime': '15:30',
//             'day': 'Tuesday'
//           }
//         ]
//       })
//       var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
//       expect(apiCalledWithExpectedArgs).toBeTruthy()
//     })

//     it('should set returned key', function() {
//       expect(model.key()).toEqual(230680)
//     })

//     it('should set isEditing to false', function() {
//       expect(model.isEditing()).toBeFalsy()
//     })

//     describe('Edit again and Cancel', function () {
//       beforeEach (function () {
//         model.edit()
//         model.street1('another new street1')
//         model.cancel()
//       })

//       it('should set isEditing to false', function () {
//         expect(model.isEditing()).toBeFalsy()
//       })

//       it('should set reset fields', function () {
//         expect(model.street1()).toEqual('new street1')
//       })
//     })
//   })
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
