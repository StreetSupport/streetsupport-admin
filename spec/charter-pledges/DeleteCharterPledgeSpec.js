/* global beforeEach, afterEach, describe, it, expect */

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var validation = require('../../src/js/validation')
var Model = require('../../src/js/models/charter-pledges/ListCharterPledgesModel')

describe('Delete Charter Pledge', () => {
  var model
  var browserLoadingStub
  var browserLoadedStub
  var ajaxPutStub

  beforeEach(() => {
    var getCharterPledgesPromise = () => {
      return {
        then: function (success, error) {
          success({
            'status': 'ok',
            'data': pledgeData()
          })
        }
      }
    }

    sinon.stub(ajax, 'get')
      .withArgs(endpoints.charterPledges)
      .returns(getCharterPledgesPromise())

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    sinon.stub(validation, 'showErrors')

    var getPutPromise = () => {
      return {
        then: function (success, error) {
          success({
            'status': 'ok'
          })
        }
      }
    }

    ajaxPutStub = sinon.stub(ajax, 'put')
      .withArgs(endpoints.charterPledges + '/' + pledgeData()[0].id + '/deleted')
      .returns(getPutPromise())
    model = new Model()
    model.toggleShowAll()
    browser.loading.reset()
    browser.loaded.reset()
    model.pledges()[0].deletePledge()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
    ajax.put.restore()
    validation.showErrors.restore()
  })

  it('should show browser is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('should put delete request to api', () => {
    expect(ajaxPutStub.calledOnce).toBeTruthy()
  })

  it('should show browser is loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxPutStub)).toBeTruthy()
  })

  it('should remove deleted pledge from list', () => {
    expect(model.allPledges().length).toEqual(1)
    expect(model.pledges().length).toEqual(1)
    expect(model.pledges()[0].id).toEqual('570b84d73535ff1a8459a143')
  })
})

var pledgeData = () => {
  return [{
    'firstName': 'first name',
    'lastName': 'last name',
    'email': 'test@test.com',
    'organisation': 'organisation',
    'isOptedIn': true,
    'proposedPledge': {
      'description': 'pledge description',
      'isApproved': false
    },
    'id': '570b84af3535ff1a8459a142',
    'documentCreationDate': '2016-04-11T11:04:15.1810000Z'
  }, {
    'firstName': 'first name',
    'lastName': 'last name',
    'email': 'test1@test.com',
    'organisation': 'organisation',
    'isOptedIn': true,
    'proposedPledge': {
      'description': 'pledge description',
      'isApproved': true
    },
    'id': '570b84d73535ff1a8459a143',
    'documentCreationDate': '2016-04-11T11:04:55.8600000Z'
  }]
}
