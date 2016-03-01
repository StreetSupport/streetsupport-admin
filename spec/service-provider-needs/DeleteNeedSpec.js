var sinon = require('sinon')
var ajax =      require('basic-ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminurls = require('../../src/js/admin-urls')
var browser =   require('../../src/js/browser')
var cookies =   require('../../src/js/cookies')
var getUrlParameter = require('../../src/js/get-url-parameter')

describe('Delete individual Need', function () {
  var Model = require('../../src/js/models/Need')
  var model
  var ajaxStub

  beforeEach (function () {
    sinon.stub(browser, 'dataLoaded')
    sinon.stub(getUrlParameter, 'parameter').withArgs('providerId').returns('coffee4craig')
    model = new Model({
      id: "abcde",
      description: "description"
    })
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
    sinon.stub(cookies, 'get').returns('saved-session-token')
    ajaxStub = sinon.stub(ajax, 'delete').returns(fakeResolved())

    model.deleteNeed()
  })

  afterEach(function () {
    browser.dataLoaded.restore()
    getUrlParameter.parameter.restore()
      ajax.delete.restore()
      cookies.get.restore()
  })

  it('should delete need to api', function () {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig/needs/abcde'
    var headers =  {
      'content-type': 'application/json',
      'session-token': 'saved-session-token'
    }
    var payload = JSON.stringify({})
    var postAsExpected = ajaxStub.withArgs(endpoint, headers, payload).calledOnce
    expect(postAsExpected).toBeTruthy()
  })

  it('should notify listeners', function () {

  })
})
