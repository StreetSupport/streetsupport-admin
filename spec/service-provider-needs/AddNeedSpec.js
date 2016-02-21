var sinon = require('sinon')
var ajax =      require('basic-ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminurls = require('../../src/js/admin-urls')
var browser =   require('../../src/js/browser')
var cookies =   require('../../src/js/cookies')
var getUrlParameter = require('../../src/js/get-url-parameter')

describe('Add individual Need', function () {
  var Model = require('../../src/js/models/service-provider-needs/AddServiceProviderNeed')
  var model

  beforeEach (function () {
    sinon.stub(browser, 'dataLoaded')
    sinon.stub(getUrlParameter, 'parameter').withArgs('providerId').returns('coffee4craig')
    model = new Model()
  })

  afterEach(function () {
    browser.dataLoaded.restore()
    getUrlParameter.parameter.restore()
  })

  it('should set an empty description', function() {
    expect(model.need().description()).toEqual(undefined)
  })

  it('should set serviceProviderId to that given in querystring', function() {
    expect(model.need().serviceProviderId).toEqual('coffee4craig')
  })

  describe('Save', function () {
    var browserStub
    var ajaxStub

    beforeEach(function () {
      function fakeResolved(value) {
          return {
            then: function(success, error) {
              success({
                'status': 200,
                'json': {}
              })
            }
          }
        }
      browserStub = sinon.stub(browser, 'redirect')
      sinon.stub(cookies, 'get').returns('saved-session-token')
      ajaxStub = sinon.stub(ajax, 'post').returns(fakeResolved())

      model.need().description('new description')

      model.need().save()
    })

    afterEach(function () {
      ajax.post.restore()
      browser.redirect.restore()
      cookies.get.restore()
    })

    it('should post need to api', function () {
      var endpoint = endpoints.getServiceProviders + '/coffee4craig/needs'
      var headers =  {
        'content-type': 'application/json',
        'session-token': 'saved-session-token'
      }
      var payload = JSON.stringify({
        'Description': 'new description',
      })
      var postAsExpected = ajaxStub.withArgs(endpoint, headers, payload).calledOnce
      expect(postAsExpected).toBeTruthy()
    })

    it('should redirect to service provider', function () {
      var redirect = adminurls.serviceProviders + '?key=coffee4craig'
      expect(browserStub.withArgs(redirect).calledOnce).toBeTruthy()
    })
  })
})
