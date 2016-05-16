/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

let adminUrls = require('../../src/js/admin-urls')
let endpoints = require('../../src/js/api-endpoints')
let ajax = require('../../src/js/ajax')
let browser = require('../../src/js/browser')
let Model = require('../../src/js/models/action-groups/ListActionGroups')

let sinon = require('sinon')

describe('List Action Groups', () => {
  let model = null
  let browserLoadingStub = null
  let browserLoadedStub = null
  let ajaxGetStub = null

  beforeEach(() => {
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
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
    ajax.get.restore()
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
    expect(model.actionGroups()[1].id).toEqual('57166268e4b09686f6b2c893')
  })

  it('- Should map group name', () => {
    expect(model.actionGroups()[1].name).toEqual('Big Change Initiative')
  })

  it('- Should map group synopsis', () => {
    expect(model.actionGroups()[1].synopsis).toEqual('Alternative ways for the public to give money and reduce street begging',
    'description')
  })

  it('- Should map group details url', () => {
    expect(model.actionGroups()[1].url).toEqual(adminUrls.actionGroups + '?id=57166268e4b09686f6b2c893')
  })
})

let groupData = () => {
  return [{
    'id': '571661e0e4b09686f6b2c883',
    'name': 'Mental Health',
    'synopsis': 'Improving Mental Health provision for homeless people',
    'description': ''
  }, {
    'id': '57166268e4b09686f6b2c893',
    'name': 'Big Change Initiative',
    'synopsis': 'Alternative ways for the public to give money and reduce street begging',
    'description': ''
  }, {
    'id': '57166204e4b09686f6b2c884',
    'name': 'Employment Opportunities',
    'synopsis': 'Increasing employment opportunities for people experiencing homelessness',
    'description': ''
  }, {
    'id': '57166213e4b09686f6b2c886',
    'name': 'Substandard Temporary Accommodation',
    'synopsis': 'Improving sub-standard temporary accommodation (B&Bs)',
    'description': ''
  }, {
    'id': '57166227e4b09686f6b2c88a',
    'name': 'Women\'s Direct Access',
    'synopsis': 'Re-designing the Women’s Direct Access hostel',
    'description': ''
  }, {
    'id': '57166237e4b09686f6b2c88b',
    'name': 'Evening Services',
    'synopsis': 'Creating new indoor evening services for homeless people',
    'description': ''
  }, {
    'id': '57166248e4b09686f6b2c88c',
    'name': 'Emergency Accommodation',
    'synopsis': 'Increasing winter emergency accommodation for rough sleepers',
    'description': ''
  }, {
    'id': '57166257e4b09686f6b2c88f',
    'name': 'Presenting as homeless at the town hall',
    'synopsis': 'Improving the experience for people presenting as homeless at Manchester town hall',
    'description': ''
  }]
}
