/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const ajax = require('../../src/js/ajax')
const auth = require('../../src/js/auth')
const browser = require('../../src/js/browser')
const data = require('./serviceProviderData')

describe('Service Providers - listing as single location admin', () => {
  const Model = require('../../src/js/models/service-providers/listing')
  const userLocations = ['manchester']
  let sut

  beforeEach(() => {
    const fakeResolved = {
      then: function (success, error) {
        success({
          'status': 200,
          'data': {
            items: data,
            total: 123
          }
        })
      }
    }

    sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(auth, 'isCityAdmin').returns(true)
    sinon.stub(auth, 'locationsAdminFor').returns(userLocations)
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    sut = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    auth.isCityAdmin.restore()
    auth.locationsAdminFor.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('- should hide locations filter dropdown', () => {
    expect(sut.shouldShowLocationFilter()).toBeFalsy()
  })
})
