var sinon = require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('../../src/js/cookies'),
    getUrlParameter = require('../../src/js/get-url-parameter')

describe('Add individual Address', function () {
  var Model = require('../../src/js/models/service-provider-addresses/AddServiceProviderAddress'),
  model

  beforeEach (function () {
    model = new Model()
  })

  it('should set an empty Address', function() {
    expect(model.address().postcode()).toEqual(undefined)
  })
})
