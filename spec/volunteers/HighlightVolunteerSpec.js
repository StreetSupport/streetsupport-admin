/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var Model = require('../../src/js/models/volunteers/ListVolunteersModel')

describe('Highlight Volunteers', () => {
  var model

  beforeEach(() => {
    var getVolunteersPromise = () => {
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
      .withArgs(endpoints.volunteers)
      .returns(getVolunteersPromise())

    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()
    model.volunteers()[1].isHighlighted(true)
    model.volunteers()[3].isHighlighted(true)
    model.filterByHighlighted()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('- Should set volunteer class as highlighted', () => {
    expect(model.volunteers()[1].highlighted()).toEqual('volunteer volunteer--highlighted')
    expect(model.volunteers()[3].highlighted()).toEqual('volunteer volunteer--highlighted')
  })

  describe('- Filter', () => {
    beforeEach(() => {
      model.isFilteredByHighlighted(true)
    })

    it('- Should filter results by those highlighted', () => {
      expect(model.volunteers().length).toEqual(2)
    })

    describe('- Then Un-filter', () => {
      beforeEach(() => {
        model.isFilteredByHighlighted(true)
        model.isFilteredByHighlighted(false)
        model.filterByHighlighted()
      })

      it('- Should show all again', () => {
        expect(model.volunteers().length).toEqual(4)
      })
    })
  })

  describe('- Un-highlight volunteer', () => {
    beforeEach(() => {
      model.volunteers()[1].isHighlighted(false)
    })

    it('- Should reset volunteer class', () => {
      expect(model.volunteers()[1].highlighted()).toEqual('volunteer')
    })
  })
})

var volunteerData = () => {
  return [{
    'id': 'js',
    'person': {
      'firstName': 'Jon',
      'lastName': 'Snow',
      'telephone': 'js_tel',
      'email': 'jon.snow@nightswatch.net',
      'city': 'leeds',
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
      'city': 'leeds',
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
      'city': 'leeds',
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
      'city': 'leeds',
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
