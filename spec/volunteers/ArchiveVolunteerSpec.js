/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
const auth = require('../../src/js/auth')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var Model = require('../../src/js/models/volunteers/ListVolunteersModel')

describe('Archive Volunteer', () => {
  let browserLoadingStub = null
  let browserLoadedStub = null
  let ajaxPatchStub = null
  let model = null

  beforeEach(() => {
    var getVolunteersPromise = {
      then: function (success, error) {
        success({
          'status': 'ok',
          'data': volunteerData
        })
      }
    }

    sinon.stub(ajax, 'get')
      .returns(getVolunteersPromise)

    var patchArchivedResult = {
      then: function (success, error) {
        success({
          'status': 'ok'
        })
      }
    }

    ajaxPatchStub = sinon.stub(ajax, 'patch')
      .withArgs(endpoints.volunteers + '/577ac6b7474f8b1944e973d0/is-archived')
      .returns(patchArchivedResult)

    sinon.stub(auth, 'getLocationsForUser').returns([])
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    sinon.stub(browser, 'pushHistory')
    sinon.stub(browser, 'search')

    model = new Model(volunteerData)

    browserLoadingStub.reset()
    browserLoadedStub.reset()

    model.items()[0].archive()
  })

  afterEach(() => {
    ajax.get.restore()
    ajax.patch.restore()
    auth.getLocationsForUser.restore()
    browser.loading.restore()
    browser.loaded.restore()
    browser.pushHistory.restore()
    browser.search.restore()
  })

  it('- should notify user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('- should patch to the api', () => {
    expect(ajaxPatchStub.calledAfter(browserLoadingStub)).toBeTruthy()
  })

  it('- should remove archived item', () => {
    expect(model.items().length).toEqual(0)
  })

  it('- should notify user it is loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxPatchStub)).toBeTruthy()
  })
})

const volunteerData = {
  total: 12,
  items: [{
    'id': '577ac6b7474f8b1944e973d0',
    'person': {
      'firstName': 'xxxx',
      'lastName': 'xx',
      'telephone': '1239053892',
      'email': 'xxxxx@gmail.com',
      'postcode': 'm20 5wf',
      'city': 'manchester'
    },
    'skillsAndExperience': {
      'categories': ['a', 'b'],
      'description': 'Diy '
    },
    'availability': {
      'description': 'Sundays'
    },
    'resources': {
      'description': 'None'
    },
    'creationDate': '2016-07-04T20:27:35.8910000Z'
  }]
}
