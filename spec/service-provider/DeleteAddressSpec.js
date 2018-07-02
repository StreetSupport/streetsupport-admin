/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const ajax = require('../../src/js/ajax')
const browser = require('../../src/js/browser')
const getUrlParameter = require('../../src/js/get-url-parameter')

describe('Show Service Provider', () => {
  const Model = require('../../src/js/models/service-providers/ServiceProviderDetails')
  let model = null

  beforeEach(() => {
    let fakeResolved = {
      then: function (success, error) {
        success({
          'status': 200,
          'data': coffee4Craig()
        })
      }
    }
    sinon.stub(ajax, 'delete').returns(fakeResolved)
    sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()
    model.serviceProvider().addresses()[0].deleteAddress()
  })

  afterEach(() => {
    ajax.get.restore()
    ajax.delete.restore()
    getUrlParameter.parameter.restore()
    browser.loaded.restore()
    browser.loading.restore()
  })

  it('should retrieve remove address from collection', () => {
    expect(model.serviceProvider().addresses().length).toEqual(1)
  })

  it('should keep expected address', () => {
    expect(model.serviceProvider().addresses()[0].key()).toEqual('5678')
  })
})

function coffee4Craig () {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'isVerified': false,
    'isPublished': true,
    'description': 'Coffee4Craig is a not-for-profit organisation set up to support, work with and be an all accepting approach to homelessness. ',
    'establishedDate': '0001-01-03T00:00:00.0000000Z',
    'areaServiced': 'Manchester & South Wales',
    'email': 'risha@coffee4craig.com',
    'telephone': '07973955003',
    'website': 'http://www.coffee4craig.com/',
    'facebook': 'https://www.facebook.com/Coffee4Craig/?fref=ts',
    'twitter': '@Coffee4Craig',
    'addresses': [{
      'key': '1234',
      'street': '7-11 Lancaster Rd',
      'street1': null,
      'street2': null,
      'street3': null,
      'city': 'Salford',
      'postcode': 'M6 8AQ'
    }, {
      'key': '5678',
      'street': 'Manchester Picadilly',
      'street1': null,
      'street2': null,
      'street3': null,
      'city': null,
      'postcode': 'M1 1AF'
    }],
    'groupedServices': [],
    'providedServices': []
  }
}
