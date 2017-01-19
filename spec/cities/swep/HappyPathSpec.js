/* global beforeEach, afterEach, describe, it, expect */

const sinon = require('sinon')
const ajax = require('../../../src/js/ajax')
const endpoints = require('../../../src/js/api-endpoints')
const browser = require('../../../src/js/browser')
const cookies = require('../../../src/js/cookies')
const Model = require('../../../src/js/models/cities/SwepModel')

describe('SWEP Availabilty', () => {
  let sut = null
  let browserLoadingStub = null
  let browserLoadedStub = null
  let ajaxGetStub = null

  beforeEach(() => {
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

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

    sut = new Model()

    sut.init()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
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

  describe('- Toggle swep availability', () => {
    let ajaxPatchStub = null

    beforeEach(() => {
      browserLoadingStub.reset()
      browserLoadedStub.reset()

      ajaxPatchStub = sinon
        .stub(ajax, 'patch')
        .returns({
          then: function (success, error) {
            success({
              'status': 'ok'
            })
          }
        })

      sinon.stub(cookies, 'get').returns('stored-session-token')

      sut.cities()[0].toggleSwepAvailability()
    })

    afterEach(() => {
      ajax.patch.restore()
      cookies.get.restore()
    })

    it('- Should notify user it is loading', () => {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })

    it('- Should patch to api', () => {
      const endpoint = `${endpoints.cities}/manchester/swep-status`
      const headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      const data = {
        isAvailable: false
      }
      const apiCalledAsExpected = ajaxPatchStub
      .withArgs(endpoint, headers, data)
        .calledAfter(browserLoadingStub)
      expect(apiCalledAsExpected).toBeTruthy()
    })

    it('- Should notify user it has loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxPatchStub)).toBeTruthy()
    })
  })
})

const cities = [
  {
    'id': 'manchester',
    'name': 'Manchester',
    'latitude': 53.4792777155671,
    'longitude': -2.24455696347558,
    'swepIsAvailable': true
  },
  {
    'id': 'leeds',
    'name': 'Leeds',
    'latitude': 53.7954906003838,
    'longitude': -1.54511238485298,
    'swepIsAvailable': false
  }
]
