var sinon = require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('../../src/js/cookies'),
    getUrlParameter = require('../../src/js/get-url-parameter')

describe('Editing Service Provider Need', function () {
  var Model = require('../../src/js/models/Need')
  var model

  beforeEach(function () {
    sinon.stub(getUrlParameter, 'parameter').returns('provider-id')
    model = new Model({
      id: 'abc123'
    })
  })

  afterEach(function () {
    getUrlParameter.parameter.restore()
  })

  it('should set editNeedUrl', function () {
    expect(model.editNeedUrl).toEqual(adminurls.serviceProviderNeedsEdit + '?providerId=provider-id&needId=abc123')
  })
})
