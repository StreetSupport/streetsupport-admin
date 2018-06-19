/* global beforeEach, afterEach, describe, it, expect */

const sinon = require('sinon')
const ajax = require('../../../src/js/ajax')
const auth = require('../../../src/js/auth')
const endpoints = require('../../../src/js/api-endpoints')
const browser = require('../../../src/js/browser')
const nav = require('../../../src/js/nav')
const Model = require('../../../src/js/models/cities/SwepModel')

describe('SWEP Availabilty as City Admin', () => {
  let sut = null

  beforeEach(() => {
    sinon.stub(auth, 'isCityAdmin').returns(true)
    sinon.stub(auth, 'cityAdminFor').returns('manchester')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(nav, 'disableForbiddenLinks')

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
    auth.isCityAdmin.restore()
    auth.cityAdminFor.restore()
    browser.loading.restore()
    browser.loaded.restore()
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
