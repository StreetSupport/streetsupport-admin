/* global beforeEach, afterEach, describe, it, expect */

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')
var validation = require('../../src/js/validation')
var Model = require('../../src/js/models/charter-pledges/ListCharterPledgesModel')

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
            'data': pledgeData()
          })
        }
      }
    }

    sinon.stub(ajax, 'get')
      .withArgs(endpoints.charterPledges)
      .returns(getCharterPledgesPromise())

    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
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
      .withArgs(endpoints.charterPledges + '/' + pledgeData()[0].id + '/pledge', { pledge: 'my new pledge' })
      .returns(getPutPromise())

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
    ajax.put.restore()
    validation.showErrors.restore()
  })

  describe('- Set Edit mode', () => {
    beforeEach(() => {
      model.pledges()[0].editPledge()
    })

    it('should set IsEditable to true', () => {
      expect(model.pledges()[0].isEditable()).toBeTruthy()
    })

    describe('- Submit new Pledge', () => {
      beforeEach(() => {
        browser.loading.reset()
        browser.loaded.reset()
        model.pledges()[0].formModel().description('my new pledge')
        model.pledges()[0].updatePledge()
      })

      it('should show browser is loading', () => {
        expect(browserLoadingStub.calledOnce).toBeTruthy()
      })

      it('should put new approval status to api', () => {
        expect(ajaxPutStub.calledOnce).toBeTruthy()
      })

      it('should set new pledge', () => {
        expect(model.allPledges()[0].description()).toEqual('my new pledge')
      })

      it('should show browser is loaded', () => {
        expect(browserLoadedStub.calledAfter(ajaxPutStub)).toBeTruthy()
      })

      it('should set isEditable to false', () => {
        expect(model.pledges()[0].isEditable()).toBeFalsy()
      })
    })

    describe('- Submit empty new Pledge', () => {
      beforeEach(() => {
        browser.loading.reset()
        browser.loaded.reset()
        model.pledges()[0].formModel().description('')
        model.pledges()[0].updatePledge()
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
      model.pledges()[0].formModel().description('a new pledge description')
      model.pledges()[0].cancelEdit()
    })

    it('should set IsEditable to true', () => {
      expect(model.pledges()[0].isEditable()).toBeFalsy()
    })

    it('should set reset new description', () => {
      expect(model.pledges()[0].formModel().description()).toEqual('pledge description')
    })
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
