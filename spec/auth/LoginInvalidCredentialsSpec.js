/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminurls = require('../../src/js/admin-urls')
var browser = require('../../src/js/browser')

describe('Submit invalid credentials', () => {
  var Login = require('../../src/js/models/Auth/Login')
  var login
  var stubbedApi
  var stubbedBrowser

  beforeEach(() => {
    login = new Login()
    let fakeResolved = {
      then: function (success, _) {
        success({
          status: 'error',
          statusCode: 401,
          data: {
            messages: ['returned error message']
          }
        })
      }
    }

    stubbedApi = sinon.stub(ajax, 'post')
    stubbedApi.returns(fakeResolved)
    stubbedBrowser = sinon.stub(browser, 'redirect')

    login.username('username')
    login.password('password')

    login.submit()
  })

  afterEach(() => {
    ajax.post.restore()
    browser.redirect.restore()
  })

  it('should set error messages', () => {
    expect(login.errors()[0]).toEqual('returned error message')
  })

  it('should clear message', () => {
    expect(login.message()).toEqual('')
  })

  it('should not redirect browser to dashboard', () => {
    var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.dashboard).called
    expect(browserRedirectedWithExpectedUrl).toBeFalsy()
  })

  it('should be able to send credentials again', () => {
    login.submit()
    var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoints.sessions + '/create', {}, {
      'username': 'username',
      'password': 'password'
    }).calledTwice

    expect(apiCalledWithExpectedArgs).toBeTruthy()
  })
})
