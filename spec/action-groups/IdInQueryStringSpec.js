/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

let endpoints = require('../../src/js/api-endpoints')
let ajax = require('../../src/js/ajax')
let browser = require('../../src/js/browser')
let urlParams = require('../../src/js/get-url-parameter')
let Model = require('../../src/js/models/action-groups/ListActionGroups')

let sinon = require('sinon')

describe('List Action Groups - id is in querystring', () => {
  let model = null
  let browserLoadingStub = null
  let browserPushHistoryStub = null
  let browserLoadedStub = null
  let ajaxGetStub = null

  beforeEach(() => {
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    browserPushHistoryStub = sinon.stub(browser, 'pushHistory')
    sinon.stub(browser, 'setOnHistoryPop')
    sinon.stub(urlParams, 'parameter').returns('57166227e4b09686f6b2c88a')

    ajaxGetStub = sinon
      .stub(ajax, 'get')
      .withArgs(endpoints.actionGroups)
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
    browser.pushHistory.restore()
    browser.setOnHistoryPop.restore()
    ajax.get.restore()
    urlParams.parameter.restore()
  })

  it('- Should notify user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('- Should get action group data from api', () => {
    expect(ajaxGetStub.calledAfter(browserLoadingStub)).toBeTruthy()
  })

  it('- Should hide list', () => {
    expect(model.shouldShowList()).toBeFalsy()
  })

  it('- Should set opened action group', () => {
    expect(model.openedActionGroup().id).toEqual('57166227e4b09686f6b2c88a')
  })

  it('- Should push new history entry', () => {
    let called = browserPushHistoryStub
      .withArgs({}, 'Women\'s Direct Access', '?id=57166227e4b09686f6b2c88a')
      .calledOnce
    expect(called).toBeTruthy()
  })

  it('- Should notify user it is loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })
})

let groupData = () => {
  return [{
    'actionGroup': {
      'id': '57166213e4b09686f6b2c886',
      'name': 'Substandard Accommodation',
      'synopsis': 'Improving sub-standard Accommodation (B&Bs)',
      'description': ''
    },
    'members': [{
      'firstName': 'Vince',
      'lastName': 'Lee',
      'message': 'eafwfawf aw',
      'organisation': null,
      'email': 'testemail+ncc@gmail.com'
    }, {
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': 'aewfw',
      'organisation': null,
      'email': 'testemail+ncc@gmail.com'
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
      'email': 'testemail+ncc@gmail.com'
    }, {
      'firstName': 'aw efw ',
      'lastName': ' awef ',
      'message': 'wfe ',
      'organisation': null,
      'email': 'testemail+spicyhut@gmail.com'
    }, {
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': ' awf w',
      'organisation': null,
      'email': 'testemail+ncc@gmail.com'
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
      'email': 'testemail+ncc@gmail.com'
    }, {
      'firstName': 'Vince',
      'lastName': 'Lee',
      'message': 'message',
      'organisation': 'organisation',
      'email': 'testemail+ncc@gmail.com'
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
      'email': 'testemail+ncc@gmail.com'
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
      'email': 'testemail+ncc@gmail.com'
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
      'email': 'testemail+spicyhut@gmail.com'
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
      'email': 'testemail+ncc@gmail.com'
    }, {
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': 'test',
      'organisation': null,
      'email': 'testemail+ncc@gmail.com'
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
      'email': 'testemail+ncc@gmail.com'
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
      'email': 'testemail+ncc@gmail.com'
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
      'email': 'testemail+mancomcent@gmail.com'
    }, {
      'firstName': 'Vince',
      'lastName': 'Lee',
      'message': 'awe f',
      'organisation': null,
      'email': 'testemail+mancomcent@gmail.com'
    }]
  }]
}
