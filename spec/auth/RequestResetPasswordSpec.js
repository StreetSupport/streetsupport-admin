var sinon = require('sinon')
var ajax = require('basic-ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminurls = require('../../src/js/admin-urls')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')

describe('Reset Password', function() {
  var Model = require('../../src/js/models/Auth/RequestResetPassword')
  var model

  beforeEach(function () {
    sinon.stub(browser, 'dataLoaded')
    model = new Model()
  })

  afterEach(function () {
    browser.dataLoaded.restore()
  })

  it('should set email as empty', function () {
    expect(model.email()).toEqual('')
  })

  describe('On submit', function () {
    var stubbedApiPost

    beforeEach(function () {
      function postResolved () {
        return {
          then: function(success, error) {
            success({
              'status': 201
            })
          }
        }
      }

      stubbedApiPost = sinon.stub(ajax, 'post').returns(postResolved())
      sinon.stub(cookies, 'get').withArgs('session-token').returns('storedSessionToken')

      model.email('vince@test.com')
      model.submit()
    })

    afterEach(function () {
      ajax.post.restore()
      cookies.get.restore()
    })

    it('should post email address to api', function () {
      var endpoint = endpoints.resetPassword
      var headers = {
        'content-type': 'application/json',
        'session-token': 'storedSessionToken'
      }
      var payload = JSON.stringify({
        'Email': 'vince@test.com'
      })
      var called = stubbedApiPost.withArgs(endpoint, headers, payload).calledOnce
      expect(called).toBeTruthy()
    })

    it('should set isSubmissionSuccessful to true', function () {
      expect(model.isSubmissionSuccessful()).toBeTruthy()
    })
  })
})
