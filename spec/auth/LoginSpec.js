/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

let sinon = require('sinon')
let ajax = require('../../src/js/ajax')
let endpoints = require('../../src/js/api-endpoints')
let adminurls = require('../../src/js/admin-urls')
let browser = require('../../src/js/browser')
let cookies = require('../../src/js/cookies')

describe('Login', () => {
  var Login = require('../../src/js/models/Auth/Login')
  var login

  beforeEach(() => {
    login = new Login()
  })

  it('should set username as empty', () => {
    expect(login.username()).toEqual('')
  })

  it('should set password as empty', () => {
    expect(login.password()).toEqual('')
  })

  describe('Submit', () => {
    var mockCookies
    let stubbedApi = null
    let stubbedBrowser = null

    beforeEach(() => {
      let fakeResolved = {
        then: function (success, error) {
          success({
            'status': 201,
            'data': {
              'sessionToken': 'returnedSessionToken',
              'authClaims': [ 'SuperAdmin', 'claimB' ]
            }
          })
        }
      }

      stubbedApi = sinon.stub(ajax, 'post')
      stubbedApi.returns(fakeResolved)
      stubbedBrowser = sinon.stub(browser, 'redirect')

      mockCookies = sinon.mock(cookies)
      mockCookies.expects('set').once().withArgs('session-token', 'returnedSessionToken')
      mockCookies.expects('set').once().withArgs('auth-claims', [ 'SuperAdmin', 'claimB' ])

      login.username('username')
      login.password('password')

      login.submit()
    })

    afterEach(() => {
      ajax.post.restore()
      browser.redirect.restore()
      mockCookies.restore()
    })

    it('should save session token to cookie', () => {
      mockCookies.verify()
    })

    it('should notify user it is authenticating', () => {
      expect(login.message()).toEqual('Loading, please wait')
    })

    it('should send credentials to api', () => {
      var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoints.sessions + '/create', {}, {
        'username': 'username',
        'password': 'password'
      }).calledOnce

      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should not be able to send credentials after submitting', () => {
      login.submit()
      var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoints.sessions + '/create', {}, {
        'username': 'username',
        'password': 'password'
      }).calledOnce

      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should redirect browser to index', () => {
      var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.redirector).calledOnce
      expect(browserRedirectedWithExpectedUrl).toBeTruthy()
    })
  })
})
