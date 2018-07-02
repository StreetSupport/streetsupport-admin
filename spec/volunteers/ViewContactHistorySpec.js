/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var Model = require('../../src/js/models/volunteers/Volunteer')

describe('View Volunteer Contact history', () => {
  let browserLoadingStub = null
  let browserLoadedStub = null
  let ajaxGetStub = null
  let model = null

  beforeEach(() => {
    var getHistoryResult = {
      then: function (success, error) {
        success({
          'status': 'ok',
          'data': historyData
        })
      }
    }

    ajaxGetStub = sinon.stub(ajax, 'get')
      .withArgs(endpoints.volunteers + '/577ac6b7474f8b1944e973d0/contact-requests')
      .returns(getHistoryResult)

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    model = new Model(volunteerData)
    model.getContactHistory()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('- should notify user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('- should populate history', () => {
    expect(model.contactHistory().length).toEqual(1)
  })

  it('- should notify user it is loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })

  it('- should set hasContactHistory', () => {
    expect(model.hasContactHistory()).toBeTruthy()
  })
})

const historyData = {
  'links': {
    'next': null,
    'prev': null,
    'self': '/v1/volunteer-enquiries/5762bc74da4f8a0be43c6b87/contact-requests?index=0'
  },
  'items': [
    {
      'message': 'Hi Hannah. &#10;&#10;I have just come across your information in the volunteer database on Street Support. It is fantastic that you have offered to help with your skills and experience. Have you any involvement with MASH? I am sure they would welcome your support: mash.org.uk. &#10;&#10;Also, might you be interested in joining any of the charter action groups? https://charter.streetsupport.net/join-action-group/.&#10;&#10;Sorry there has been a big delay in getting back to you. We are really pleased that since the charter launch there has been loads of activity, and with a very small core team we are just catching up.&#10;&#10;Thanks again,&#10;Viv&#10;Street Support',
      'sentAsEmail': false,
      'createdBy': 'streetsupport-admin',
      'createdDate': '2016-06-23T17:00:34.8400000Z'
    }
  ],
  'total': 1
}

const volunteerData = {
  'id': '577ac6b7474f8b1944e973d0',
  'person': {
    'firstName': 'paul',
    'lastName': 'proctor',
    'telephone': '01616133416',
    'email': 'proctor.paul66@gmail.com',
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
}
