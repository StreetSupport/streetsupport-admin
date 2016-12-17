/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')
var getUrlParam = require('../../src/js/get-url-parameter')
var Model = require('../../src/js/models/offers-of-items/ShareOfferModel')

describe('Share Offer', () => {
  var model
  var ajaxPostStub
  var ajaxGetStub
  var browserLoadingStub
  var browserLoadedStub

  beforeEach(() => {
    ajaxPostStub = sinon.stub(ajax, 'post')
      .returns({
        then: function (success, error) {
          success({
            'status': 'created'
          })
        }
      })

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

    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    sinon.stub(getUrlParam, 'parameter').withArgs('id').returns('56d0362c928556085cc569b3')

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(() => {
    ajax.post.restore()
    ajax.get.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
    getUrlParam.parameter.restore()
  })

  it('- should populate orgs', () => {
    expect(model.organisations().length).toEqual(2)
  })

  describe('- submit', () => {
    beforeEach(() => {
      browserLoadingStub.reset()
      browserLoadedStub.reset()

      model.selectedOrgId({
        'id': 'coffee4craig',
        'name': 'Coffee4Craig'
      })
      model.submit()
    })

    it('should notify user it is loading', () => {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })

    it('should post to api', () => {
      var endpoint = endpoints.offersOfItems + '/56d0362c928556085cc569b3/share'
      var headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      var payload = {
        'OrgId': 'coffee4craig'
      }
      var posted = ajaxPostStub.withArgs(endpoint, headers, payload).calledOnce
      expect(posted).toBeTruthy()
    })

    it('should notify user it has loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxPostStub)).toBeTruthy()
    })

    it('should set isFormSubmitSuccessful to true', () => {
      expect(model.isFormSubmitSuccessful()).toBeTruthy()
    })
  })
})

var offer = {
  'id': '584f3ef2c538cc1b70438ea4',
  'person': {
    'firstName': 'Linda', 'lastName': 'Gago', 'telephone': '01204796102',
    'email': 'lindatucker@ntlworld.com', 'postcode': 'BL4 9PY',
    'city': 'manchester' }, 'description': 'Coats jackets hats scarfs gloves socks', 'additionalInfo': 'About 10 of each item above , a small collection from friends and relatives ', 'creationDate': '2016-12-13T00:21:06.8230000Z' }

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
