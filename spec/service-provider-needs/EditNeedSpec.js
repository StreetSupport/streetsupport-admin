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
      endpoints.getServiceProviders + '/albert-kennedy-trust/needs/56d8784092855610f88d492a',
      {
        'content-type': 'application/json',
        'session-token': 'saved-session-token'
      },
      JSON.stringify({})
    ).returns(fakeGetResolution())
    var urlParamsStub = sinon.stub(getUrlParameter, 'parameter')
    urlParamsStub.withArgs('providerId').returns('albert-kennedy-trust')
    urlParamsStub.withArgs('needId').returns('56d8784092855610f88d492a')
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
    expect(model.need().editNeedUrl).toEqual(adminurls.serviceProviderNeedsEdit + '?providerId=albert-kennedy-trust&needId=56d8784092855610f88d492a')
  })

  it('should set need id', function () {
    expect(model.need().id()).toEqual('56d8784092855610f88d492a')
  })

  it('should set need service provider id', function () {
    expect(model.need().serviceProviderId).toEqual('albert-kennedy-trust')
  })

  it('should set need description', function () {
    expect(model.need().description()).toEqual('test')
  })

  it('should set need type', function () {
    expect(model.need().type()).toEqual('Money')
  })

  it('should set need reason', function () {
    expect(model.need().reason()).toEqual('reas')
  })

  it('should set need moreInfoUrl', function () {
    expect(model.need().moreInfoUrl()).toEqual('http://www.wang.com')
  })


  it('should set need postcode', function () {
    expect(model.need().postcode()).toEqual('m1 3ly')
  })


  it('should set need instructions', function () {
    expect(model.need().instructions()).toEqual('instructions')
  })


  it('should set need email', function () {
    expect(model.need().email()).toEqual('email')
  })


  it('should set need donationAmountInPounds', function () {
    expect(model.need().donationAmountInPounds()).toEqual(1)
  })


  it('should set need donationUrl', function () {
    expect(model.need().donationUrl()).toEqual('http://www.donationUrl.com')
  })

  it('should tell browser dataLoaded', function () {
    expect(browserStub.calledOnce).toBeTruthy()
  })
})

function needData() {
  return {
    'id': '56d8784092855610f88d492a',
    'description': 'test',
    'serviceProviderId': 'albert-kennedy-trust',
    'type': 'Money',
    'reason': 'reas',
    'moreInfoUrl': 'http://www.wang.com',
    'postcode': 'm1 3ly',
    'instructions': 'instructions',
    'email': 'email',
    'donationAmountInPounds': 1,
    'donationUrl': 'http://www.donationUrl.com'
  }
}
