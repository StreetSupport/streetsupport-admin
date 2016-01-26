var sinon = require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('../../src/js/cookies')


describe ('Create Service Provider', function () {
  var Model = require('../../src/js/models/CreateServiceProvider'),
  model

  beforeEach (function () {

    model = new Model()
  })

  it('should start with Name empty', function () {
    expect(model.name()).toEqual('')
  })

  describe('Save', function () {
    var stubbedApi,
        stubbedCookies,
        stubbedBrowser
    beforeEach(function () {
      function fakeResolved (value) {
        return {
          then: function (success, error) {
            success({
              'status': 201,
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'post').returns(fakeResolved ())
      stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
      stubbedBrowser = sinon.stub(browser, 'redirect')

      model.name('New Service Provider')
      model.save()
    })

    afterEach (function () {
      ajax.post.restore()
      cookies.get.restore()
      browser.redirect.restore()
    })

    it('should post service provider name to api', function () {
        var endpoint = endpoints.getServiceProviders
        var headers = {
          'content-type': 'application/json',
          'session-token': 'stored-session-token'
        }
        var payload = JSON.stringify({
          'Name': 'New Service Provider'
        })
        var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
        expect(apiCalledWithExpectedArgs).toBeTruthy()
    })
    it('should redirect to dashboard', function () {
      expect(stubbedBrowser.withArgs(adminurls.dashboard).calledOnce).toBeTruthy()
    })
  })
})
