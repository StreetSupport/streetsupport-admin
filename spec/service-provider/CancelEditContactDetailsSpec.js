var sinon = require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('../../src/js/cookies'),
    getUrlParameter = require('../../src/js/get-url-parameter')


describe('Cancel Edit Service Provider Contact Details', function () {
  var Model = require('../../src/js/models/ServiceProvider'),
  model,
  stubbedApi,
  stubbedCookies,
  stubbedUrlParams

  beforeEach(function () {
    function fakeResolved (value) {
      return {
        then: function (success, error) {
          success({
            'status': 200,
            'json': coffee4Craig()
          })
        }
      }
    }

    stubbedApi = sinon.stub(ajax, 'get').returns(fakeResolved ())
    stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
    stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    sinon.stub(browser, 'dataLoaded')

    model = new Model()
    model.editContactDetails()

    model.serviceProvider().telephone('new telephone')
    model.serviceProvider().email('new email')
    model.serviceProvider().website('new website')
    model.serviceProvider().facebook('new facebook')
    model.serviceProvider().twitter('new twitter')

    model.cancelEditContactDetails()
  })

  afterEach(function () {
    ajax.get.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
    browser.dataLoaded.restore()
  })

  it('should reset isEditingContactDetails to false', function () {
    expect(model.isEditingContactDetails()).toBeFalsy()
  })

  it('should restore description to its previous value', function () {
    expect(model.serviceProvider().telephone()).toEqual('initial telephone')
    expect(model.serviceProvider().email()).toEqual('initial email')
    expect(model.serviceProvider().website()).toEqual('initial website')
    expect(model.serviceProvider().facebook()).toEqual('initial facebook')
    expect(model.serviceProvider().twitter()).toEqual('initial twitter')
  })
})

function coffee4Craig() {
  return {
    "key": "coffee4craig",
    "name": "Coffee 4 Craig",
    "email": "initial email",
    "telephone": "initial telephone",
    "website": "initial website",
    "facebook": "initial facebook",
    "twitter": "initial twitter",
    "addresses": [],
    "providedServices": []
  }
}
