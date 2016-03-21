var sinon =     require('sinon'),
    ajax =      require('../../src/js/ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies = require('../../src/js/cookies')

describe ('Login', function () {
  var Login = require('../../src/js/models/Auth/Login')
  var login

  beforeEach (function () {
    login = new Login()
  })

  it ('should set username as empty', function () {
    expect(login.username()).toEqual('')
  })

  it ('should set password as empty', function () {
    expect(login.password()).toEqual('')
  })

  describe ('Submit', function () {
    var mockCookies,
    stubbedApi,
    stubbedBrowser

    beforeEach (function () {
      function fakeResolved (value) {
        return {
          then: function (success, error) {
            success({
              'status': 201,
              'json': {
                'sessionToken': 'returnedSessionToken',
                'authClaims': [ 'SuperAdmin', 'claimB' ]
              }
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'postJson')
      stubbedApi.returns(fakeResolved ())
      stubbedBrowser = sinon.stub(browser, 'redirect')

      mockCookies = sinon.mock(cookies)
      mockCookies.expects('set').once().withArgs('session-token', 'returnedSessionToken')
      mockCookies.expects('set').once().withArgs('auth-claims', [ 'SuperAdmin', 'claimB' ])

      login.username('username')
      login.password('password')

      login.submit ()
    })

    afterEach (function () {
      ajax.postJson.restore()
      browser.redirect.restore()
      mockCookies.restore()
    })

    it ('should save session token to cookie', function () {
      mockCookies.verify()
    })

    it ('should notify user it is authenticating', function () {
      expect(login.message()).toEqual('Loading, please wait')
    })

    it ('should send credentials to api', function () {
      var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoints.sessions + '/create', {
        'username': 'username',
        'password': 'password'
      }).calledOnce

      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it ('should not be able to send credentials after submitting', function () {
      login.submit ()
      var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoints.sessions + '/create', {
        'username': 'username',
        'password': 'password'
      }).calledOnce

      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it ('should redirect browser to index', function () {
      var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.redirector).calledOnce
      expect(browserRedirectedWithExpectedUrl).toBeTruthy()
    })
  })
})
