var sinon =     require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies = require('../../src/js/cookies')

describe ('Index', function () {
  var Model = require('../../src/js/models/Index')

  describe ('Not logged in', function () {
    var model
    var stubbedBrowser
    var stubbedApi

    beforeEach (function () {
      sinon.stub(cookies, 'get').returns(null)
      stubbedBrowser = sinon.stub(browser, 'redirect')

      var resolved = function () {
        return {
          then: function (success, error) {
            error({
              'status': 404,
              'json': {}
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'get').returns(resolved)

      model = new Model()
    })

    afterEach (function () {
      cookies.get.restore()
      browser.redirect.restore()
      ajax.get.restore()
    })

    it ('should redirect to login', function () {
      var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.login).calledOnce
      expect(browserRedirectedWithExpectedUrl).toBeTruthy()
    })
  })

  describe ('Super Admin', function () {
    var model
    var stubbedBrowser
    var stubbedApi

    beforeEach (function () {
      sinon.stub(cookies, 'get').returns('stored-session-token')
      stubbedBrowser = sinon.stub(browser, 'redirect')

      function resolved(value) {
        return {
          then: function (success, error) {
            success({
              'status': 200,
              'json': {
                'authClaims': [ 'SuperAdmin' ]
              }
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'get').returns(resolved())
      model = new Model()
    })

    afterEach (function () {
      cookies.get.restore()
      browser.redirect.restore()
      ajax.get.restore()
    })

    it ('should redirect to dashboard', function () {
      var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.dashboard).calledOnce
      expect(browserRedirectedWithExpectedUrl).toBeTruthy()
    })
  })

  describe ('Admin For', function () {
    var model
    var stubbedBrowser
    var stubbedApi

    beforeEach (function () {
      sinon.stub(cookies, 'get').returns('stored-session-token')
      stubbedBrowser = sinon.stub(browser, 'redirect')

      function resolved(value) {
        return {
          then: function (success, error) {
            success({
              'status': 200,
              'json': {
                'authClaims': [ 'AdminFor:coffee4craig' ]
              }
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'get').returns(resolved())
      model = new Model()
    })

    afterEach (function () {
      cookies.get.restore()
      browser.redirect.restore()
      ajax.get.restore()
    })

    it ('should redirect to service provider page', function () {
      var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.serviceProviders + '?key=coffee4craig').calledOnce
      expect(browserRedirectedWithExpectedUrl).toBeTruthy()
    })
  })

  describe('session expired', function () {
    var model
    var stubbedBrowser
    var stubbedApi

    beforeEach (function () {
      sinon.stub(cookies, 'get').returns('stored-session-token')
      stubbedBrowser = sinon.stub(browser, 'redirect')

      function resolved(value) {
        return {
          then: function (success, error) {
            error({
              'status': 404
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'get').returns(resolved())
      model = new Model()
    })

    afterEach (function () {
      ajax.get.restore()
      cookies.get.restore()
      browser.redirect.restore()
    })

    it ('should redirect to login', function () {
      var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.login).calledOnce
      expect(browserRedirectedWithExpectedUrl).toBeTruthy()
    })
  })
})
