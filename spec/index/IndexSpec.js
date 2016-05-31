/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax =  require('basic-ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminurls = require('../../src/js/admin-urls')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')

describe('Index', () => {
  var Model = require('../../src/js/models/Index')
  var model
  var stubbedBrowser
  var stubbedApi

  afterEach(() => {
    cookies.get.restore()
    browser.redirect.restore()
    ajax.get.restore()
  })

  describe('Not logged in', () => {

    beforeEach(() => {
      sinon.stub(cookies, 'get').returns(null)
      stubbedBrowser = sinon.stub(browser, 'redirect')

      var resolved = () => {
        return {
          then: function (success, error) {
            error({
              'status': 404,
              'json': {}
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'get').returns(resolved)

      model = new Model()
    })

    it('should redirect to login', () => {
      var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.login).calledOnce
      expect(browserRedirectedWithExpectedUrl).toBeTruthy()
    })
  })

  describe('Has session token', () => {

    beforeEach(() => {
      sinon.stub(cookies, 'get').returns('stored-session-token')
      stubbedBrowser = sinon.stub(browser, 'redirect')
      stubbedApi = sinon.stub(ajax, 'get')
    })

    describe('as Super Admin', () => {
      beforeEach(() => {
        function resolved(value) {
          return {
            then: function (success, error) {
              success({
                'status': 200,
                'json': {
                  'authClaims': [ 'OrgAdmin', 'SuperAdmin' ]
                }
              })
            }
          }
        }

        stubbedApi.returns(resolved())
        model = new Model()
      })

      it('should check if session still valid', () => {
        var apiCalled = stubbedApi.withArgs(endpoints.sessions,
          {
            'content-type': 'application/json',
            'session-token': 'stored-session-token'
          },
          {}).calledOnce

        expect(apiCalled).toBeTruthy()
      })

      it('should redirect to dashboard', () => {
        var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.dashboard).calledOnce
        expect(browserRedirectedWithExpectedUrl).toBeTruthy()
      })
    })

    describe('Admin For', () => {
      beforeEach(() => {

        function resolved(value) {
          return {
            then: function (success, error) {
              success({
                'status': 200,
                'json': {
                  'authClaims': [ 'OrgAdmin', 'AdminFor:coffee4craig' ]
                }
              })
            }
          }
        }

        stubbedApi.returns(resolved())
        model = new Model()
      })

      it('should check if session still valid', () => {
        var apiCalled = stubbedApi.withArgs(endpoints.sessions,
          {
            'content-type': 'application/json',
            'session-token': 'stored-session-token'
          },
          {}).calledOnce

        expect(apiCalled).toBeTruthy()
      })

      it('should redirect to service provider page', () => {
        var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.serviceProviders + '?key=coffee4craig').calledOnce
        expect(browserRedirectedWithExpectedUrl).toBeTruthy()
      })
    })

    describe('Charter Admin', () => {
      beforeEach(() => {
        let resolved = {
          then: function (success, error) {
            success({
              'status': 200,
              'json': {
                'authClaims': [ 'CharterAdmin' ]
              }
            })
          }
        }

        stubbedApi.returns(resolved)
        model = new Model()
      })

      it('should check if session still valid', () => {
        var apiCalled = stubbedApi.withArgs(endpoints.sessions,
          {
            'content-type': 'application/json',
            'session-token': 'stored-session-token'
          },
          {}).calledOnce

        expect(apiCalled).toBeTruthy()
      })

      it('should redirect to charter page', () => {
        var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.charter).calledOnce
        expect(browserRedirectedWithExpectedUrl).toBeTruthy()
      })
    })

    describe('session expired', () => {
      beforeEach(() => {

        function resolved(value) {
          return {
            then: function (success, error) {
              error({
                'status': 401
              })
            }
          }
        }

        stubbedApi.returns(resolved())
        model = new Model()
      })

      it('should check if session still valid', () => {
        var apiCalled = stubbedApi.withArgs(endpoints.sessions,
          {
            'content-type': 'application/json',
            'session-token': 'stored-session-token'
          },
          {}).calledOnce

        expect(apiCalled).toBeTruthy()
      })

      it('should redirect to login', () => {
        var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.login).calledOnce
        expect(browserRedirectedWithExpectedUrl).toBeTruthy()
      })
    })
  })
})
