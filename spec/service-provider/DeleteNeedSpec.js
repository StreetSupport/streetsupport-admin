/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const ajax = require('../../src/js/ajax')
const browser = require('../../src/js/browser')
const endpoints = require('../../src/js/api-endpoints')
const getUrlParameter = require('../../src/js/get-url-parameter')

describe('Delete Need', () => {
  const Model = require('../../src/js/models/service-providers/ServiceProviderDetails')
  let model = null

  beforeEach(() => {
    const fakeResolved = (data) => {
      return {
        then: (success, _) => {
          success({
            'status': 200,
            'data': data
          })
        }
      }
    }
    sinon.stub(ajax, 'delete').returns(fakeResolved(coffee4Craig))
    const ajaxGetStub = sinon.stub(ajax, 'get')
    ajaxGetStub
      .withArgs(`${endpoints.getServiceProviders}/coffee4craig`)
      .returns(fakeResolved(coffee4Craig))
    ajaxGetStub
      .withArgs(`${endpoints.serviceProviderNeeds}/a/offers-to-help`)
      .returns(fakeResolved(needResponses))
    ajaxGetStub
      .withArgs(`${endpoints.serviceProviderNeeds}/b/offers-to-help`)
      .returns(fakeResolved(needResponses))
    sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()
    model.serviceProvider().needs()[0].deleteNeed()
  })

  afterEach(() => {
    ajax.get.restore()
    ajax.delete.restore()
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

const coffee4Craig = {
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

const needResponses = {
  helpOffers: 3
}
