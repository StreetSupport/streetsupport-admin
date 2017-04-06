/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

let endpoints = require('../../src/js/api-endpoints')
let ajax = require('../../src/js/ajax')
let browser = require('../../src/js/browser')
let cookies = require('../../src/js/cookies')
let urlParams = require('../../src/js/get-url-parameter')
let Model = require('../../src/js/models/action-groups/ListActionGroups')

let sinon = require('sinon')

describe('List Action Groups', () => {
  let model = null
  let browserLoadingStub = null
  let browserSetOnHistoryPopStub = null
  let browserLoadedStub = null
  let ajaxGetStub = null

  beforeEach(() => {
    sinon.stub(cookies, 'get').returns('stored-session-token')
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    browserSetOnHistoryPopStub = sinon.stub(browser, 'setOnHistoryPop')
    sinon.stub(urlParams, 'parameter').returns('')

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
    browser.setOnHistoryPop.restore()
    ajax.get.restore()
    cookies.get.restore()
    urlParams.parameter.restore()
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

  it('- Should set on history pop function', () => {
    expect(browserSetOnHistoryPopStub.withArgs(model.closeActionGroup).calledOnce).toBeTruthy()
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
    expect(model.actionGroups()[1].url).toEqual('?id=57166227e4b09686f6b2c88a')
  })

  it('- Should map sort members by creation date', () => {
    expect(model.actionGroups()[1].members[0].firstName).toEqual('third')
    expect(model.actionGroups()[1].members[1].firstName).toEqual('second')
    expect(model.actionGroups()[1].members[2].firstName).toEqual('first')
  })

  it('- Should map member first name', () => {
    expect(model.actionGroups()[1].members[1].firstName).toEqual('second')
  })

  it('- Should map member last name', () => {
    expect(model.actionGroups()[1].members[1].lastName).toEqual('Lee')
  })

  it('- Should map member message', () => {
    expect(model.actionGroups()[1].members[1].message).toEqual('message')
  })

  it('- Should map member organisation', () => {
    expect(model.actionGroups()[1].members[1].organisation).toEqual('organisation')
  })

  it('- Should map member email', () => {
    expect(model.actionGroups()[1].members[1].email).toEqual('testemail+ncc@gmail.com')
  })

  it('- Should format member creationDate', () => {
    expect(model.actionGroups()[1].members[1].creationDate).toEqual('20/04/16')
  })

  describe('- Expand Action Group', () => {
    let browserPushHistoryStub = null

    beforeEach(() => {
      browserPushHistoryStub = sinon.stub(browser, 'pushHistory')

      model.actionGroups()[1].openGroup()
    })

    afterEach(() => {
      browser.pushHistory.restore()
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
  })

  describe('- Close Action Group', () => {
    beforeEach(() => {
      model.closeActionGroup()
    })

    it('- Should show list', () => {
      expect(model.shouldShowList()).toBeTruthy()
    })

    it('- Should set open action group to null', () => {
      expect(model.openedActionGroup()).toEqual(null)
    })
  })

  describe('- Back to list', () => {
    let browserPopHistoryStub = null

    beforeEach(() => {
      browserPopHistoryStub = sinon.stub(browser, 'popHistory')
      model.backToList()
    })

    afterEach(() => {
      browser.popHistory.restore()
    })

    it('- Should show list', () => {
      expect(model.shouldShowList()).toBeTruthy()
    })

    it('- Should set open action group to null', () => {
      expect(model.openedActionGroup()).toEqual(null)
    })

    it('- Should rewind history', () => {
      expect(browserPopHistoryStub.calledOnce).toBeTruthy()
    })
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
      'email': 'testemail+ncc@gmail.com',
      'creationDate': '2016-04-20T14:13:51.3190000Z'
    }, {
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': 'aewfw',
      'organisation': null,
      'email': 'testemail+ncc@gmail.com',
      'creationDate': '2016-04-20T15:39:18.7940000Z'
    }, {
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': 'aefa',
      'organisation': '0',
      'email': 'info+jetbrains@polyhatsoftware.co.uk',
      'creationDate': '2016-04-22T11:45:07.4820000Z'
    }, {
      'firstName': 'test',
      'lastName': 'test',
      'message': 'test',
      'organisation': null,
      'email': 'test@test.com',
      'creationDate': '2016-04-22T13:38:53.4120000Z'
    }, {
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': 'wef af a',
      'organisation': null,
      'email': 'testemail+ncc@gmail.com',
      'creationDate': '2016-04-23T14:36:07.4070000Z'
    }, {
      'firstName': 'aw efw ',
      'lastName': ' awef ',
      'message': 'wfe ',
      'organisation': null,
      'email': 'testemail+spicyhut@gmail.com',
      'creationDate': '2016-04-23T15:04:29.6290000Z'
    }, {
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': ' awf w',
      'organisation': null,
      'email': 'testemail+ncc@gmail.com',
      'creationDate': '2016-04-24T14:09:18.0800000Z'
    }]
  }, {
    'actionGroup': {
      'id': '57166227e4b09686f6b2c88a',
      'name': 'Women\'s Direct Access',
      'synopsis': 'Re-designing the Women’s Direct Access hotel',
      'description': 'womens direct access group description'
    },
    'members': [{
      'firstName': 'first',
      'lastName': 'Lee',
      'message': 'eafwfawf aw',
      'organisation': 'aefa eae',
      'email': 'testemail+ncc@gmail.com',
      'creationDate': '2016-04-20T14:18:56.2780000Z'
    }, {
      'firstName': 'third',
      'lastName': 'Lee',
      'message': 'fawffwe',
      'organisation': '0',
      'email': 'info+jetbrains@polyhatsoftware.co.uk',
      'creationDate': '2016-04-22T12:18:12.4250000Z'
    }, {
      'firstName': 'second',
      'lastName': 'Lee',
      'message': 'message',
      'organisation': 'organisation',
      'email': 'testemail+ncc@gmail.com',
      'creationDate': '2016-04-20T14:23:22.6280000Z'
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
      'email': 'testemail+ncc@gmail.com',
      'creationDate': '2016-04-23T12:36:46.4770000Z'
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
      'email': 'testemail+ncc@gmail.com',
      'creationDate': '2016-04-20T15:44:07.0160000Z'
    }, {
      'firstName': 'Viv',
      'lastName': 'Slack',
      'message': 'lll',
      'organisation': '',
      'email': 'vivslack@gmail.com',
      'creationDate': '2016-04-22T16:36:33.9130000Z'
    }, {
      'firstName': 'a w',
      'lastName': ' ewwe',
      'message': 'wefawef we',
      'organisation': 'Iawe ',
      'email': 'testemail+spicyhut@gmail.com',
      'creationDate': '2016-04-23T15:09:46.6450000Z'
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
      'email': 'testemail+ncc@gmail.com',
      'creationDate': '2016-04-24T16:30:33.1750000Z'
    }, {
      'firstName': 'Vincent',
      'lastName': 'Lee',
      'message': 'test',
      'organisation': null,
      'email': 'testemail+ncc@gmail.com',
      'creationDate': '2016-04-24T17:28:54.6240000Z'
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
      'email': 'testemail+ncc@gmail.com',
      'creationDate': '2016-04-23T15:13:17.8490000Z'
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
      'email': 'testemail+ncc@gmail.com',
      'creationDate': '2016-04-20T15:42:38.6110000Z'
    }, {
      'firstName': 'Carmen',
      'lastName': 'Byrne',
      'message': 'test test',
      'organisation': null,
      'email': 'carmenbyrne@rocketmail.com',
      'creationDate': '2016-04-22T13:11:26.1430000Z'
    }, {
      'firstName': 'Carmen',
      'lastName': 'Byrne',
      'message': 'test test',
      'organisation': null,
      'email': 'carmenbyrne@rocketmail.com',
      'creationDate': '2016-04-22T13:11:26.1430000Z'
    }, {
      'firstName': 'ytest',
      'lastName': 'e',
      'message': 'ytest',
      'organisation': 'yiry1iry',
      'email': 'iwhjrw@gosdfjg.com',
      'creationDate': '2016-04-22T13:53:19.3940000Z'
    }, {
      'firstName': 'Vince',
      'lastName': 'Lee',
      'message': ' ae f',
      'organisation': null,
      'email': 'testemail+mancomcent@gmail.com',
      'creationDate': '2016-04-24T14:12:25.6810000Z'
    }, {
      'firstName': 'Vince',
      'lastName': 'Lee',
      'message': 'awe f',
      'organisation': null,
      'email': 'testemail+mancomcent@gmail.com',
      'creationDate': '2016-04-24T14:13:15.5280000Z'
    }]
  }]
}
