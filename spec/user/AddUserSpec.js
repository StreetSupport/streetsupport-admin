var sinon = require('sinon')
var ajax =      require('basic-ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminurls = require('../../src/js/admin-urls')
var cookies =   require('../../src/js/cookies')
var browser =   require('../../src/js/browser')
var getUrlParameter = require('../../src/js/get-url-parameter')

describe('Add User', function () {
  var Model = require('../../src/js/models/AddUser')
  var model

  // beforeEach(function () {
  //   sinon.stub(browser, 'dataLoaded')
  //   model = new Model()
  // })

  // afterEach(function () {
  //   browser.dataLoaded.restore()
  // })

  // it('should start with errors false', function () {
  //   expect(model.hasErrors()).toBeFalsy()
  // })

  // describe('Save', function () {
  //   var stubbedApi,
  //       stubbedCookies,
  //       stubbedUrlParameter,
  //       stubbedBrowser
  //   beforeEach(function () {
  //     function fakeResolved (value) {
  //       return {
  //         then: function (success, error) {
  //           success({
  //             'status': 201,
  //           })
  //         }
  //       }
  //     }

  //     stubbedApi = sinon.stub(ajax, 'post').returns(fakeResolved ())
  //     stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
  //     stubbedUrlParameter = sinon.stub(getUrlParameter, 'parameter').withArgs('key').returns('coffee4craig')
  //     stubbedBrowser = sinon.stub(browser, 'redirect')

  //     model.email('email')
  //     model.save()
  //   })

  //   afterEach(function () {
  //     ajax.post.restore()
  //     cookies.get.restore()
  //     getUrlParameter.parameter.restore()
  //     browser.redirect.restore()
  //   })

  //   it('should post service provider name to api', function () {
  //       var endpoint = endpoints.unverifiedUsers
  //       var headers = {
  //         'content-type': 'application/json',
  //         'session-token': 'stored-session-token'
  //       }
  //       var payload = JSON.stringify({
  //         'Email': 'email',
  //         'ProviderId': 'coffee4craig'
  //       })
  //       var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
  //       expect(apiCalledWithExpectedArgs).toBeTruthy()
  //   })

  //   it('should set message', function () {
  //     expect(model.message()).toEqual('User created.')
  //   })

  //   it('should set userCreated to true', function () {
  //     expect(model.userCreated()).toBeTruthy()
  //   })

  //   it('should redirect to dashboard', function () {
  //     expect(stubbedBrowser.withArgs(adminurls.dashboard).calledOnce).toBeTruthy()
  //   })
  // })

  // describe('Save fail', function () {
  //   var stubbedApi,
  //       stubbedCookies,
  //       stubbedUrlParameter
  //   beforeEach(function () {
  //     function fakeResolved (value) {
  //       return {
  //         then: function (success, error) {
  //           error({
  //             'status': 400,
  //             'response': JSON.stringify({
  //               'messages': ['returned error message 1', 'returned error message 2']
  //             })
  //           })
  //         }
  //       }
  //     }

  //     stubbedApi = sinon.stub(ajax, 'post').returns(fakeResolved ())
  //     stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
  //     stubbedUrlParameter = sinon.stub(getUrlParameter, 'parameter').withArgs('key').returns('coffee4craig')

  //     model.email('email')
  //     model.save()
  //   })

  //   afterEach(function () {
  //     ajax.post.restore()
  //     cookies.get.restore()
  //     getUrlParameter.parameter.restore()
  //   })

  //   it('set errors in message', function () {
  //     expect(model.errors()[0]).toEqual('returned error message 1')
  //     expect(model.errors()[1]).toEqual('returned error message 2')
  //   })
  // })
})
