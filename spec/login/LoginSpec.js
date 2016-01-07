var sinon =     require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('browser-cookies')

describe('Login', function () {
  var Login = require('../../src/js/models/Login')
  var login

  beforeEach(function () {
    login = new Login()
  })

  it('should set username as empty', function () {
    expect(login.username).toEqual('')
  })

  it('should set password as empty', function () {
    expect(login.password).toEqual('')
  })

  describe('Submit', function() {
    beforeEach(function () {

      stubbedApi = sinon.stub(ajax, 'postJson')
      stubbedApi.returns(fakeResolved())
      stubbedBrowser = sinon.stub(browser, 'redirect')

      mockCookies = sinon.mock(cookies)
      mockCookies.expects('set').once().withArgs('session-token', 'returnedSessionToken')

      login.username = 'username'
      login.password = 'password'

      login.submit()
    })

    afterEach(function () {
      ajax.postJson.restore()
      mockCookies.restore()
    })
  })

  describe('Submit happy path', function() {
    var mockCookies,
        stubbedApi,
        stubbedBrowser

    beforeEach(function () {
      function fakeResolved(value) {
        return {
          then: function(callback) {
            callback({
              'status': 201,
              'response': {
                'sessionToken': 'returnedSessionToken'
              }
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'postJson')
      stubbedApi.returns(fakeResolved())
      stubbedBrowser = sinon.stub(browser, 'redirect')

      mockCookies = sinon.mock(cookies)
      mockCookies.expects('set').once().withArgs('session-token', 'returnedSessionToken')

      login.username = 'username'
      login.password = 'password'

      login.submit()
    })

    afterEach(function () {
      ajax.postJson.restore()
      browser.redirect.restore()
      mockCookies.restore()
    })

    it('should save session token to cookie', function() {
      mockCookies.verify()
    })

    it('should send credentials to api', function() {
      var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoints.createSession, {
        'username': 'username',
        'password': 'password'
      }).calledOnce

      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should redirect browser to dashboard', function() {
      var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.dashboard).calledOnce
      expect(browserRedirectedWithExpectedUrl).toBeTruthy()
    })
  })

  describe('Submit invalid credentials', function() {
    var mockCookies,
        stubbedApi,
        stubbedBrowser

    beforeEach(function () {
      function fakeResolved(value) {
        return {
          then: function(callback) {
            callback({
              'status': 401,
              'responseText': 'returned error message'
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'postJson')
      stubbedApi.returns(fakeResolved())
      stubbedBrowser = sinon.stub(browser, 'redirect')

      mockCookies = sinon.mock(cookies)
      mockCookies.expects('set').once().withArgs('session-token', 'returnedSessionToken')

      login.username = 'username'
      login.password = 'password'

      login.submit()
    })

    afterEach(function () {
      ajax.postJson.restore()
      browser.redirect.restore()
      mockCookies.restore()
    })

    it('should set message to returned message', function() {
      expect(login.message).toEqual('returned error message')
    })

    it('should not redirect browser to dashboard', function() {
      var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.dashboard).called
      expect(browserRedirectedWithExpectedUrl).toBeFalsy()
    })
  })
})
