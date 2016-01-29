var sinon = require('sinon'),
ajax =      require('basic-ajax'),
endpoints = require('../../src/js/api-endpoints'),
adminurls = require('../../src/js/admin-urls'),
browser =   require('../../src/js/browser'),
cookies =   require('../../src/js/cookies')

describe ('VerifiedServiceProviders', function () {
  var Dashboard = require('../../src/js/models/Dashboard'),
      dashboard,
      stubbedApi

  beforeEach (function () {
    function fakeResolved (value) {
      return {
        then: function (success, error) {
          success({
            'status': 200,
            'json': [
              {
                "key": "albert-kennedy-trust",
                "name": "Albert Kennedy Trust",
                "isPublished": true
              },
              {
                "key": "coffee4craig",
                "name": "Coffee4Craig",
                "isPublished": false
              }
            ]
          })
        }
      }
    }

    stubbedApi = sinon.stub(ajax, 'get')
    stubbedApi.returns(fakeResolved ())

    stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')

    dashboard = new Dashboard()
  })

  afterEach (function () {
    ajax.get.restore()
    cookies.get.restore()
  })

  it ('should set published labels', function () {
    expect(dashboard.serviceProviders()[0].publishedLabel()).toEqual('published')
  })

  it ('should set un-published labels', function () {
    expect(dashboard.serviceProviders()[1].publishedLabel()).toEqual('disabled')
  })

  it ('should set toggle publish button labels', function () {
    expect(dashboard.serviceProviders()[0].togglePublishButtonLabel()).toEqual('disable')
    expect(dashboard.serviceProviders()[1].togglePublishButtonLabel()).toEqual('publish')
  })

  describe ('Toggle Published status', function () {
    var stubbedPutApi

    beforeEach (function () {
      function fakePostResolved(value) {
        return {
          then: function (success, error) {
            success({
              'status': 200,
              'json': {}
            })
          }
        }
      }

      stubbedPutApi = sinon.stub(ajax, 'put')
      stubbedPutApi.returns(fakePostResolved())

      dashboard.togglePublished(dashboard.serviceProviders()[0])
    })

    afterEach (function () {
      ajax.put.restore()
    })

    it ('should send inverse of current isPublished to api', function () {
      var endpoint = endpoints.getServiceProviders + '/albert-kennedy-trust/is-published'
      var headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      var payload = JSON.stringify({
        'IsPublished': false
      })
      var apiCalledWithExpectedArgs = stubbedPutApi.withArgs(endpoint, headers, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it ('should invert isPublished', function () {
      expect(dashboard.serviceProviders()[0].isPublished()).toBeFalsy()
    })

    it ('should set published labels', function () {
      expect(dashboard.serviceProviders()[0].publishedLabel()).toEqual('disabled')
    })

    it ('should set toggle publish button labels', function () {
      expect(dashboard.serviceProviders()[0].togglePublishButtonLabel()).toEqual('publish')
    })
  })
})
