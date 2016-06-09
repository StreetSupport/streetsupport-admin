/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const endpoints = require('../../src/js/api-endpoints')
const ajax = require('../../src/js/ajax')
const browser = require('../../src/js/browser')
const cookies = require('../../src/js/cookies')
const Model = require('../../src/js/models/mailing-list/ListMembers')

let sinon = require('sinon')

describe('List Members', () => {
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
      .withArgs(endpoints.mailingListMembers, headers)
      .returns({
        then: function (success, error) {
          success({
            'status': 'ok',
            'data': getData()
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
    // expect(model.actionGroups()[1].id).toEqual('57166227e4b09686f6b2c88a')
  })
})

const getData = () => {
  return [{
    'id': '5729f5c4d421fa0cc0dd74a0',
    'firstName': 'Vincent',
    'lastName': 'Lee',
    'email': 'vslee888@gmail.com',
    'memberType': 'CharterSignee'
  }, {
    'id': '572a1a78d421fb12a436b5d5',
    'firstName': 'Trevor',
    'lastName': 'MacFarlane',
    'email': 'trevor@juliewardmep.eu',
    'memberType': 'CharterSignee'
  }, {
    'id': '572a69b3ae21fa0fe41a0eb2',
    'firstName': 'Ellie ',
    'lastName': 'Trimble',
    'email': 'eleanor.trimble@btinternet.com',
    'memberType': 'CharterSignee'
  }]
}
