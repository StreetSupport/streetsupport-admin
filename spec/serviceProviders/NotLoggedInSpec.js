/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('basic-ajax')
var adminurls = require('../../src/js/admin-urls')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')

describe('Not logged in', function () {
  var Dashboard = require('../../src/js/models/ServiceProviders')
  var stubbedApi
  var stubbedBrowser

  beforeEach(function () {
    let fakeResolved = {
      then: function (success, error) {
        error({
          'status': 401
        })
      }
    }

    stubbedApi = sinon.stub(ajax, 'get')
    stubbedApi.returns(fakeResolved)
    stubbedBrowser = sinon.stub(browser, 'redirect')
    sinon.stub(browser, 'loading')
    sinon.stub(cookies, 'get').returns('stored-session-token')

    let dashboard = new Dashboard()
  })

  afterEach(function () {
    ajax.get.restore()
    browser.loading.restore()
    cookies.get.restore()
  })

  it('should redirect to redirector', function () {
    var redirected = stubbedBrowser.withArgs(adminurls.redirector).calledOnce
    expect(redirected).toBeTruthy()
  })
})
