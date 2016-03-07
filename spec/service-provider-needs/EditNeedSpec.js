var sinon = require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('../../src/js/cookies'),
    getUrlParameter = require('../../src/js/get-url-parameter')

describe('Editing Service Provider Need', function () {
  var Model = require('../../src/js/models/service-provider-needs/EditServiceProviderNeed')
  var model
  var browserStub
  var ajaxGetStub

  beforeEach(function () {
    browserStub = sinon.stub(browser, 'dataLoaded')

    function fakeGetResolution (value) {
      return {
        then: function (success, error) {
          success({
            'status': 200,
            'json': needData()
          })
        }
      }
    }
    ajaxGetStub = sinon.stub(ajax, 'get').withArgs(
      endpoints.getServiceProviders + '/provider-id/needs/abc123',
      {
        'content-type': 'application/json',
        'session-token': 'saved-session-token'
      },
      JSON.stringify({})
    ).returns(fakeGetResolution())
    var urlParamsStub = sinon.stub(getUrlParameter, 'parameter')
    urlParamsStub.withArgs('providerId').returns('provider-id')
    urlParamsStub.withArgs('needId').returns('abc123')
    sinon.stub(cookies, 'get').returns('saved-session-token')
    model = new Model()
  })

  afterEach(function () {
    ajax.get.restore()
    browser.dataLoaded.restore()
    getUrlParameter.parameter.restore()
    cookies.get.restore()
  })

  it('should get need from api', function () {
    expect(ajaxGetStub.calledOnce).toBeTruthy()
  })

  it('should set editNeedUrl', function () {
    expect(model.need().editNeedUrl).toEqual(adminurls.serviceProviderNeedsEdit + '?providerId=provider-id&needId=abc123')
  })

  it('should tell browser dataLoaded', function () {
    expect(browserStub.calledOnce).toBeTruthy()
  })
})

function needData() {
  return {
    'id': 'abc123',
    'serviceProviderId': 'provider-id'
  }
}
