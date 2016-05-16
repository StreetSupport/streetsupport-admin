/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminUrls = require('../../src/js/admin-urls')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')
var Model = require('../../src/js/models/charter-pledges/ListCharterPledgesModel')

describe('List Charter Pledges - 401', function () {
  var model // eslint-disable-line
  var headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }
  var browserRedirectStub

  beforeEach(function () {
    var getCharterPledgesPromise = function () {
      return {
        then: function (success, error) {
          success({
            'status': 'forbidden',
            'statusCode': 401
          })
        }
      }
    }

    sinon.stub(ajax, 'get')
      .withArgs(endpoints.charterPledges, headers)
      .returns(getCharterPledgesPromise())

    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    sinon.stub(browser, 'loading')
    browserRedirectStub = sinon.stub(browser, 'redirect')

    model = new Model()
  })

  afterEach(function () {
    ajax.get.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.redirect.restore()
  })

  it('- Should redirect to login', function () {
    expect(browserRedirectStub.withArgs(adminUrls.login).calledOnce).toBeTruthy()
  })
})
