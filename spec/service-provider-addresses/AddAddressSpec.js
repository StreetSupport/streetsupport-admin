var sinon = require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('../../src/js/cookies'),
    getUrlParameter = require('../../src/js/get-url-parameter')

describe('Add individual Address', function () {
  var Model = require('../../src/js/models/service-provider-addresses/AddServiceProviderAddress'),
  model,
  stubbedApi,
  browserSpy,
  cookiesStub,
  stubbedParameters

  beforeEach (function () {
    model = new Model()
  })

  it('should set an empty Address', function() {
    expect(model.address().postcode()).toEqual(undefined)
  })

  describe('Save', function () {
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
      browserSpy = sinon.stub(browser, 'redirect')
      cookiesStub = sinon.stub(cookies, 'get').returns('saved-session-token')
      stubbedParameters = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
      stubbedApi = sinon.stub(ajax, 'post').returns(fakeResolved())

      model.address().save()
    })

    afterEach(function () {
      ajax.post.restore()
      browser.redirect.restore()
      cookies.get.restore()
      getUrlParameter.parameter.restore()
    })

    it('should redirect to service provider', function () {
      var redirect = adminurls.serviceProviders + '?key=coffee4craig'
      expect(browserSpy.withArgs(redirect).calledOnce).toBeTruthy()
    })
  })
})
