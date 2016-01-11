var sinon = require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('../../src/js/cookies'),
    getUrlParameter = require('../../src/js/get-url-parameter')


describe ('Service Provider not found', function () {
  var Model = require('../../src/js/models/ServiceProvider'),
  model,
  stubbedApi,
  stubbedCookies,
  stubbedUrlParams

  beforeEach (function () {
    function fakeResolved(value) {
      return {
        then: function (success, error) {
          error({
            'status': 404,
            'json': {}
          })
        }
      }
    }

    stubbedApi = sinon.stub(ajax, 'get').returns(fakeResolved())
    stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
    stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    stubbedBrowser = sinon.stub(browser, 'redirect')

    model = new Model()
  })

  afterEach (function () {
    ajax.get.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
    browser.redirect.restore()
  })

  it ('should redirect browser to 404', function () {
    var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.notFound).calledOnce
    expect(browserRedirectedWithExpectedUrl).toBeTruthy()
  })
})
