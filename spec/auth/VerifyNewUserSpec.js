var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminurls = require('../../src/js/admin-urls')
var cookies = require('../../src/js/cookies')
var browser = require('../../src/js/browser')
var getUrlParameter = require('../../src/js/get-url-parameter')

describe('Verify New User', () => {
  var Model = require('../../src/js/models/Auth/VerifyUser'),
  model

  beforeEach(() => {
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    model = new Model()
  })

  afterEach(() => {
    browser.loaded.restore()
    browser.loading.restore()
  })

  it('should start with errors false', () => {
    expect(model.hasErrors()).toBeFalsy()
  })

  describe('Save', () => {
    var stubbedApi,
        stubbedCookies,
        stubbedUrlParameter
    beforeEach(() => {
      function fakeResolved (value) {
        return {
          then: function (success, error) {
            success({
              'status': 201,
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'post').returns(fakeResolved ())
      stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
      stubbedUrlParameter = sinon.stub(getUrlParameter, 'parameter').returns('verification-token')

      model.username('username')
      model.password('password')
      model.save()
    })

    afterEach(() => {
      ajax.post.restore()
      cookies.get.restore()
      getUrlParameter.parameter.restore()
    })

    it('should post service provider name to api', () => {
        var endpoint = endpoints.verifiedUsers
        var headers = {
          'content-type': 'application/json',
          'session-token': 'stored-session-token'
        }
        var payload = JSON.stringify({
          'UserName': 'username',
          'Password': 'password',
          'VerificationToken': 'verification-token'
        })
        var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
        expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should set message', () => {
      expect(model.message()).toEqual('User verified. You can now log in.')
    })

    it('should set userCreated to true', () => {
      expect(model.userCreated()).toBeTruthy()
    })
  })

  describe('Save fail', () => {
    var stubbedApi,
        stubbedCookies,
        stubbedUrlParameter

    beforeEach(() => {
      function fakeResolved (value) {
        return {
          then: function (success, error) {
            error({
              'status': 400,
              'response': JSON.stringify({
                'messages': ['returned error message 1', 'returned error message 2']
              })
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'post').returns(fakeResolved ())
      stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
      stubbedUrlParameter = sinon.stub(getUrlParameter, 'parameter').returns('verification-token')

      model.username('username')
      model.password('password')
      model.save()
    })

    afterEach(() => {
      ajax.post.restore()
      cookies.get.restore()
      getUrlParameter.parameter.restore()
    })

    it('set errors in message', () => {
      expect(model.errors()[0]).toEqual('returned error message 1')
      expect(model.errors()[1]).toEqual('returned error message 2')
    })
  })
})
