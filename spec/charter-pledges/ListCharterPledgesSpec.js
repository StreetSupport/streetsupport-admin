/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const ajax = require('../../src/js/ajax')
const endpoints = require('../../src/js/api-endpoints')
const browser = require('../../src/js/browser')
const Model = require('../../src/js/models/charter-pledges/ListCharterPledgesModel')
import data from './pledgeData'

describe('List Charter Pledges', () => {
  let model,
    ajaxGetStub,
    browserLoadingStub,
    browserLoadedStub

  beforeEach(() => {
    const ajaxGetResolution = {
      then: function (success, error) {
        success({
          'status': 'ok',
          'data': data
        })
      }
    }

    ajaxGetStub = sinon.stub(ajax, 'get')
      .returns(ajaxGetResolution)

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should notify user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('should get pledges from api', () => {
    expect(ajaxGetStub.calledOnce).toBeTruthy()
  })

  it('should retrieve non-approved pledges by default', () => {
    const expected = `${endpoints.charterPledges}?isApproved=false&pageSize=10&index=0`
    expect(ajaxGetStub.getCalls()[0].args[0]).toEqual(expected)
  })

  it('should set url to supporter full name', () => {
    expect(model.items()[0].fullName).toEqual('first name last name')
  })

  it('should set pledge description', () => {
    expect(model.items()[0].description()).toEqual('pledge description')
  })

  it('should set mail to link', () => {
    expect(model.items()[0].mailToLink).toEqual('mailto:test@test.com')
  })

  it('should format creation date', () => {
    expect(model.items()[0].creationDate).toEqual('11/04/16')
  })

  it('should set pledge approval status', () => {
    expect(model.items()[0].isApproved()).toBeFalsy()
  })

  it('should show user then that is loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })

  it('should set btn--primary class for currently disapproved', () => {
    expect(model.items()[0].approvedButtonClass()).toEqual('btn btn--primary')
    expect(model.items()[0].approvedButtonLabel()).toEqual('Approve Pledge')
  })

  it('should set btn--primary class for currently featured', () => {
    expect(model.items()[0].featuredButtonClass()).toEqual('btn btn--indifferent')
    expect(model.items()[0].featuredButtonLabel()).toEqual('Unmark as Featured')
  })

  describe('Toggle Approval', () => {
    var ajaxPutStub
    beforeEach(() => {
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
        .withArgs(endpoints.charterPledges + '/' + model.items()[0].id + '/approval', { isApproved: true })
        .returns(getPutPromise())
      browser.loading.reset()
      browser.loaded.reset()

      model.items()[0].toggleApproval()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should show browser is loading', () => {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })

    it('should put new approval status to api', () => {
      expect(ajaxPutStub.calledOnce).toBeTruthy()
    })

    it('should set new approval status of pledge', () => {
      expect(model.items()[0].isApproved()).toBeTruthy()
    })

    it('should show browser is loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxPutStub)).toBeTruthy()
    })
  })

  describe('Toggle Flagged as Featured', () => {
    var ajaxPutStub
    beforeEach(() => {
      var getPutPromise = {
        then: function (success, error) {
          success({
            'status': 'ok'
          })
        }
      }
      ajaxPutStub = sinon.stub(ajax, 'put')
        .withArgs(endpoints.charterPledges + '/' + model.items()[0].id + '/featured', { isFeatured: false })
        .returns(getPutPromise)
      browser.loading.reset()
      browser.loaded.reset()

      model.items()[0].toggleFeatured()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should show browser is loading', () => {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })

    it('should put new featured status to api', () => {
      expect(ajaxPutStub.calledOnce).toBeTruthy()
    })

    it('should set new featured status of pledge', () => {
      expect(model.items()[0].isFeatured()).toBeFalsy()
    })

    it('should show browser is loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxPutStub)).toBeTruthy()
    })
  })
})
