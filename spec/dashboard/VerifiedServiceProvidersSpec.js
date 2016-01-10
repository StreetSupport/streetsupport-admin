var sinon = require('sinon'),
ajax =      require('basic-ajax'),
ko   =      require('knockout'),
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
                'key': 'albert-kennedy-trust',
                'name': 'Albert Kennedy Trust',
                'isVerified': true
              },
              {
                'key': 'coffee4craig',
                'name': 'Coffee4Craig',
                'isVerified': false
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

  it('should set verified labels', function() {
    expect(dashboard.serviceProviders()[0].verifiedLabel()).toEqual('verified')
  })

  it('should set un-verified labels', function() {
    expect(dashboard.serviceProviders()[1].verifiedLabel()).toEqual('under review')
  })

  it('should set toggle verification button labels', function() {
    expect(dashboard.serviceProviders()[0].toggleVerificationButtonLabel()).toEqual('un-verify')
    expect(dashboard.serviceProviders()[1].toggleVerificationButtonLabel()).toEqual('verify')
  })

  describe('Toggle Verified status', function() {
    var stubbedPutApi

    beforeEach(function () {
      function fakePostResolved(value) {
        return {
          then: function(success, error) {
            success({
              'status': 200,
              'json': {}
            })
          }
        }
      }

      stubbedPutApi = sinon.stub(ajax, 'put')
      stubbedPutApi.returns(fakePostResolved())

      stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')

      dashboard.toggleVerified(dashboard.serviceProviders()[0])
    })

    afterEach(function () {
      ajax.put.restore()
      cookies.get.restore()
    })

    it('should send service provider key and inverse of current isVerified to api', function() {
      var endpoint = endpoints.serviceProviderVerifications + '/albert-kennedy-trust/update'
      var payload = JSON.stringify({
        'IsVerified': false
      })
      var headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      var apiCalledWithExpectedArgs = stubbedPutApi.withArgs(endpoint, headers, payload).calledOnce

      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should invert isVerified', function() {
      expect(dashboard.serviceProviders()[0].isVerified()).toBeFalsy()
    })

  it('should set verified labels', function() {
    expect(dashboard.serviceProviders()[0].verifiedLabel()).toEqual('under review')
  })

  it('should set toggle verification button labels', function() {
    expect(dashboard.serviceProviders()[0].toggleVerificationButtonLabel()).toEqual('verify')
  })
  })
})
