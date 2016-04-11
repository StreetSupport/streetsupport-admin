var sinon = require('sinon')
var ajax =      require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminUrls = require('../../src/js/admin-urls')
var browser =   require('../../src/js/browser')
var cookies =   require('../../src/js/cookies')
var Model = require('../../src/js/models/charter-pledges/ListCharterPledgesModel')

describe('List Charter Pledges', function () {
  var model
  var headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }
  var ajaxGetStub
  var browserLoadingStub
  var browserLoadedStub

  beforeEach(function () {
    var getCharterPledgesPromise = function () {
      return {
        then: function (success, error) {
          success({
            'status': 'ok',
            'data': pledgeData()
          })
        }
      }
    }

    ajaxGetStub = sinon.stub(ajax, 'get')
      .withArgs(endpoints.charterPledges, headers)
      .returns(getCharterPledgesPromise())

    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(function () {
    ajax.get.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should notify user it is loading' ,function () {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('should get pledges from api', function () {
    expect(ajaxGetStub.calledOnce).toBeTruthy()
  })

  it('should set pledges', function () {
    expect(model.pledges().length).toEqual(2)
  })

  it('should set url to supporter full name', function () {
    expect(model.pledges()[1].fullName).toEqual('first name 1 last name 1')
  })

  it('should set pledge description', function () {
    expect(model.pledges()[1].description).toEqual('pledge description 1')
  })

  it('should show user then that is loaded', function () {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })
})

var pledgeData = function () {
  return [{
    "firstName": "first name",
    "lastName": "last name",
    "email": "test@test.com",
    "organisation": "organisation",
    "isOptedIn": true,
    "proposedPledge": {
      "description": "pledge description"
    },
    "id": "570b84af3535ff1a8459a142",
    "documentCreationDate": "2016-04-11T11:04:15.1810000Z"
  }, {
    "firstName": "first name 1",
    "lastName": "last name 1",
    "email": "test1@test.com",
    "organisation": "organisation 1",
    "isOptedIn": true,
    "proposedPledge": {
      "description": "pledge description 1"
    },
    "id": "570b84d73535ff1a8459a143",
    "documentCreationDate": "2016-04-11T11:04:55.8600000Z"
  }]
}
