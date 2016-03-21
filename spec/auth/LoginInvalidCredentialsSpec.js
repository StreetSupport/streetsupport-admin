var sinon = require('sinon'),
ajax =      require('../../src/js/ajax'),
endpoints = require('../../src/js/api-endpoints'),
adminurls = require('../../src/js/admin-urls'),
browser =   require('../../src/js/browser'),
cookies =   require('../../src/js/cookies')

describe ('Submit invalid credentials', function () {
  var Login = require('../../src/js/models/Auth/Login')
  var login
  var stubbedApi,
      stubbedBrowser

  beforeEach (function () {
    login = new Login()
    function fakeResolved (value) {
      return {
        then: function (success, error) {
          error({
            status: 'error',
            statusCode: 401,
            messages: ['returned error message']
          })
        }
      }
    }

    stubbedApi = sinon.stub(ajax, 'postJson')
    stubbedApi.returns(fakeResolved ())
    stubbedBrowser = sinon.stub(browser, 'redirect')

    login.username('username')
    login.password('password')

    login.submit ()
  })

  afterEach (function () {
    ajax.postJson.restore()
    browser.redirect.restore()
  })

  it ('should set error messages', function () {
    expect(login.errors()[0]).toEqual('returned error message')
  })

  it ('should clear message', function () {
    expect(login.message()).toEqual('')
  })

  it ('should not redirect browser to dashboard', function () {
    var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.dashboard).called
    expect(browserRedirectedWithExpectedUrl).toBeFalsy()
  })

  it ('should be able to send credentials again', function () {
    login.submit()
    var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoints.sessions + '/create', {
      'username': 'username',
      'password': 'password'
    }).calledTwice

    expect(apiCalledWithExpectedArgs).toBeTruthy()
  })
})
