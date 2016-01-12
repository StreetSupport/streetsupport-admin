var sinon = require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('../../src/js/cookies'),
    getUrlParameter = require('../../src/js/get-url-parameter')


describe ('Edit Service Provider Contact Information', function () {
  var Model = require('../../src/js/models/ServiceProvider'),
  model,
  stubbedApi,
  stubbedCookies,
  stubbedUrlParams

  beforeEach (function () {
    function fakeResolved(value) {
      return {
        then: function (success, error) {
          success({
            'status': 200,
            'json': coffee4Craig()
          })
        }
      }
    }

    stubbedApi = sinon.stub(ajax, 'get').returns(fakeResolved())
    stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
    stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

    model = new Model()

    model.editContactDetails()
  })

  afterEach (function () {
    ajax.get.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
  })

  it ('should set isEditingContactDetails to true', function () {
    expect(model.isEditingContactDetails).toBeTruthy()
  })

  describe ('Save', function () {
    var stubbedPutApi

    beforeEach (function () {
      function fakeResolved(value) {
        return {
          then: function (success, error) {
            success({
              'status': 200,
              'json': {}
            })
          }
        }
      }

      stubbedPutApi = sinon.stub(ajax, 'put').returns(fakeResolved())

      model.serviceProvider().telephone('new telephone')
      model.serviceProvider().email('new email')
      model.serviceProvider().website('new website')
      model.serviceProvider().facebook('new facebook')
      model.serviceProvider().twitter('new twitter')

      model.saveContactDetails()
    })

    afterEach (function () {
      ajax.put.restore()
    })

    it ('should put service provider contact details to api with session token', function () {
        var endpoint = endpoints.serviceProviderContactDetails + '/coffee4craig/update'
        var headers = {
          'content-type': 'application/json',
          'session-token': 'stored-session-token'
        }
        var payload = JSON.stringify({
          'Telephone': 'new telephone',
          'Email': 'new email',
          'Website': 'new website',
          'Facebook': 'new facebook',
          'Twitter': 'new twitter',
        })
        var apiCalledWithExpectedArgs = stubbedPutApi.withArgs(endpoint, headers, payload).calledOnce
        expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it ('should set isEditingContactDetails to false', function () {
      expect(model.isEditingContactDetails()).toBeFalsy()
    })
  })

  describe ('Invalid submission', function () {
    var stubbedPutApi

    beforeEach (function () {
      function fakeResolved(value) {
        return {
          then: function (success, error) {
            error({
              'status': 400,
              'response': JSON.stringify({
                'messages': ['returned error message 1', 'returned error message 2']
              })
            })
          }
        }
      }

      stubbedPutApi = sinon.stub(ajax, 'put').returns(fakeResolved())

      model.serviceProvider().telephone('new telephone')
      model.serviceProvider().email('new email')
      model.serviceProvider().website('new website')
      model.serviceProvider().facebook('new facebook')
      model.serviceProvider().twitter('new twitter')

      model.saveContactDetails()
    })

    afterEach (function () {
      ajax.put.restore()
    })

    it ('should set message as joined error messages', function () {
      expect(model.message()).toEqual('returned error message 1<br />returned error message 2')
    })

    it ('should keep isEditingContactDetails as true', function () {
      expect(model.isEditingContactDetails()).toBeTruthy()
    })
  })
})

function coffee4Craig() {
  return {
    "key": "coffee4craig",
    "name": "Coffee 4 Craig",
    "isVerified": false,
    "isPublished": true,
    "description": "initial description",
    "establishedDate": "0001-01-03T00:00:00.0000000Z",
    "areaServiced": "Manchester & South Wales",
    "email": "risha@coffee4craig.com",
    "telephone": "07973955003",
    "website": "http://www.coffee4craig.com/",
    "facebook": "https://www.facebook.com/Coffee4Craig/?fref=ts",
    "twitter": "@Coffee4Craig",
    "addresses": [
    {
      "street": "7-11 Lancaster Rd",
      "street1": null,
      "street2": null,
      "street3": null,
      "city": "Salford",
      "postcode": "M6 8AQ"
    },
    {
      "street": "Manchester Picadilly",
      "street1": null,
      "street2": null,
      "street3": null,
      "city": null,
      "postcode": "M1 1AF"
    }
    ],
    "providedServices": [
    {
      "name": "Meals",
      "info": "Static Soup kitchen & Walking soup run Piccadilly & Mancester City Centre. Medic and advice on site.",
      "openingTimes": [
      {
        "startTime": "15:00",
        "endTime": "18:00",
        "day": "Sunday",
        "description": null
      },
      {
        "startTime": "19:00",
        "endTime": "21:00",
        "day": "Monday",
        "description": null
      },
      {
        "startTime": "19:00",
        "endTime": "21:00",
        "day": "Tuesday",
        "description": null
      }
      ],
      "address": {
        "street": "Manchester Picadilly",
        "street1": null,
        "street2": null,
        "street3": null,
        "city": null,
        "postcode": "M1 1AF"
      },
      "tags": null
    },
    {
      "name": "Clothes",
      "info": null,
      "openingTimes": [
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Monday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Tuesday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Wednesday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Thursday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Friday",
        "description": null
      }
      ],
      "address": {
        "street": "7-11 Lancaster Rd",
        "street1": null,
        "street2": null,
        "street3": null,
        "city": "Salford",
        "postcode": "M6 8AQ"
      },
      "tags": null
    },
    {
      "name": "Sleeping Bags",
      "info": null,
      "openingTimes": [
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Monday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Tuesday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Wednesday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Thursday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Friday",
        "description": null
      }
      ],
      "address": {
        "street": "7-11 Lancaster Rd",
        "street1": null,
        "street2": null,
        "street3": null,
        "city": "Salford",
        "postcode": "M6 8AQ"
      },
      "tags": null
    },
    {
      "name": "Tents",
      "info": null,
      "openingTimes": [
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Monday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Tuesday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Wednesday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Thursday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Friday",
        "description": null
      }
      ],
      "address": {
        "street": "7-11 Lancaster Rd",
        "street1": null,
        "street2": null,
        "street3": null,
        "city": "Salford",
        "postcode": "M6 8AQ"
      },
      "tags": null
    },
    {
      "name": "Rucksacks",
      "info": null,
      "openingTimes": [
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Monday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Tuesday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Wednesday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Thursday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Friday",
        "description": null
      }
      ],
      "address": {
        "street": "7-11 Lancaster Rd",
        "street1": null,
        "street2": null,
        "street3": null,
        "city": "Salford",
        "postcode": "M6 8AQ"
      },
      "tags": null
    },
    {
      "name": "Socks & pants",
      "info": null,
      "openingTimes": [
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Monday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Tuesday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Wednesday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Thursday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Friday",
        "description": null
      }
      ],
      "address": {
        "street": "7-11 Lancaster Rd",
        "street1": null,
        "street2": null,
        "street3": null,
        "city": "Salford",
        "postcode": "M6 8AQ"
      },
      "tags": null
    },
    {
      "name": "Gloves & Scarves",
      "info": null,
      "openingTimes": [
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Monday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Tuesday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Wednesday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Thursday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Friday",
        "description": null
      }
      ],
      "address": {
        "street": "7-11 Lancaster Rd",
        "street1": null,
        "street2": null,
        "street3": null,
        "city": "Salford",
        "postcode": "M6 8AQ"
      },
      "tags": null
    },
    {
      "name": "Dentist",
      "info": "With the great support of a local dentist we are able to offer this service please contact Fie on 07543 590330 for info and details.",
      "openingTimes": [
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Monday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Tuesday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Wednesday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Thursday",
        "description": null
      },
      {
        "startTime": "10:00",
        "endTime": "15:00",
        "day": "Friday",
        "description": null
      }
      ],
      "address": {
        "street": "7-11 Lancaster Rd",
        "street1": null,
        "street2": null,
        "street3": null,
        "city": "Salford",
        "postcode": "M6 8AQ"
      },
      "tags": null
    }
    ]
  }
}
