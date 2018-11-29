/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const ajax = require('../../src/js/ajax')
const auth = require('../../src/js/auth')
const browser = require('../../src/js/browser')
const data = require('./serviceProviderData')

describe('Service Providers - listing as multi-location admin', () => {
  const Model = require('../../src/js/models/service-providers/listing')
  const userLocations = ['manchester', 'leeds']
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
    sinon.stub(auth, 'getLocationsForUser').returns(userLocations)
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    sut = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    auth.getLocationsForUser.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('- should set limit available locations to those the admin has access to', () => {
    expect(sut.availableLocations().length).toEqual(2)
  })
})
