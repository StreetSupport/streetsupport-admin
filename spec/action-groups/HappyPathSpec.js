/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

let adminUrls = require('../../src/js/admin-urls')
let endpoints = require('../../src/js/api-endpoints')
let ajax = require('../../src/js/ajax')
let browser = require('../../src/js/browser')
let cookies = require('../../src/js/cookies')
let Model = require('../../src/js/models/action-groups/ListActionGroups')

let sinon = require('sinon')

describe('List Action Groups', () => {
  let model = null
  let browserLoadingStub = null
  let browserLoadedStub = null
  let ajaxGetStub = null

  beforeEach(() => {
    sinon.stub(cookies, 'get').returns('stored-session-token')
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    let headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }
    ajaxGetStub = sinon
      .stub(ajax, 'get')
      .withArgs(endpoints.actionGroups, headers)
      .returns({
        then: function (success, error) {
          success({
            'status': 'ok',
            'data': groupData()
          })
        }
      })

    model = new Model()
  })

  afterEach(() => {
    browser.loading.restore()
    browser.loaded.restore()
    ajax.get.restore()
    cookies.get.restore()
  })

  it('- Should notify user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('- Should get action group data from api', () => {
    expect(ajaxGetStub.calledAfter(browserLoadingStub)).toBeTruthy()
  })

  it('- Should notify user it is loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })

  it('- Should map group id', () => {
    expect(model.actionGroups()[1].id).toEqual('57166227e4b09686f6b2c88a')
  })

  it('- Should map group name', () => {
    expect(model.actionGroups()[1].name).toEqual('Women\'s Direct Access')
  })

  it('- Should map group synopsis', () => {
    expect(model.actionGroups()[1].synopsis).toEqual('Re-designing the Women’s Direct Access hotel',
    'description')
  })

  it('- Should map group description', () => {
    expect(model.actionGroups()[1].description).toEqual('womens direct access group description',
    'description')
  })

  it('- Should map group details url', () => {
    expect(model.actionGroups()[1].url).toEqual(adminUrls.actionGroups + '?id=57166227e4b09686f6b2c88a')
  })
})

let groupData = () => {
  return [{
    'actionGroup': {
      'id': '57166213e4b09686f6b2c886',
      'name': 'Substandard Temporary Accommodation',
      'synopsis': 'Improving sub-standard temporary accommodation (B&Bs)',
      'description': ''
    },
    'members': [{
      'firstName': 'Vince',
      'lastName': 'Lee',
      'message': 'eafwfawf aw',
      'organisation': null,
      'email': 'vslee888+ncc@gmail.com'
    }, {
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': 'aewfw',
      'organisation': null,
      'email': 'vslee888+ncc@gmail.com'
    }, {
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': 'aefa',
      'organisation': '0',
      'email': 'info+jetbrains@polyhatsoftware.co.uk'
    }, {
      'firstName': 'test',
      'lastName': 'test',
      'message': 'test',
      'organisation': null,
      'email': 'test@test.com'
    }, {
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': 'wef af a',
      'organisation': null,
      'email': 'vslee888+ncc@gmail.com'
    }, {
      'firstName': 'aw efw ',
      'lastName': ' awef ',
      'message': 'wfe ',
      'organisation': null,
      'email': 'vslee888+spicyhut@gmail.com'
    }, {
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': ' awf w',
      'organisation': null,
      'email': 'vslee888+ncc@gmail.com'
    }]
  }, {
    'actionGroup': {
      'id': '57166227e4b09686f6b2c88a',
      'name': 'Women\'s Direct Access',
      'synopsis': 'Re-designing the Women’s Direct Access hotel',
      'description': 'womens direct access group description'
    },
    'members': [{
      'firstName': 'Vince',
      'lastName': 'Lee',
      'message': 'eafwfawf aw',
      'organisation': 'aefa eae',
      'email': 'vslee888+ncc@gmail.com'
    }, {
      'firstName': 'Vince',
      'lastName': 'Lee',
      'message': 'aefa efa ea',
      'organisation': null,
      'email': 'vslee888+ncc@gmail.com'
    }, {
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': 'fawffwe',
      'organisation': '0',
      'email': 'info+jetbrains@polyhatsoftware.co.uk'
    }]
  }, {
    'actionGroup': {
      'id': '57166248e4b09686f6b2c88c',
      'name': 'Emergency Accommodation',
      'synopsis': 'Increasing winter emergency accommodation for rough sleepers',
      'description': ''
    },
    'members': [{
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': 'ae fw fwe',
      'organisation': null,
      'email': 'vslee888+ncc@gmail.com'
    }]
  }, {
    'actionGroup': {
      'id': '57166268e4b09686f6b2c893',
      'name': 'Alternative Giving',
      'synopsis': 'Promoting alternative ways for the public to give to help reduce begging',
      'description': ''
    },
    'members': [{
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': ' aew we',
      'organisation': null,
      'email': 'vslee888+ncc@gmail.com'
    }, {
      'firstName': 'Viv',
      'lastName': 'Slack',
      'message': 'lll',
      'organisation': '',
      'email': 'vivslack@gmail.com'
    }, {
      'firstName': 'a w',
      'lastName': ' ewwe',
      'message': 'wefawef we',
      'organisation': 'Iawe ',
      'email': 'vslee888+spicyhut@gmail.com'
    }]
  }, {
    'actionGroup': {
      'id': '571661e0e4b09686f6b2c883',
      'name': 'Mental Health',
      'synopsis': 'Improving Mental Health provision for homeless people',
      'description': ''
    },
    'members': [{
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': 'e faew w',
      'organisation': null,
      'email': 'vslee888+ncc@gmail.com'
    }, {
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': 'test',
      'organisation': null,
      'email': 'vslee888+ncc@gmail.com'
    }]
  }, {
    'actionGroup': {
      'id': '57166204e4b09686f6b2c884',
      'name': 'Employment Opportunities',
      'synopsis': 'Increasing employment opportunities for people experiencing homelessness',
      'description': ''
    },
    'members': [{
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': 'ae wf we',
      'organisation': null,
      'email': 'vslee888+ncc@gmail.com'
    }]
  }, {
    'actionGroup': {
      'id': '57166237e4b09686f6b2c88b',
      'name': 'Evening Services',
      'synopsis': 'Creating new indoor evening services for homeless people',
      'description': ''
    },
    'members': []
  }, {
    'actionGroup': {
      'id': '57166257e4b09686f6b2c88f',
      'name': 'Presenting as homeless at the town hall',
      'synopsis': 'Improving the experience for people presenting as homeless at Manchester town hall',
      'description': ''
    },
    'members': [{
      'firstName': 'Vince',
      'lastName': 'Lee',
      'message': 'faf ewf',
      'organisation': null,
      'email': 'vslee888+ncc@gmail.com'
    }, {
      'firstName': 'Carmen',
      'lastName': 'Byrne',
      'message': 'test test',
      'organisation': null,
      'email': 'carmenbyrne@rocketmail.com'
    }, {
      'firstName': 'Carmen',
      'lastName': 'Byrne',
      'message': 'test test',
      'organisation': null,
      'email': 'carmenbyrne@rocketmail.com'
    }, {
      'firstName': 'ytest',
      'lastName': 'e',
      'message': 'ytest',
      'organisation': 'yiry1iry',
      'email': 'iwhjrw@gosdfjg.com'
    }, {
      'firstName': 'Vince',
      'lastName': 'Lee',
      'message': ' ae f',
      'organisation': null,
      'email': 'vslee888+mancomcent@gmail.com'
    }, {
      'firstName': 'Vince',
      'lastName': 'Lee',
      'message': 'awe f',
      'organisation': null,
      'email': 'vslee888+mancomcent@gmail.com'
    }]
  }]
}
