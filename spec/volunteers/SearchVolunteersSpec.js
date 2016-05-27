/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')
var Model = require('../../src/js/models/volunteers/ListVolunteersModel')

describe('Search Volunteers', function () {
  var model
  var headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }

  beforeEach(function () {
    var getVolunteersPromise = function () {
      return {
        then: function (success, error) {
          success({
            'status': 'ok',
            'data': volunteerData()
          })
        }
      }
    }

    sinon.stub(ajax, 'get')
      .withArgs(endpoints.volunteers, headers)
      .returns(getVolunteersPromise())

    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(function () {
    ajax.get.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  describe('by first name', () => {
    beforeEach(() => {
      model.searchTerm('jon')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.volunteers().length).toEqual(1)
      expect(model.volunteers()[0].person.firstName).toEqual('Jon')
    })
  })

  describe('by partial first name', () => {
    beforeEach(() => {
      model.searchTerm('rob')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.volunteers().length).toEqual(2)
      expect(model.volunteers()[0].person.firstName).toEqual('Robb')
    })
  })

  describe('with only two characters', () => {
    beforeEach(() => {
      model.searchTerm('ro')
      model.search()
    })

    it('- Should return all', () => {
      expect(model.volunteers().length).toEqual(volunteerData().length)
    })
  })

  describe('by last name', () => {
    beforeEach(() => {
      model.searchTerm('arathe')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.volunteers().length).toEqual(1)
      expect(model.volunteers()[0].person.firstName).toEqual('Robert')
    })
  })

  describe('by email', () => {
    beforeEach(() => {
      model.searchTerm('interfe')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.volunteers().length).toEqual(2)
      expect(model.volunteers()[0].person.firstName).toEqual('Robb')
    })
  })

  describe('by telephone', () => {
    beforeEach(() => {
      model.searchTerm('js_')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.volunteers().length).toEqual(1)
      expect(model.volunteers()[0].person.firstName).toEqual('Jon')
    })
  })

  describe('by postcode', () => {
    beforeEach(() => {
      model.searchTerm('edkee')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.volunteers().length).toEqual(2)
      expect(model.volunteers()[0].person.firstName).toEqual('Sansa')
    })
  })

  describe('by skills and experience', () => {
    beforeEach(() => {
      model.searchTerm('knowing nothing')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.volunteers().length).toEqual(1)
      expect(model.volunteers()[0].person.firstName).toEqual('Jon')
    })
  })

  describe('by availability', () => {
    beforeEach(() => {
      model.searchTerm('eating')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.volunteers().length).toEqual(1)
      expect(model.volunteers()[0].person.firstName).toEqual('Robert')
    })
  })

  describe('by resources', () => {
    beforeEach(() => {
      model.searchTerm('sword')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.volunteers().length).toEqual(2)
      expect(model.volunteers()[0].person.firstName).toEqual('Jon')
    })
  })

  describe('multiple search terms', () => {
    beforeEach(() => {
      model.searchTerm('nightswatch, winterfell')
      model.search()
    })

    it('- Should return as expected', () => {
      expect(model.volunteers().length).toEqual(3)
      expect(model.volunteers()[0].person.firstName).toEqual('Jon')
    })
  })
})

var volunteerData = function () {
  return [{
    'id': 'js',
    'person': {
      'firstName': 'Jon',
      'lastName': 'Snow',
      'telephone': 'js_tel',
      'email': 'jon.snow@nightswatch.net',
      'postcode': 'the wall'
    },
    'skillsAndExperience': {
      'description': 'knowing nothing'
    },
    'availability': {
      'description': 'when not looking after sam'
    },
    'resources': {
      'description': 'longclaw, sword of mormont'
    },
    'creationDate': '2016-03-23T12:05:11.0420000Z'
  }, {
    'id': 'rs',
    'person': {
      'firstName': 'Robb',
      'lastName': 'Stark',
      'telephone': 'rs_tel',
      'email': 'robb.stark@winterfell.com',
      'postcode': 'great keep'
    },
    'skillsAndExperience': {
      'description': 'war'
    },
    'availability': {
      'description': 'when not avenging his father'
    },
    'resources': {
      'description': 'ice, sword of winterfell'
    },
    'creationDate': '2016-03-23T12:05:11.0420000Z'
  }, {
    'id': 'ss',
    'person': {
      'firstName': 'Sansa',
      'lastName': 'Stark',
      'telephone': 'ss_tel',
      'email': 'sansa.stark@winterfell.com',
      'postcode': 'redkeep'
    },
    'skillsAndExperience': {
      'description': 'having a thoroughly bad time'
    },
    'availability': {
      'description': 'when not being abused'
    },
    'resources': {
      'description': 'hope'
    },
    'creationDate': '2016-03-23T12:05:11.0420000Z'
  }, {
    'id': 'rb',
    'person': {
      'firstName': 'Robert',
      'lastName': 'Baratheon',
      'telephone': 'rb_tel',
      'email': 'robert.baratheon@kingslanding.com',
      'postcode': 'redkeep'
    },
    'skillsAndExperience': {
      'description': 'eating and whoring'
    },
    'availability': {
      'description': 'when not eating and whoring'
    },
    'resources': {
      'description': 'endless wine'
    },
    'creationDate': '2016-03-23T12:05:11.0420000Z'
  }]
}
