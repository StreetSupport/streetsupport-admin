/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var auth = require('../../src/js/auth')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var getUrlParam = require('../../src/js/get-url-parameter')
var Model = require('../../src/js/models/offers-of-items/ShareOfferModel')

describe('Share Offer by City Admin', () => {
  var model
  var ajaxGetStub

  beforeEach(() => {
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(auth, 'getUserClaims').returns(['cityadmin', 'cityadminfor:manchester'])

    ajaxGetStub = sinon.stub(ajax, 'get')

    ajaxGetStub.withArgs(endpoints.offersOfItems + '/56d0362c928556085cc569b3')
      .returns({
        then: function (success, error) {
          success({
            'status': 'ok',
            'data': offer
          })
        }
      })

    ajaxGetStub.withArgs(endpoints.getPublishedServiceProviders + '/manchester')
      .returns({
        then: function (success, error) {
          success({
            'status': 'ok',
            'data': orgs
          })
        }
      })

    sinon.stub(getUrlParam, 'parameter').withArgs('id').returns('56d0362c928556085cc569b3')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    auth.getUserClaims.restore()
    browser.loading.restore()
    browser.loaded.restore()
    getUrlParam.parameter.restore()
  })

  it('- should show broadcast button', () => {
    expect(model.canShowBroadcastOffer()).toBeTruthy()
  })
})

var offer = {
  'id': '584f3ef2c538cc1b70438ea4',
  'person': {
    'firstName': 'Linda',
    'lastName': 'Gago',
    'telephone': '01204796102',
    'email': 'lindatucker@ntlworld.com',
    'postcode': 'BL4 9PY',
    'city': 'manchester'
  },
  'categories': [],
  'description': 'Coats jackets hats scarfs gloves socks',
  'additionalInfo': 'About 10 of each item above , a small collection from friends and relatives ',
  'creationDate': '2016-12-13T00:21:06.8230000Z'
}

var orgs = [
  {
    'key': 'audacious-a-teams',
    'name': 'Audacious A-Teams'
  },
  {
    'key': 'coffee4craig',
    'name': 'Coffee4Craig'
  }
]
