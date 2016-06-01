var sinon = require('sinon'),
    ajax =      require('../../src/js/ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('../../src/js/cookies'),
    getUrlParameter = require('../../src/js/get-url-parameter')

describe('Add individual Address', () => {
  var Model = require('../../src/js/models/service-provider-addresses/AddServiceProviderAddress'),
  model,
  stubbedApi,
  browserSpy,
  cookiesStub,
  stubbedParameters

  beforeEach(() => {
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    model = new Model()
  })

  afterEach(() => {
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should set an empty Address', () => {
    expect(model.address().postcode()).toEqual(undefined)
  })

  describe('Save', () => {
    beforeEach(() => {
      function fakeResolved(value) {
          return {
            then: function(success, error) {
              success({
                'status': 200,
                'data': {}
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

    afterEach(() => {
      ajax.post.restore()
      browser.redirect.restore()
      cookies.get.restore()
      getUrlParameter.parameter.restore()
    })

    it('should redirect to service provider', () => {
      var redirect = adminurls.serviceProviders + '?key=coffee4craig'
      expect(browserSpy.withArgs(redirect).calledOnce).toBeTruthy()
    })
  })
})
