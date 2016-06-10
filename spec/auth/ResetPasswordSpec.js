/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')
var getParams = require('../../src/js/get-url-parameter')

describe('Reset Password', () => {
  var Model = require('../../src/js/models/Auth/ResetPassword')
  var model

  beforeEach(() => {
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    model = new Model()
  })

  afterEach(() => {
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should set password as empty', () => {
    expect(model.password()).toEqual('')
  })

  it('should set password2 as empty', () => {
    expect(model.password2()).toEqual('')
  })

  describe('On submit', () => {
    var stubbedApiPut

    beforeEach(() => {
      let putResolved = {
        then: (success, _) => {
          success({
            'status': 201
          })
        }
      }

      stubbedApiPut = sinon.stub(ajax, 'put').returns(putResolved)
      sinon.stub(cookies, 'get').withArgs('session-token').returns('storedSessionToken')
      sinon.stub(getParams, 'parameter').returns('verificationCode')

      model.password('MyNewPassword!')
      model.password2('MyNewPassword!')
      model.submit()
    })

    afterEach(() => {
      ajax.put.restore()
      cookies.get.restore()
      getParams.parameter.restore()
    })

    it('should put password to api', () => {
      var endpoint = endpoints.resetPassword + '/verificationCode'
      var headers = {
        'content-type': 'application/json',
        'session-token': 'storedSessionToken'
      }
      var payload = {
        'Password': 'MyNewPassword!'
      }
      var called = stubbedApiPut.withArgs(endpoint, headers, payload).calledOnce
      expect(called).toBeTruthy()
    })

    it('should set isSubmissionSuccessful to true', () => {
      expect(model.isSubmissionSuccessful()).toBeTruthy()
    })
  })

  describe('Passwords do not match', () => {
    var stubbedApiPut

    beforeEach(() => {
      stubbedApiPut = sinon.stub(ajax, 'put')

      model.password('MyNewPassword!')
      model.password2('NotTheSamePassword')
      model.submit()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should not put password to api', () => {
      expect(stubbedApiPut.calledCount).toEqual(undefined)
    })

    it('should not set isSubmissionSuccessful to true', () => {
      expect(model.isSubmissionSuccessful()).toBeFalsy()
    })

    it('should set errors', () => {
      expect(model.errors()[0]).toEqual('Passwords must match.')
    })
  })
})
