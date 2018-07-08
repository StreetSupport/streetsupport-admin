/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const adminurls = require('../../src/js/admin-urls')
const browser = require('../../src/js/browser')
const querystring = require('../../src/js/get-url-parameter')
const webAuth = require('../../src/js/models/auth0/webAuth')
const storage = require('../../src/js/sessionStorage')

describe('Index', () => {
  var Model = require('../../src/js/models/Index')
  let model = null // eslint-disable-line
  var stubbedBrowser
  var stubbedStorage

  beforeEach(() => {
    stubbedStorage = sinon.stub(storage, 'get')
    stubbedBrowser = sinon.stub(browser, 'redirect')
  })

  afterEach(() => {
    browser.redirect.restore()
    storage.get.restore()
    webAuth.isAuthenticated.restore()
  })

  describe('Not logged in', () => {
    beforeEach(() => {
      sinon.stub(webAuth, 'isAuthenticated').returns(false)

      stubbedStorage
        .withArgs(webAuth.storageKeys.roles)
        .returns('')

      model = new Model()
    })

    it('should redirect to login', () => {
      var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.login).calledOnce
      expect(browserRedirectedWithExpectedUrl).toBeTruthy()
    })
  })

  describe('has been authenticated', () => {
    beforeEach(() => {
      sinon.stub(webAuth, 'isAuthenticated').returns(true)
    })

    describe('as Super Admin', () => {
      beforeEach(() => {
        sinon.stub(querystring, 'parameter')

        stubbedStorage
          .withArgs(webAuth.storageKeys.roles)
          .returns('superadmin')

        model = new Model()
      })

      afterEach(() => {
        querystring.parameter.restore()
      })

      it('should redirect to dashboard', () => {
        var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.dashboard).calledOnce
        expect(browserRedirectedWithExpectedUrl).toBeTruthy()
      })
    })

    describe('Admin For', () => {
      beforeEach(() => {
        sinon.stub(querystring, 'parameter')
        stubbedStorage
          .withArgs(webAuth.storageKeys.roles)
          .returns('adminfor:coffee4craig')
        model = new Model()
      })

      afterEach(() => {
        querystring.parameter.restore()
      })

      it('should redirect to service provider page', () => {
        var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.serviceProviders + '?key=coffee4craig').calledOnce
        expect(browserRedirectedWithExpectedUrl).toBeTruthy()
      })
    })

    describe('Charter Admin', () => {
      beforeEach(() => {
        sinon.stub(querystring, 'parameter')
        stubbedStorage
          .withArgs(webAuth.storageKeys.roles)
          .returns('charteradmin')
        model = new Model()
      })

      afterEach(() => {
        querystring.parameter.restore()
      })

      it('should redirect to charter page', () => {
        var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.charter).calledOnce
        expect(browserRedirectedWithExpectedUrl).toBeTruthy()
      })
    })

    describe('- with redirect url', () => {
      beforeEach(() => {
        sinon.stub(querystring, 'parameter')
          .returns('https://admin.streetsupport.net/previous-url/')
        sinon.stub(browser, 'origin')
          .returns('https://admin.streetsupport.net')

        stubbedStorage
          .withArgs(webAuth.storageKeys.roles)
          .returns('superadmin')

        model = new Model()
      })

      afterEach(() => {
        querystring.parameter.restore()
        browser.origin.restore()
      })

      it('should redirect to redirect url', () => {
        var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs('https://admin.streetsupport.net/previous-url/').calledOnce
        expect(browserRedirectedWithExpectedUrl).toBeTruthy()
      })
    })

    describe('- with invalid redirect url', () => {
      beforeEach(() => {
        sinon.stub(querystring, 'parameter')
          .returns('https://haxx0rz.l337/phishing/')
        sinon.stub(browser, 'origin')
          .returns('https://admin.streetsupport.net')
        stubbedStorage
          .withArgs(webAuth.storageKeys.roles)
          .returns('charteradmin')

        model = new Model()
      })

      afterEach(() => {
        querystring.parameter.restore()
        browser.origin.restore()
      })

      it('should redirect to relevant home page', () => {
        var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.charter).calledOnce
        expect(browserRedirectedWithExpectedUrl).toBeTruthy()
      })
    })
  })

  describe('session expired', () => {
    beforeEach(() => {
      sinon.stub(webAuth, 'isAuthenticated').returns(false)
      model = new Model()
    })

    it('should redirect to login', () => {
      var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.login).calledOnce
      expect(browserRedirectedWithExpectedUrl).toBeTruthy()
    })
  })
})
