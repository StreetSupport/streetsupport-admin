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

  beforeEach (function () {
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

  afterEach (function () {
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

  it('should set show all pledges to false', function () {
    expect(model.showAll()).toBeFalsy()
  })

  it('should set show all button label to show all', function () {
    expect(model.showAllButtonLabel()).toEqual('Show all')
  })

  it('should only show disapproved pledges', function () {
    expect(model.pledges().length).toEqual(1)
    expect(model.pledges()[0].isApproved()).toBeFalsy()
  })

  it('should set url to supporter full name', function () {
    expect(model.pledges()[0].fullName).toEqual('first name last name')
  })

  it('should set pledge description', function () {
    expect(model.pledges()[0].description()).toEqual('pledge description')
  })

  it('should set mail to link', function () {
    expect(model.pledges()[0].mailToLink).toEqual('mailto:test@test.com')
  })

  it('should format creation date', function () {
    expect(model.pledges()[0].creationDate).toEqual('11/04/16')
  })

  it('should set pledge approval status', function () {
    expect(model.pledges()[0].isApproved()).toBeFalsy()
  })

  it('should show user then that is loaded', function () {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })

  it('should set btn--primary class for currently disapproved', function () {
    expect(model.pledges()[0].buttonClass()).toEqual('btn btn--primary')
    expect(model.pledges()[0].buttonLabel()).toEqual('Approve Pledge')
  })

  describe('Toggle Show All', function () {
    beforeEach(function () {
      model.toggleShowAll()
    })

    it('should set show all button label to only disapproved', function () {
      expect(model.showAllButtonLabel()).toEqual('View awaiting approval')
    })

    it('should show all pledges', function () {
      expect(model.pledges().length).toEqual(2)
      expect(model.pledges()[0].isApproved()).toBeFalsy()
      expect(model.pledges()[1].isApproved()).toBeTruthy()
      expect(model.showAll()).toBeTruthy()
    })

    it('should set btn--warning class for currently approved', function () {
      expect(model.pledges()[1].buttonClass()).toEqual('btn btn--warning')
      expect(model.pledges()[1].buttonLabel()).toEqual('Disapprove Pledge')
    })

    describe('And Toggle Back', function () {
      beforeEach(function () {
        model.toggleShowAll()
      })

      it('should show only disapproved pledges', function () {
        expect(model.pledges().length).toEqual(1)
        expect(model.pledges()[0].isApproved()).toBeFalsy()
        expect(model.showAll()).toBeFalsy()
      })
    })
  })

  describe('Toggle Approval', function () {
    var ajaxPutStub
    beforeEach(function () {
      var getPutPromise = function () {
        return {
          then: function (success, error) {
            success({
              'status': 'ok'
            })
          }
        }
      }
      ajaxPutStub = sinon.stub(ajax, 'put')
        .withArgs(endpoints.charterPledges + '/' + model.pledges()[0].id + '/approval', headers, { isApproved: true })
        .returns(getPutPromise())
      browser.loading.reset()
      browser.loaded.reset()

      model.pledges()[0].toggleApproval()
    })

    afterEach(function () {
      ajax.put.restore()
    })

    it('should show browser is loading', function () {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })

    it('should put new approval status to api', function () {
      expect(ajaxPutStub.calledOnce).toBeTruthy()
    })

    it('should set new approval status of pledge', function () {
      expect(model.allPledges()[0].isApproved()).toBeTruthy()
    })

    it('should show browser is loaded', function () {
      expect(browserLoadedStub.calledAfter(ajaxPutStub)).toBeTruthy()
    })

    it('should hide the newly approved pledge as we are only view disapproved', function () {
      expect(model.pledges().length).toEqual(0)
    })
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
      "description": "pledge description",
      "isApproved": false
    },
    "id": "570b84af3535ff1a8459a142",
    "documentCreationDate": "2016-04-11T11:04:15.1810000Z"
  }, {
    "firstName": "first name",
    "lastName": "last name",
    "email": "test1@test.com",
    "organisation": "organisation",
    "isOptedIn": true,
    "proposedPledge": {
      "description": "pledge description",
      "isApproved": true
    },
    "id": "570b84d73535ff1a8459a143",
    "documentCreationDate": "2016-04-11T11:04:55.8600000Z"
  }]
}
