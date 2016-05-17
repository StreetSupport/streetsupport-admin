var sinon = require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    cookies =   require('../../src/js/cookies'),
    browser =   require('../../src/js/browser'),
    getUrlParameter = require('../../src/js/get-url-parameter')

describe('Verify New User', function () {
  var Model = require('../../src/js/models/Auth/VerifyUser'),
  model

  beforeEach(function () {
    sinon.stub(browser, 'dataLoaded')
    model = new Model()
  })

  afterEach(function () {
    browser.dataLoaded.restore()
  })

  it('should start with errors false', function () {
    expect(model.hasErrors()).toBeFalsy()
  })

  describe('Save', function () {
    var stubbedApi,
        stubbedCookies,
        stubbedUrlParameter
    beforeEach(function () {
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

    afterEach(function () {
      ajax.post.restore()
      cookies.get.restore()
      getUrlParameter.parameter.restore()
    })

    it('should post service provider name to api', function () {
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

    it('should set message', function () {
      expect(model.message()).toEqual('User verified. You can now log in.')
    })

    it('should set userCreated to true', function () {
      expect(model.userCreated()).toBeTruthy()
    })
  })

  describe('Save fail', function () {
    var stubbedApi,
        stubbedCookies,
        stubbedUrlParameter

    beforeEach(function () {
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

    afterEach(function () {
      ajax.post.restore()
      cookies.get.restore()
      getUrlParameter.parameter.restore()
    })

    it('set errors in message', function () {
      expect(model.errors()[0]).toEqual('returned error message 1')
      expect(model.errors()[1]).toEqual('returned error message 2')
    })
  })
})
