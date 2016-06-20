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

  it('- Should map all members', () => {
    expect(model.members().length).toEqual(3)
  })

  it('- Should order members date descending', () => {
    expect(model.members()[0].creationDateTime()).toBeGreaterThan(model.members()[1].creationDateTime())
    expect(model.members()[1].creationDateTime()).toBeGreaterThan(model.members()[2].creationDateTime())
  })

  it('- Should map id', () => {
    expect(model.members()[1].id()).toEqual('572a1a78d421fb12a436b5d5')
  })

  it('- Should map name', () => {
    expect(model.members()[1].name()).toEqual('Trevor BoFimble')
  })

  it('- Should map type', () => {
    expect(model.members()[1].type()).toEqual('Volunteer')
  })

  it('- Should map email', () => {
    expect(model.members()[1].email()).toEqual('trevor@bofimble.eu')
  })

  it('- Should map and format creation date', () => {
    expect(model.members()[1].joinDate()).toEqual('05/04/16')
  })

  it('- Should get unique list of member types', () => {
    expect(model.memberTypes().length).toEqual(2)
  })

  describe('- Filter by Type', () => {
    beforeEach(() => {
      model.selectedMemberTypeFilter('Volunteer')
      model.filterByType()
    })

    it('- Should filter by selected type', () => {
      expect(model.members().length).toEqual(1)
      expect(model.members()[0].id()).toEqual('572a1a78d421fb12a436b5d5')
    })
  })

  describe('- Reset Filter', () => {
    beforeEach(() => {
      model.selectedMemberTypeFilter(undefined)
      model.filterByType()
    })

    it('- Should show all', () => {
      expect(model.members().length).toEqual(3)
    })
  })
})

const getData = () => {
  return [{
    'id': '572a69b3ae21fa0fe41a0eb2',
    'firstName': 'Ellie ',
    'lastName': 'BoBimble',
    'email': 'eleanor@btinternet.com',
    'memberType': 'CharterSignee',
    'creationDateTime': '2016-05-05T12:37:47.2740000Z'
  }, {
    'id': '5729f5c4d421fa0cc0dd74a0',
    'firstName': 'Vincent',
    'lastName': 'Test',
    'email': 'test@gmail.com',
    'memberType': 'CharterSignee',
    'creationDateTime': '2016-03-05T12:37:47.2740000Z'
  }, {
    'id': '572a1a78d421fb12a436b5d5',
    'firstName': 'Trevor',
    'lastName': 'BoFimble',
    'email': 'trevor@bofimble.eu',
    'memberType': 'Volunteer',
    'creationDateTime': '2016-04-05T12:37:47.2740000Z'
  }]
}
