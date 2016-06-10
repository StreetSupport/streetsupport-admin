/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

let sinon = require('sinon')
let ajax = require('../../src/js/ajax')
let adminurls = require('../../src/js/admin-urls')
let browser = require('../../src/js/browser')
let cookies = require('../../src/js/cookies')
let getUrlParameter = require('../../src/js/get-url-parameter')

describe('Add individual Address', () => {
  let Model = require('../../src/js/models/service-provider-addresses/AddServiceProviderAddress')
  let model = null
  let browserSpy = null

  beforeEach(() => {
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    model = new Model()
  })

  afterEach(() => {
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should set an empty Address', () => {
    expect(model.address().postcode()).toEqual(undefined)
  })

  describe('Save', () => {
    beforeEach(() => {
      let fakeResolved = {
        then: (success, _) => {
          success({
            'status': 200,
            'data': {}
          })
        }
      }
      browserSpy = sinon.stub(browser, 'redirect')
      sinon.stub(cookies, 'get').returns('saved-session-token')
      sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
      sinon.stub(ajax, 'post').returns(fakeResolved)

      model.address().save()
    })

    afterEach(() => {
      ajax.post.restore()
      browser.redirect.restore()
      cookies.get.restore()
      getUrlParameter.parameter.restore()
    })

    it('should redirect to service provider', () => {
      var redirect = adminurls.serviceProviders + '?key=coffee4craig'
      expect(browserSpy.withArgs(redirect).calledOnce).toBeTruthy()
    })
  })
})
