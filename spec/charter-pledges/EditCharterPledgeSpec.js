/* global beforeEach, afterEach, describe, it, expect */

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var validation = require('../../src/js/validation')
var Model = require('../../src/js/models/charter-pledges/ListCharterPledgesModel')
import data from './pledgeData'

describe('Edit Charter Pledge', () => {
  var model
  var browserLoadingStub
  var browserLoadedStub
  var ajaxPutStub
  var validationShowErrorsStub

  beforeEach(() => {
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

    validationShowErrorsStub = sinon.stub(validation, 'showErrors')

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
      .withArgs(endpoints.charterPledges + '/' + data.items[0].id + '/pledge', { pledge: 'my new pledge' })
      .returns(getPutPromise())

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
    browser.pushHistory.restore()
    browser.search.restore()
    ajax.put.restore()
    validation.showErrors.restore()
  })

  describe('- Set Edit mode', () => {
    beforeEach(() => {
      model.items()[0].editPledge()
    })

    it('should set IsEditable to true', () => {
      expect(model.items()[0].isEditable()).toBeTruthy()
    })

    describe('- Submit new Pledge', () => {
      beforeEach(() => {
        browser.loading.reset()
        browser.loaded.reset()
        model.items()[0].formModel().description('my new pledge')
        model.items()[0].updatePledge()
      })

      it('should show browser is loading', () => {
        expect(browserLoadingStub.calledOnce).toBeTruthy()
      })

      it('should put new approval status to api', () => {
        expect(ajaxPutStub.calledOnce).toBeTruthy()
      })

      it('should set new pledge', () => {
        expect(model.items()[0].description()).toEqual('my new pledge')
      })

      it('should show browser is loaded', () => {
        expect(browserLoadedStub.calledAfter(ajaxPutStub)).toBeTruthy()
      })

      it('should set isEditable to false', () => {
        expect(model.items()[0].isEditable()).toBeFalsy()
      })
    })

    describe('- Submit empty new Pledge', () => {
      beforeEach(() => {
        browser.loading.reset()
        browser.loaded.reset()
        model.items()[0].formModel().description('')
        model.items()[0].updatePledge()
      })

      it('should not put new approval status to api', () => {
        expect(ajaxPutStub.called).toBeFalsy()
      })

      it('should show validation errors', () => {
        expect(validationShowErrorsStub.calledOnce).toBeFalsy()
      })
    })
  })

  describe('- Cancel Edit mode', () => {
    beforeEach(() => {
      model.items()[0].formModel().description('a new pledge description')
      model.items()[0].cancelEdit()
    })

    it('should set IsEditable to true', () => {
      expect(model.items()[0].isEditable()).toBeFalsy()
    })

    it('should set reset new description', () => {
      expect(model.items()[0].formModel().description()).toEqual('pledge description')
    })
  })
})
