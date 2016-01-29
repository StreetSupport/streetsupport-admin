var sinon = require('sinon'),
ajax =      require('basic-ajax'),
endpoints = require('../../src/js/api-endpoints'),
adminurls = require('../../src/js/admin-urls'),
browser =   require('../../src/js/browser'),
cookies =   require('../../src/js/cookies')

describe ('Not logged in', function () {
  var Dashboard = require('../../src/js/models/Dashboard'),
      dashboard,
      stubbedApi,
      stubbedCookies,
      stubbedBrowser

  beforeEach (function () {
    function fakeResolved (value) {
      return {
        then: function (success, error) {
          error({
            'status': 401
          })
        }
      }
    }

    stubbedApi = sinon.stub(ajax, 'get')
    stubbedApi.returns(fakeResolved ())

    stubbedBrowser = sinon.stub(browser, 'redirect')

    stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')

    dashboard = new Dashboard()
  })

  afterEach (function () {
    ajax.get.restore()
    browser.redirect.restore()
    cookies.get.restore()
  })

  it ('should redirect to redirector', function () {
      var redirected = stubbedBrowser.withArgs(adminurls.redirector).calledOnce
      expect(redirected).toBeTruthy()
  })
})
