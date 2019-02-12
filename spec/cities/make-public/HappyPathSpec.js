/* global beforeEach, afterEach, describe, it, expect */

const sinon = require('sinon')

const ajax = require('../../../src/js/ajax')
const auth = require('../../../src/js/auth')
const endpoints = require('../../../src/js/api-endpoints')
const browser = require('../../../src/js/browser')
const nav = require('../../../src/js/nav')
const Model = require('../../../src/js/models/cities/ListingModel')

describe('city', () => {
  let sut = null
  let browserLoadingStub = null
  let browserLoadedStub = null
  let ajaxGetStub = null
  let ajaxPatchStub = null

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

  describe('- make public', () => {
    beforeEach(() => {
      ajaxPatchStub = sinon
        .stub(ajax, 'patch')
        .withArgs(`${endpoints.cities}/${sut.cities()[0].key}/is-public`)
        .returns({
          then: function (success, error) {
            success({
              'statusCode': 200,
              'status': 'ok'
            })
          }
        })

      sut.cities()[0].makePublic()
    })

    afterEach(() => {
      ajax.patch.restore()
    })

    it('- Should notify user it is loading', () => {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })

    it('- Should patch the city', () => {
      expect(ajaxPatchStub.calledAfter(browserLoadingStub)).toBeTruthy()
    })

    it('- Should set city as public', () => {
      expect(sut.cities()[0].isPublic()).toBeTruthy()
    })

    it('- Should notify user it has loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
    })
  })
})

const cities = [
  {
    'key': 'manchester',
    'name': 'Manchester',
    'latitude': 53.4792777155671,
    'longitude': -2.24455696347558,
    'swepIsAvailable': true,
    'isPublic': false
  },
  {
    'key': 'leeds',
    'name': 'Leeds',
    'latitude': 53.7954906003838,
    'longitude': -1.54511238485298,
    'swepIsAvailable': false,
    'isPublic': true
  }
]
