/* global beforeEach, afterEach, describe, it, expect */

const sinon = require('sinon')
const ajax = require('../../../src/js/ajax')
const auth = require('../../../src/js/auth')
const adminUrls = require('../../../src/js/admin-urls')
const endpoints = require('../../../src/js/api-endpoints')
const browser = require('../../../src/js/browser')
const nav = require('../../../src/js/nav')
const Model = require('../../../src/js/models/cities/SwepModel')

describe('SWEP Availabilty', () => {
  let sut = null
  let browserLoadingStub = null
  let browserLoadedStub = null
  let ajaxGetStub = null

  beforeEach(() => {
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    sinon.stub(nav, 'disableForbiddenLinks')

    ajaxGetStub = sinon
      .stub(ajax, 'get')
      .withArgs(endpoints.cities)
      .returns({
        then: function (success, error) {
          success({
            'status': 'ok',
            'data': cities
          })
        }
      })
    sinon.stub(auth, 'isCityAdmin').returns(false)
    sut = new Model()

    sut.init()
  })

  afterEach(() => {
    ajax.get.restore()
    auth.isCityAdmin.restore()
    browser.loading.restore()
    browser.loaded.restore()
    nav.disableForbiddenLinks.restore()
  })

  it('- Should notify user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('- Should load cities', () => {
    expect(ajaxGetStub.calledAfter(browserLoadingStub)).toBeTruthy()
  })

  it('- Should list available cities', () => {
    expect(sut.cities().length).toEqual(2)
  })

  it('- Should notify user it has loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })

  it('- Should set toggle button text', () => {
    expect(sut.cities()[0].buttonText()).toEqual('Set Unavailable')
    expect(sut.cities()[1].buttonText()).toEqual('Set Available')
  })

  it('- Should set claims for city', () => {
    expect(sut.cities()[0].userClaims()).toEqual('superadmin,cityadminfor:manchester')
  })

  describe('- Toggle swep availability', () => {
    let ajaxPatchStub = null

    beforeEach(() => {
      browserLoadingStub.reset()
      browserLoadedStub.reset()
    })

    afterEach(() => {
      ajax.patch.restore()
    })

    describe('- Ok', () => {
      beforeEach(() => {
        ajaxPatchStub = sinon
          .stub(ajax, 'patch')
          .returns({
            then: function (success, error) {
              success({
                'statusCode': 200
              })
            }
          })

        sut.cities()[0].toggleSwepAvailability()
      })

      it('- Should notify user it is loading', () => {
        expect(browserLoadingStub.calledOnce).toBeTruthy()
      })

      it('- Should patch to api', () => {
        const endpoint = `${endpoints.cities}/manchester/swep-status`
        const data = {
          isAvailable: false
        }
        const apiCalledAsExpected = ajaxPatchStub
        .withArgs(endpoint, data)
          .calledAfter(browserLoadingStub)
        expect(apiCalledAsExpected).toBeTruthy()
      })

      it('- Should toggle swepIsAvailable', () => {
        expect(sut.cities()[0].swepIsAvailable()).toBeFalsy()
      })

      it('- Should notify user it has loaded', () => {
        expect(browserLoadedStub.calledAfter(ajaxPatchStub)).toBeTruthy()
      })
    })

    describe('- Server rejects request', () => {
      let browserRedirect = null
      beforeEach(() => {
        ajaxPatchStub = sinon
          .stub(ajax, 'patch')
          .returns({
            then: function (success, error) {
              success({
                'statusCode': 403
              })
            }
          })

        browserRedirect = sinon.stub(browser, 'redirect')

        sut.cities()[0].toggleSwepAvailability()
      })

      afterEach(() => {
        browser.redirect.restore()
      })

      it('- Should notify user it is loading', () => {
        expect(browserLoadingStub.calledOnce).toBeTruthy()
      })

      it('- Should patch to api', () => {
        const endpoint = `${endpoints.cities}/manchester/swep-status`
        const data = {
          isAvailable: false
        }
        const apiCalledAsExpected = ajaxPatchStub
        .withArgs(endpoint, data)
          .calledAfter(browserLoadingStub)
        expect(apiCalledAsExpected).toBeTruthy()
      })

      it('- Should notify user it has loaded', () => {
        expect(browserLoadedStub.calledAfter(ajaxPatchStub)).toBeTruthy()
      })

      it('- Should redirect user to login', () => {
        expect(browserRedirect.withArgs(adminUrls.redirector).calledOnce).toBeTruthy()
      })
    })
  })
})

const cities = [
  {
    'key': 'manchester',
    'name': 'Manchester',
    'latitude': 53.4792777155671,
    'longitude': -2.24455696347558,
    'swepIsAvailable': true
  },
  {
    'key': 'leeds',
    'name': 'Leeds',
    'latitude': 53.7954906003838,
    'longitude': -1.54511238485298,
    'swepIsAvailable': false
  }
]
