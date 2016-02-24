var sinon = require('sinon'),
ajax =      require('basic-ajax'),
endpoints = require('../../src/js/api-endpoints'),
adminurls = require('../../src/js/admin-urls'),
browser =   require('../../src/js/browser'),
cookies =   require('../../src/js/cookies'),
browser =   require('../../src/js/browser')

describe ('Dashboard', function () {
  var Dashboard = require('../../src/js/models/Dashboard'),
      dashboard,
      stubbedApi,
      stubbedCookies,
      stubbedBrowser

  beforeEach (function () {
    function fakeResolved (value) {
      return {
        then: function (success, error) {
          success({
            'status': 200,
            'json': [
              {
                'key': 'albert-kennedy-trust',
                'name': 'Albert Kennedy Trust',
                'isVerified': false,
                'isPublished': false
              },
              {
                'key': 'booth-centre',
                'name': 'Booth Centre',
                'isVerified': true,
                'isPublished': true
              },
              {
                'key': 'coffee4craig',
                'name': 'Coffee4Craig',
                'isVerified': false,
                'isPublished': true
              }
            ]
          })
        }
      }
    }

    stubbedApi = sinon.stub(ajax, 'get')
    stubbedApi.returns(fakeResolved ())

    stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')

    stubbedBrowser = sinon.stub(browser, 'dataLoaded')

    dashboard = new Dashboard()
  })

  afterEach (function () {
    ajax.get.restore()
    cookies.get.restore()
    browser.dataLoaded.restore()
  })

  it ('should retrieve service providers from api with session token', function () {
      var endpoint = endpoints.getServiceProviders
      var headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      var payload = {}
      var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
  })

  it ('should call dataLoaded', function () {
      expect(stubbedBrowser.calledOnce).toBeTruthy()
  })

  it ('should populate service provider collection', function () {
    expect(dashboard.serviceProviders().length).toEqual(3)
  })

  it ('should sort service provider by name', function () {
    expect(dashboard.serviceProviders()[0].key).toEqual('albert-kennedy-trust')
    expect(dashboard.serviceProviders()[1].key).toEqual('booth-centre')
    expect(dashboard.serviceProviders()[2].key).toEqual('coffee4craig')
  })

  it ('should set service provider url', function () {
    expect(dashboard.serviceProviders()[0].url).toEqual(adminurls.serviceProviders + '?key=albert-kennedy-trust')
  })

  it ('should set create new user url', function () {
    expect(dashboard.serviceProviders()[0].newUserUrl).toEqual(adminurls.userAdd + '?key=albert-kennedy-trust')
  })

  it ('should have verifiedLabel equal to the providers verification status', function () {
    expect(dashboard.serviceProviders()[0].verifiedLabel()).toEqual("under review")
    expect(dashboard.serviceProviders()[1].verifiedLabel()).toEqual("verified")
  })

  it ('should have verifiedLabelClass based on the providers verification status', function () {
    expect(dashboard.serviceProviders()[0].verifiedLabelClass()).toEqual("status status--false")
    expect(dashboard.serviceProviders()[1].verifiedLabelClass()).toEqual("status status--true")
  })

  it ('should have publishedLabel equal to the providers publication status', function () {
    expect(dashboard.serviceProviders()[0].publishedLabel()).toEqual("disabled")
    expect(dashboard.serviceProviders()[1].publishedLabel()).toEqual("published")
  })

  it ('should have publishedLabelClass based on the providers publication status', function () {
    expect(dashboard.serviceProviders()[0].publishedLabelClass()).toEqual("status status--false")
    expect(dashboard.serviceProviders()[1].publishedLabelClass()).toEqual("status status--true")
  })
})
