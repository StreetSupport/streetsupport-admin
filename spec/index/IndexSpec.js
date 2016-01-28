var sinon =     require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies = require('../../src/js/cookies')

describe ('Index', function () {
  var Model = require('../../src/js/models/Index')

  describe ('Not logged in', function () {
    var model
    var stubbedBrowser

    beforeEach (function () {
      sinon.stub(cookies, 'get').returns(null)
      stubbedBrowser = sinon.stub(browser, 'redirect')
      model = new Model()
    })

    afterEach (function () {
      cookies.get.restore()
      browser.redirect.restore()
    })

    it ('should redirect to login', function () {
      var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.login).calledOnce
      expect(browserRedirectedWithExpectedUrl).toBeTruthy()
    })
  })

  describe ('Super Admin', function () {
    var model
    var stubbedBrowser

    beforeEach (function () {
      sinon.stub(cookies, 'get').returns('SuperAdmin')
      stubbedBrowser = sinon.stub(browser, 'redirect')
      model = new Model()
    })

    afterEach (function () {
      cookies.get.restore()
      browser.redirect.restore()
    })

    it ('should redirect to dashboard', function () {
      var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.dashboard).calledOnce
      expect(browserRedirectedWithExpectedUrl).toBeTruthy()
    })
  })

  describe ('Admin For', function () {
    var model
    var stubbedBrowser

    beforeEach (function () {
      sinon.stub(cookies, 'get').returns('AdminFor:coffee4craig')
      stubbedBrowser = sinon.stub(browser, 'redirect')
      model = new Model()
    })

    afterEach (function () {
      cookies.get.restore()
      browser.redirect.restore()
    })

    it ('should redirect to dashboard', function () {
      var browserRedirectedWithExpectedUrl = stubbedBrowser.withArgs(adminurls.serviceProviders + '?key=coffee4craig').calledOnce
      expect(browserRedirectedWithExpectedUrl).toBeTruthy()
    })
  })
})
