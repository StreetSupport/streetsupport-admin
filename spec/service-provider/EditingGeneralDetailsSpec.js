var sinon = require('sinon'),
    ajax =      require('../../src/js/ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('../../src/js/cookies'),
    getUrlParameter = require('../../src/js/get-url-parameter')

describe('Edit Service Provider General Details', () => {
  var Model = require('../../src/js/models/ServiceProvider'),
  model,
  stubbedApi,
  stubbedCookies,
  stubbedUrlParams

  beforeEach(() => {
    function fakeResolved (value) {
      return {
        then: function (success, error) {
          success({
            'status': 200,
            'data': coffee4Craig()
          })
        }
      }
    }

    stubbedApi = sinon.stub(ajax, 'get').returns(fakeResolved ())
    stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
    stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()

    model.editGeneralDetails()
  })

  afterEach(() => {
    ajax.get.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
    browser.loaded.restore()
    browser.loading.restore()
  })

  it('should set isEditingGeneralDetails to true', () => {
    expect(model.isEditingGeneralDetails).toBeTruthy()
  })

  describe('Save', () => {
    var stubbedPutApi

    beforeEach(() => {
      function fakeResolved (value) {
        return {
          then: function (success, error) {
            success({
              'status': 200,
              'data': {}
            })
          }
        }
      }

      stubbedPutApi = sinon.stub(ajax, 'put').returns(fakeResolved ())

      model.serviceProvider().description('new description')
      model.serviceProvider().shortDescription('new short description')

      model.saveGeneralDetails()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should put service provider general details to api with session token', () => {
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

    it('should set isEditingGeneralDetails to false', () => {
      expect(model.isEditingGeneralDetails()).toBeFalsy()
    })
  })

  describe('Invalid submission', () => {
    var stubbedPutApi

    beforeEach(() => {
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

    afterEach(() => {
      ajax.put.restore()
    })

    it('should set message as joined error messages', () => {
      expect(model.errors()[1]).toEqual('returned error message 2')
    })

    it('should keep isEditingGeneralDetails as true', () => {
      expect(model.isEditingGeneralDetails()).toBeTruthy()
    })
  })

  describe('Invalid submission then valid submission', () => {
    var stubbedPutApi

    beforeEach(() => {
      function fakeResolved (value) {
        return {
          then: function (success, error) {
            success({
              'status': 200,
              'data': {}
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

    afterEach(() => {
      ajax.put.restore()
    })

    it('should clear errors', () => {
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
