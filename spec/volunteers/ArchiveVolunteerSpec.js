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

    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    model = new Model(volunteerData)

    browserLoadingStub.reset()
    browserLoadedStub.reset()

    model.volunteers()[0].archive()
  })

  afterEach(() => {
    ajax.get.restore()
    ajax.patch.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('- should notify user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('- should patch to the api', () => {
    expect(ajaxPatchStub.calledAfter(browserLoadingStub)).toBeTruthy()
  })

  it('- should remove archived item', () => {
    expect(model.allVolunteers().length).toEqual(0)
    expect(model.volunteers().length).toEqual(0)
  })

  it('- should notify user it is loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxPatchStub)).toBeTruthy()
  })
})

const volunteerData = [{
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
