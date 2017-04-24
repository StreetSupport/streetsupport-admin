/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var cookies = require('../../src/js/cookies')
var nav = require('../../src/js/nav')

describe('Logout', () => {
  var Model = require('../../src/js/models/Auth/Logout')
  var stubbedApi
  var stubbedUnsetCookies
  let stubbedNavLinkDisabled = null

  beforeEach(() => {
    let fakeResolved = {
      then: function (success, error) {
        success({
          'status': 200,
          'data': {}
        })
      }
    }

    stubbedNavLinkDisabled = sinon.stub(nav, 'disableForbiddenLinks')
    stubbedApi = sinon.stub(ajax, 'delete')
    stubbedApi.returns(fakeResolved)

    sinon.stub(cookies, 'get').returns('stored-session-token')
    stubbedUnsetCookies = sinon.stub(cookies, 'unset')

    new Model() // eslint-disable-line
  })

  afterEach(() => {
    nav.disableForbiddenLinks.restore()
    ajax.delete.restore()
    cookies.get.restore()
    cookies.unset.restore()
  })

  it('should send session token to api', () => {
    var endpoint = endpoints.sessions + '/stored-session-token'
    var headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }

    var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint,
      headers).calledOnce

    expect(apiCalledWithExpectedArgs).toBeTruthy()
  })

  it('should unset session token', () => {
    var cookieSetCalled = stubbedUnsetCookies.withArgs('session-token').calledOnce
    expect(cookieSetCalled).toBeTruthy()
  })

  it('should unset auth claims', () => {
    var cookieSetCalled = stubbedUnsetCookies.withArgs('auth-claims').calledOnce
    expect(cookieSetCalled).toBeTruthy()
  })
  it('should disable nav link', () => {
    expect(stubbedNavLinkDisabled.calledOnce).toBeTruthy()
  })
})
