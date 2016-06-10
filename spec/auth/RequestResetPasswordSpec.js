/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')

describe('Reset Password', () => {
  var Model = require('../../src/js/models/Auth/RequestResetPassword')
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

  it('should set email as empty', () => {
    expect(model.email()).toEqual('')
  })

  describe('On submit', () => {
    var stubbedApiPost

    beforeEach(() => {
      let postResolved = {
        then: (success, _) => {
          success({
            'status': 201
          })
        }
      }

      stubbedApiPost = sinon.stub(ajax, 'post').returns(postResolved)
      sinon.stub(cookies, 'get').withArgs('session-token').returns('storedSessionToken')

      model.email('vince@test.com')
      model.submit()
    })

    afterEach(() => {
      ajax.post.restore()
      cookies.get.restore()
    })

    it('should post email address to api', () => {
      var endpoint = endpoints.resetPassword
      var headers = {
        'content-type': 'application/json',
        'session-token': 'storedSessionToken'
      }
      var payload = {
        'Email': 'vince@test.com'
      }
      var called = stubbedApiPost.withArgs(endpoint, headers, payload).calledOnce
      expect(called).toBeTruthy()
    })

    it('should set isSubmissionSuccessful to true', () => {
      expect(model.isSubmissionSuccessful()).toBeTruthy()
    })
  })
})
