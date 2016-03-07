var sinon = require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('../../src/js/cookies'),
    getUrlParameter = require('../../src/js/get-url-parameter')

describe ('Edit Service Provider General Details', function () {
  var Model = require('../../src/js/models/ServiceProvider'),
  model,
  stubbedApi,
  stubbedCookies,
  stubbedUrlParams

  beforeEach (function () {
    function fakeResolved (value) {
      return {
        then: function (success, error) {
          success({
            'status': 200,
            'json': coffee4Craig()
          })
        }
      }
    }

    stubbedApi = sinon.stub(ajax, 'get').returns(fakeResolved ())
    stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
    stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    sinon.stub(browser, 'dataLoaded')

    model = new Model()

    model.editGeneralDetails()
  })

  afterEach (function () {
    ajax.get.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
    browser.dataLoaded.restore()
  })

  it ('should set isEditingGeneralDetails to true', function () {
    expect(model.isEditingGeneralDetails).toBeTruthy()
  })

  describe ('Save', function () {
    var stubbedPutApi

    beforeEach (function () {
      function fakeResolved (value) {
        return {
          then: function (success, error) {
            success({
              'status': 200,
              'json': {}
            })
          }
        }
      }

      stubbedPutApi = sinon.stub(ajax, 'put').returns(fakeResolved ())

      model.serviceProvider().description('new description')
      model.serviceProvider().shortDescription('new short description')

      model.saveGeneralDetails()
    })

    afterEach (function () {
      ajax.put.restore()
    })

    it ('should put service provider general details to api with session token', function () {
        var endpoint = endpoints.getServiceProviders + '/coffee4craig/general-information'
        var headers = {
          'content-type': 'application/json',
          'session-token': 'stored-session-token'
        }
        var payload = JSON.stringify({
          'Description': 'new description',
          'ShortDescription': 'new short description'
        })
        var apiCalledWithExpectedArgs = stubbedPutApi.withArgs(endpoint, headers, payload).calledOnce
        expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it ('should set isEditingGeneralDetails to false', function () {
      expect(model.isEditingGeneralDetails()).toBeFalsy()
    })
  })

  describe ('Invalid submission', function () {
    var stubbedPutApi

    beforeEach (function () {
      function fakeResolved (value) {
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

      stubbedPutApi = sinon.stub(ajax, 'put').returns(fakeResolved ())

      model.serviceProvider().description('new description')

      model.saveGeneralDetails()
    })

    afterEach (function () {
      ajax.put.restore()
    })

    it ('should set message as joined error messages', function () {
      expect(model.errors()[1]).toEqual('returned error message 2')
    })

    it ('should keep isEditingGeneralDetails as true', function () {
      expect(model.isEditingGeneralDetails()).toBeTruthy()
    })
  })

  describe ('Invalid submission then valid submission', function () {
    var stubbedPutApi

    beforeEach (function () {
      function fakeResolved (value) {
        return {
          then: function (success, error) {
            success({
              'status': 200,
              'json': {}
            })
          }
        }
      }

      stubbedPutApi = sinon.stub(ajax, 'put').returns(fakeResolved ())

      model.errors(['error a', 'error b'])
      model.serviceProvider().description('new description')
      model.serviceProvider().shortDescription('new short description')

      model.saveGeneralDetails()
    })

    afterEach (function () {
      ajax.put.restore()
    })

    it ('should clear errors', function () {
        expect(model.hasErrors()).toBeFalsy()
    })
  })
})

function coffee4Craig() {
  return {
    "key": "coffee4craig",
    "name": "Coffee 4 Craig",
    "description": "initial description",
    "addresses": [],
    "providedServices": []
  }
}
