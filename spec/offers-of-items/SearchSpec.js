/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var Model = require('../../src/js/models/offers-of-items/ListModel')

describe('Search Offers', () => {
  var model

  beforeEach(() => {
    var getPromise = () => {
      return {
        then: function (success, error) {
          success({
            'status': 'ok',
            'data': getData()
          })
        }
      }
    }

    sinon.stub(ajax, 'get')
      .withArgs(endpoints.offersOfItems)
      .returns(getPromise())

    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  describe('by first name', () => {
    beforeEach(() => {
      model.searchTerm('jon')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.offers().length).toEqual(1)
      expect(model.offers()[0].person.firstName).toEqual('Jon')
    })
  })

  describe('by partial first name', () => {
    beforeEach(() => {
      model.searchTerm('rob')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.offers().length).toEqual(1)
      expect(model.offers()[0].person.firstName).toEqual('Robert')
    })
  })

  describe('with only two characters', () => {
    beforeEach(() => {
      model.searchTerm('ro')
      model.search()
    })

    it('- Should return all', () => {
      expect(model.offers().length).toEqual(getData().length)
    })
  })

  describe('by last name', () => {
    beforeEach(() => {
      model.searchTerm('arathe')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.offers().length).toEqual(1)
      expect(model.offers()[0].person.firstName).toEqual('Robert')
    })
  })

  describe('by email', () => {
    beforeEach(() => {
      model.searchTerm('interfe')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.offers().length).toEqual(1)
      expect(model.offers()[0].person.firstName).toEqual('Sansa')
    })
  })

  describe('by telephone', () => {
    beforeEach(() => {
      model.searchTerm('js_')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.offers().length).toEqual(1)
      expect(model.offers()[0].person.firstName).toEqual('Jon')
    })
  })

  describe('by postcode', () => {
    beforeEach(() => {
      model.searchTerm('eyrie')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.offers().length).toEqual(1)
      expect(model.offers()[0].person.firstName).toEqual('Sansa')
    })
  })

  describe('by description', () => {
    beforeEach(() => {
      model.searchTerm('ice')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.offers().length).toEqual(1)
      expect(model.offers()[0].person.firstName).toEqual('Jon')
    })
  })

  describe('by additional info', () => {
    beforeEach(() => {
      model.searchTerm('ginger')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.offers().length).toEqual(1)
      expect(model.offers()[0].person.firstName).toEqual('Jon')
    })
  })

  describe('multiple search terms', () => {
    beforeEach(() => {
      model.searchTerm('nightswatch, winterfell')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.offers().length).toEqual(2)
      expect(model.offers()[0].person.firstName).toEqual('Sansa')
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
      'postcode': 'castle-black',
      'city': 'Westeros'
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
      'postcode': 'M3 4BD',
      'city': 'Westeros'
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
      'postcode': 'the-eyrie',
      'city': 'Westeros'
    },
    'description': 'description A',
    'additionalInfo': 'additional information A',
    'creationDate': '2016-04-06T17:06:27.1830000Z'
  }]
}
