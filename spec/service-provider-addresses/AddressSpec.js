var sinon = require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('../../src/js/cookies'),
    getUrlParameter = require('../../src/js/get-url-parameter')

describe('Address Editing', function () {
  var Model = require('../../src/js/models/Address'),
  model

  beforeEach (function () {
    model = new Model(getAddressData())

    model.edit()
  })

  it ('should set isEditing to true', function () {
    expect(model.isEditing).toBeTruthy()
  })

  describe('Cancel', function () {
    beforeEach (function () {
      model.cancel()
    })

    it('should set isEditing to false', function () {
      expect(model.isEditing()).toBeFalsy()
    })
  })

  describe('Save', function () {
    var stubbedApi,
        stubbedCookies,
        stubbedUrlParams

    beforeEach(function () {
      function fakeResolved(value) {
        return {
          then: function (success, error) {
            success({
              'status': 200,
              'json': getAddressData()
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'put').returns(fakeResolved ())
      stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
      stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

      model.street1('new street1')

      model.save()
    })

    afterEach(function () {
      ajax.put.restore()
      cookies.get.restore()
      getUrlParameter.parameter.restore()
    })

    it('should put address details to api with session token', function () {
        var endpoint = endpoints.serviceProviderAddresses + '/coffee4craig/update/1'
        var headers = {
          'content-type': 'application/json',
          'session-token': 'stored-session-token'
        }
        var payload = JSON.stringify({
          'Street': 'new street1'
        })
        var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
        expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should set isEditing to false', function() {
      expect(model.isEditing()).toBeFalsy()
    })
  })

  describe('Save Fail', function () {
    var stubbedApi,
        stubbedCookies,
        stubbedUrlParams

    beforeEach(function () {
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

      stubbedApi = sinon.stub(ajax, 'put').returns(fakeResolved ())
      stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
      stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

      model.street1('new street1')

      model.save()
    })

    afterEach(function () {
      ajax.put.restore()
      cookies.get.restore()
      getUrlParameter.parameter.restore()
    })

    it ('should set message as joined error messages', function () {
      expect(model.message()).toEqual('returned error message 1<br />returned error message 2')
    })

    it ('should keep isEditing as true', function () {
      expect(model.isEditing()).toBeTruthy()
    })
  })
})

function getAddressData() {
  return {
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
  }
}
