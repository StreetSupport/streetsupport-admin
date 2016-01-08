var sinon = require('sinon'),
ajax =      require('basic-ajax'),
endpoints = require('../../src/js/api-endpoints'),
adminurls = require('../../src/js/admin-urls'),
browser =   require('../../src/js/browser'),
cookies =   require('../../src/js/cookies')

describe('VerifiedServiceProviders', function () {
  var Dashboard = require('../../src/js/models/Dashboard'),
      dashboard,
      stubbedApi

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

    stubbedApi = sinon.stub(ajax, 'getJson')
    stubbedApi.returns(fakeResolved())

    dashboard = new Dashboard()
  })

  afterEach(function () {
    ajax.getJson.restore()
  })

  it('should set published labels', function() {
    expect(dashboard.serviceProviders()[0].publishedLabel).toEqual('published')
  })

  it('should set un-published labels', function() {
    expect(dashboard.serviceProviders()[1].publishedLabel).toEqual('disabled')
  })

  it('should set toggle publish button labels', function() {
    expect(dashboard.serviceProviders()[0].togglePublishButtonLabel).toEqual('disable')
    expect(dashboard.serviceProviders()[1].togglePublishButtonLabel).toEqual('publish')
  })
})
