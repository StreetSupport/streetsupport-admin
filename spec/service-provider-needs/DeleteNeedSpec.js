var sinon = require('sinon')
var ajax =      require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminurls = require('../../src/js/admin-urls')
var browser =   require('../../src/js/browser')
var cookies =   require('../../src/js/cookies')
var getUrlParameter = require('../../src/js/get-url-parameter')

describe('Delete individual Need', () => {
  var Model = require('../../src/js/models/Need')
  var model
  var ajaxStub

  beforeEach(() => {
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(getUrlParameter, 'parameter').withArgs('key').returns('coffee4craig')
    model = new Model({
      id: "abcde",
      description: "description"
    })
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
    sinon.stub(cookies, 'get').returns('saved-session-token')
    ajaxStub = sinon.stub(ajax, 'delete').returns(fakeResolved())

    model.deleteNeed()
  })

  afterEach(() => {
    browser.loading.restore()
    browser.loaded.restore()
    getUrlParameter.parameter.restore()
      ajax.delete.restore()
      cookies.get.restore()
  })

  it('should delete need to api', () => {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig/needs/abcde'
    var headers =  {
      'content-type': 'application/json',
      'session-token': 'saved-session-token'
    }
    var postAsExpected = ajaxStub.withArgs(endpoint, headers).calledOnce
    expect(postAsExpected).toBeTruthy()
  })
})
