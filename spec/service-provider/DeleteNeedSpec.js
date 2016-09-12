/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const ajax = require('../../src/js/ajax')
const browser = require('../../src/js/browser')
const cookies = require('../../src/js/cookies')
const getUrlParameter = require('../../src/js/get-url-parameter')

describe('Show Service Provider', () => {
  const Model = require('../../src/js/models/ServiceProvider')
  let model = null

  beforeEach(() => {
    const fakeResolved = {
      then: (success, _) => {
        success({
          'status': 200,
          'data': coffee4Craig()
        })
      }
    }
    sinon.stub(ajax, 'delete').returns(fakeResolved)
    sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(cookies, 'get').returns('stored-session-token')
    sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()
    model.serviceProvider().needs()[0].deleteNeed()
  })

  afterEach(() => {
    ajax.get.restore()
    ajax.delete.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
    browser.loaded.restore()
    browser.loading.restore()
  })

  it('should remove need from collection', () => {
    expect(model.serviceProvider().needs().length).toEqual(1)
  })

  it('should keep expected need', () => {
    expect(model.serviceProvider().needs()[0].id()).toEqual('b')
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
    'providedServices': [],
    'needs': [{
      'id': 'a',
      'description': 'test',
      'serviceProviderId': 'coffee4craig'
    }, {
      'id': 'b',
      'description': 'test2',
      'serviceProviderId': 'coffee4craig'
    }]
  }
}
