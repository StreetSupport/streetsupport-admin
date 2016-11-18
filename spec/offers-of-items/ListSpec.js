/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminUrls = require('../../src/js/admin-urls')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')
var Model = require('../../src/js/models/offers-of-items/ListModel')

describe('List Offers', () => {
  var model
  var headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }
  var ajaxGetStub
  var browserLoadingStub
  var browserLoadedStub

  beforeEach(() => {
    var getPromise = {
      then: function (success, error) {
        success({
          'status': 'ok',
          'data': getData()
        })
      }
    }

    ajaxGetStub = sinon.stub(ajax, 'get')
      .withArgs(endpoints.offersOfItems, headers)
      .returns(getPromise)

    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should notify user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('should get volunteers from api', () => {
    expect(ajaxGetStub.calledOnce).toBeTruthy()
  })

  it('should set volunteers', () => {
    expect(model.offers().length).toEqual(3)
  })

  it('should order by creationDate', () => {
    expect(model.offers()[0].id).toEqual('571dd1fcd021fb2890259127')
    expect(model.offers()[1].id).toEqual('570542130a4f951fb8abe4b9')
    expect(model.offers()[2].id).toEqual('56f2867701ad122cd0eb5b2f')
  })

  it('should set url to contact volunteer', () => {
    expect(model.offers()[1].contactUrl).toEqual(adminUrls.contactAboutOffer + '?id=570542130a4f951fb8abe4b9')
  })

  it('should format creationDate', () => {
    expect(model.offers()[1].creationDate).toEqual('06/04/16')
  })

  it('should show user then that is loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })
})

var getData = () => {
  return [{
    'id': '56f2867701ad122cd0eb5b2f',
    'person': {
      'firstName': 'Vince',
      'lastName': 'Lee',
      'telephone': '01234567890',
      'email': 'vince.lee@polyhatsoftware.co.uk',
      'postcode': 'M3 4BD'
    },
    'description': 'description A',
    'additionalInfo': 'additional information A',
    'creationDate': '2016-03-23T12:05:11.0420000Z'
  }, {
    'id': '571dd1fcd021fb2890259127',
    'person': {
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'telephone': '',
      'email': 'vslee888+ncc@gmail.com',
      'postcode': 'M3 4BD'
    },
    'description': 'description A',
    'additionalInfo': 'additional information A',
    'creationDate': '2016-04-25T08:14:52.7170000Z'
  }, {
    'id': '570542130a4f951fb8abe4b9',
    'person': {
      'firstName': 'Vince',
      'lastName': 'Lee',
      'telephone': '',
      'email': 'vslee888+060416@gmail.com',
      'postcode': 'M1 2JB'
    },
    'description': 'description A',
    'additionalInfo': 'additional information A',
    'creationDate': '2016-04-06T17:06:27.1830000Z'
  }]
}
