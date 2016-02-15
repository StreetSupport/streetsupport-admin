var sinon = require('sinon')
var ajax = require('basic-ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminurls = require('../../src/js/admin-urls')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')
var getParams = require('../../src/js/get-url-parameter')

describe('Reset Password', function() {
  var Model = require('../../src/js/models/Auth/ResetPassword')
  var model

  beforeEach(function () {
    sinon.stub(browser, 'dataLoaded')
    model = new Model()
  })

  afterEach(function () {
    browser.dataLoaded.restore()
  })

  it('should set password as empty', function () {
    expect(model.password()).toEqual('')
  })
  
  it('should set password2 as empty', function () {
    expect(model.password2()).toEqual('')
  })

  describe('On submit', function () {
    var stubbedApiPut

    beforeEach(function () {
      function putResolved () {
        return {
          then: function(success, error) {
            success({
              'status': 201
            })
          }
        }
      }

      stubbedApiPut = sinon.stub(ajax, 'put').returns(putResolved())
      sinon.stub(cookies, 'get').withArgs('session-token').returns('storedSessionToken')
      sinon.stub(getParams, 'parameter').returns('verificationCode')
   
      model.password('MyNewPassword!')
      model.password2('MyNewPassword!')
      model.submit()
    })

    afterEach(function () {
      ajax.put.restore()
      cookies.get.restore()
      getParams.parameter.restore()
    })

    it('should put password to api', function () {
      var endpoint = endpoints.resetPassword + '/verificationCode'
      var headers = {
        'content-type': 'application/json',
        'session-token': 'storedSessionToken'
      }
      var payload = JSON.stringify({
        'Password': 'MyNewPassword!'
      })
      var called = stubbedApiPut.withArgs(endpoint, headers, payload).calledOnce
      expect(called).toBeTruthy()
    })
    
    it('should set isSubmissionSuccessful to true', function () {
      expect(model.isSubmissionSuccessful()).toBeTruthy()
    })
  })

  describe('Passwords do not match', function () {
    var stubbedApiPut

    beforeEach(function () {
      stubbedApiPut = sinon.stub(ajax, 'put')

      model.password('MyNewPassword!')
      model.password2('NotTheSamePassword')
      model.submit()
    })

    afterEach(function () {
      ajax.put.restore()
    })

    it('should not put password to api', function () {
      expect(stubbedApiPut.calledCount).toEqual(undefined)
    })
    
    it('should not set isSubmissionSuccessful to true', function () {
      expect(model.isSubmissionSuccessful()).toBeFalsy()
    })
    
    it('should set errors', function () {
      expect(model.errors()[0]).toEqual('Passwords must match.')
    })
  })
})
