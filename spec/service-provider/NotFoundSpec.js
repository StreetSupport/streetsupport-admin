/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
let ajax = require('../../src/js/ajax')
let adminurls = require('../../src/js/admin-urls')
let browser = require('../../src/js/browser')
let getUrlParameter = require('../../src/js/get-url-parameter')

describe('Service Provider not found', () => {
  var Model = require('../../src/js/models/service-providers/ServiceProviderDetails')
  let model = null // eslint-disable-line
  let stubbedBrowser = null

  beforeEach(() => {
    let fakeResolved = {
      then: function (success, error) {
        error({
          'status': 404,
          'data': {}
        })
      }
    }

    sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    stubbedBrowser = sinon.stub(browser, 'redirect')
    sinon.stub(browser, 'loading')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    getUrlParameter.parameter.restore()
    browser.redirect.restore()
    browser.loading.restore()
  })

  it('- Should redirect browser to 404', () => {
    var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.notFound).calledOnce
    expect(browserRedirectedWithExpectedUrl).toBeTruthy()
  })
})
