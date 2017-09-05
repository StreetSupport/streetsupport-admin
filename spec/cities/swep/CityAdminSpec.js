/* global beforeEach, afterEach, describe, it, expect */

const sinon = require('sinon')
const ajax = require('../../../src/js/ajax')
const endpoints = require('../../../src/js/api-endpoints')
const browser = require('../../../src/js/browser')
const cookies = require('../../../src/js/cookies')
const nav = require('../../../src/js/nav')
const Model = require('../../../src/js/models/cities/SwepModel')

describe('SWEP Availabilty as City Admin', () => {
  let sut = null

  beforeEach(() => {
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(nav, 'disableForbiddenLinks')

    const cookieStub = sinon.stub(cookies, 'get')
    cookieStub.withArgs('session-token').returns('stored-session-token')
    cookieStub.withArgs('auth-claims').returns('CityAdmin,CityAdminFor:manchester')

    sinon
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
    cookies.get.restore()
    nav.disableForbiddenLinks.restore()
  })

  it(`- Should only show admin's city`, () => {
    expect(sut.cities().length).toEqual(1)
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
