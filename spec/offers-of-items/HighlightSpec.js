/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')
var Model = require('../../src/js/models/offers-of-items/ListModel')

describe('Highlight Offers', () => {
  var model
  var headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }

  beforeEach(() => {
    var getPromise = {
      then: function (success, error) {
        success({
          'status': 'ok',
          'data': getData()
        })
      }
    }

    sinon.stub(ajax, 'get')
      .withArgs(endpoints.offersOfItems, headers)
      .returns(getPromise)

    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()
    model.offers()[1].isHighlighted(true)
    model.offers()[2].isHighlighted(true)
    model.filterByHighlighted()
  })

  afterEach(() => {
    ajax.get.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('- Should set volunteer class as highlighted', () => {
    expect(model.offers()[1].highlighted()).toEqual('volunteer volunteer--highlighted')
    expect(model.offers()[2].highlighted()).toEqual('volunteer volunteer--highlighted')
  })

  describe('- Filter', () => {
    beforeEach(() => {
      model.isFilteredByHighlighted(true)
    })

    it('- Should filter results by those highlighted', () => {
      expect(model.offers().length).toEqual(2)
    })

    describe('- Then Un-filter', () => {
      beforeEach(() => {
        model.isFilteredByHighlighted(true)
        model.isFilteredByHighlighted(false)
        model.filterByHighlighted()
      })

      it('- Should show all again', () => {
        expect(model.offers().length).toEqual(getData().length)
      })
    })
  })

  describe('- Un-highlight offer', () => {
    beforeEach(() => {
      model.offers()[1].isHighlighted(false)
    })

    it('- Should reset volunteer class', () => {
      expect(model.offers()[1].highlighted()).toEqual('volunteer')
    })
  })
})

var getData = () => {
  return [{
    'id': '56f2867701ad122cd0eb5b2f',
    'person': {
      'firstName': 'Jon',
      'lastName': 'Snow',
      'telephone': 'js_telephone',
      'email': 'jon.snow@nightswatch.com',
      'postcode': 'castle-black'
    },
    'description': 'ice, lots of ice',
    'additionalInfo': 'may be traces of ginger',
    'creationDate': '2016-03-23T12:05:11.0420000Z'
  }, {
    'id': '571dd1fcd021fb2890259127',
    'person': {
      'firstName': 'Robert',
      'lastName': 'Baratheon',
      'telephone': 'rb_telephone',
      'email': 'robbo@baratheon.com',
      'postcode': 'M3 4BD'
    },
    'description': 'description A',
    'additionalInfo': 'additional information A',
    'creationDate': '2016-04-25T08:14:52.7170000Z'
  }, {
    'id': '570542130a4f951fb8abe4b9',
    'person': {
      'firstName': 'Sansa',
      'lastName': 'Stark',
      'telephone': 'ss_telephone',
      'email': 'sansa@winterfell.com',
      'postcode': 'the-eyrie'
    },
    'description': 'description A',
    'additionalInfo': 'additional information A',
    'creationDate': '2016-04-06T17:06:27.1830000Z'
  }]
}
