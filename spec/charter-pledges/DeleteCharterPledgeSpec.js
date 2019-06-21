/* global beforeAll, afterAll, describe, it, expect */

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var validation = require('../../src/js/validation')
var Model = require('../../src/js/models/charter-pledges/ListCharterPledgesModel')

import data from './pledgeData'

describe('Delete Charter Pledge', () => {
  var model
  var browserLoadingStub
  var browserLoadedStub
  var ajaxPutStub

  beforeAll(() => {
    var getCharterPledgesPromise = () => {
      return {
        then: function (success, error) {
          success({
            'status': 'ok',
            data
          })
        }
      }
    }

    sinon.stub(ajax, 'get')
      .returns(getCharterPledgesPromise())

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    sinon.stub(browser, 'pushHistory')
    sinon.stub(browser, 'search')

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
      .withArgs(endpoints.charterPledges + '/' + data.items[0].id + '/deleted')
      .returns(getPutPromise())
    model = new Model()
    browser.loading.reset()
    browser.loaded.reset()
    model.items()[0].deletePledge()
  })

  afterAll(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
    browser.pushHistory.restore()
    browser.search.restore()
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
    expect(model.items().length).toEqual(2)
    expect(model.items()[0].id).toEqual('570b84d73535ff1a8459a143')
  })
})
