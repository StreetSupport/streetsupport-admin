var sinon =           require('sinon')
var ajax =            require('basic-ajax')
var endpoints =       require('../../src/js/api-endpoints')
var endPointBuilder = require('../../src/js/endpoint-builder')
var cookies =         require('../../src/js/cookies')
var getUrlParameter = require('../../src/js/get-url-parameter')
var browser =         require('../../src/js/browser')
var adminUrls =       require('../../src/js/admin-urls')

describe('Edit Service', function () {
  var Model = require('../../src/js/models/service-provider-services/EditServiceProviderService'),
  model,
  stubbedApi,
  stubbedCookies,
  stubbedUrlParams,
  stubbedBrowser

  beforeEach(function() {
    function fakeResolved(value) {
      return {
        then: function(success, error) {
          success({
            'status': 200,
            'json': serviceData()
          })
        }
      }
    }

    stubbedApi = sinon.stub(ajax, 'get').returns(fakeResolved())
    stubbedBrowser = sinon.stub(browser, 'redirect')
    stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
    stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter')
    stubbedUrlParams.withArgs('providerId').returns('coffee4craig')
    stubbedUrlParams.withArgs('serviceId').returns('2')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(function () {
    ajax.get.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
    browser.loading.restore()
    browser.loaded.restore()
    browser.redirect.restore()
  })


  it('should request for service', function () {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig/services/2'
    var headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }
    var payload = {}
    var apiCalled = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
    expect(apiCalled).toBeTruthy()
  })

  it('should set serviceProviderId on Service', function () {
    expect(model.service().serviceProviderId).toEqual('coffee4craig')
  })

  it('should set name on Service', function () {
    expect(model.service().name).toEqual('Meals')
  })

  it('should set location description on Service', function () {
    expect(model.service().locationDescription()).toEqual('location description')
  })

  it('should set address key on Service', function () {
    expect(model.service().address.key()).toEqual('7a6ff0f3-5b04-4bd9-b088-954e473358f5')
  })

  it('should set opening times start time on Service', function () {
    expect(model.service().openingTimes()[0].startTime()).toEqual('12:00')
  })

  describe('Save', function () {
    beforeEach(function () {
      function fakeResolved(value) {
        return {
          then: function(success, error) {
            success({
              'status': 200,
              'json': serviceData()
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'put').returns(fakeResolved())

      model.service().save()
    })

    afterEach(function () {
      ajax.put.restore()
    })

    it('should redirect to service provider', function () {
      expect(stubbedBrowser.withArgs(adminUrls.serviceProviders + '?key=coffee4craig').calledOnce).toBeTruthy()
    })
  })
})

function serviceData() {
  return {
    "key": 2,
    "name": "Meals",
    "info": "Lunch",
    "locationDescription": "location description",
    "openingTimes": [{
      "startTime": "12:00",
      "endTime": "13:00",
      "day": "Monday"
    }, {
      "startTime": "12:00",
      "endTime": "13:00",
      "day": "Tuesday"
    }, {
      "startTime": "12:00",
      "endTime": "13:00",
      "day": "Wednesday"
    }, {
      "startTime": "12:00",
      "endTime": "13:00",
      "day": "Thursday"
    }, {
      "startTime": "12:00",
      "endTime": "13:00",
      "day": "Friday"
    }],
    "address": {
      "key": "7a6ff0f3-5b04-4bd9-b088-954e473358f5",
      "street": "Booth Centre",
      "street1": null,
      "street2": "Edward Holt House",
      "street3": "Pimblett Street",
      "city": "Manchester",
      "postcode": "M3 1FU",
      "openingTimes": null
    },
    "tags": null
  }
}
