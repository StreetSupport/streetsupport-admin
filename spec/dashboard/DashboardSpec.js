var sinon = require('sinon'),
ajax =      require('basic-ajax'),
endpoints = require('../../src/js/api-endpoints'),
adminurls = require('../../src/js/admin-urls'),
browser =   require('../../src/js/browser'),
cookies =   require('../../src/js/cookies')

describe('Dashboard', function () {
  var Dashboard = require('../../src/js/models/Dashboard'),
      dashboard,
      stubbedApi,
      stubbedCookies

  beforeEach(function () {
    function fakeResolved(value) {
      return {
        then: function(success, error) {
          success({
            'status': 200,
            'json': [
              {
                "key": "albert-kennedy-trust",
                "name": "Albert Kennedy Trust",
                "isVerified": false,
              },
              {
                "key": "coffee4craig",
                "name": "Coffee4Craig",
                "isVerified": false
              },
              {
                "key": "booth-centre",
                "name": "Booth Centre",
                "isVerified": false
              }
            ]
          })
        }
      }
    }

    stubbedApi = sinon.stub(ajax, 'get')
    stubbedApi.returns(fakeResolved())

    stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')

    dashboard = new Dashboard()
  })

  afterEach(function () {
    ajax.get.restore()
    cookies.get.restore()
  })

  it('should retrieve service providers from api with session token', function() {
      var endpoint = endpoints.getServiceProviders
      var headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      var payload = JSON.stringify({
        'IsPublished': false
      })
      var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
  })

  it('should populate service provider collection', function() {
    expect(dashboard.serviceProviders().length).toEqual(3)
  })

  it('should sort service provider by name', function() {
    expect(dashboard.serviceProviders()[0].key).toEqual('albert-kennedy-trust')
    expect(dashboard.serviceProviders()[1].key).toEqual('booth-centre')
    expect(dashboard.serviceProviders()[2].key).toEqual('coffee4craig')
  })

  it('should set service provider url', function() {
    expect(dashboard.serviceProviders()[0].url).toEqual('service-providers.html?key=albert-kennedy-trust')
  })
})
