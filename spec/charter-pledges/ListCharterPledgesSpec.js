/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var Model = require('../../src/js/models/charter-pledges/ListCharterPledgesModel')

describe('List Charter Pledges', () => {
  var model
  var ajaxGetStub
  var browserLoadingStub
  var browserLoadedStub

  beforeEach(() => {
    var getCharterPledgesPromise = () => {
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
      .withArgs(endpoints.charterPledges)
      .returns(getCharterPledgesPromise())

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should notify user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('should get pledges from api', () => {
    expect(ajaxGetStub.calledOnce).toBeTruthy()
  })

  it('should set show all pledges to false', () => {
    expect(model.showAll()).toBeFalsy()
  })

  it('should set list of distinct supporter categories', () => {
    expect(model.supporterCategories().length).toEqual(2)
  })

  it('should set show all button label to show all', () => {
    expect(model.showAllButtonLabel()).toEqual('Show all')
  })

  it('should only show disapproved pledges', () => {
    expect(model.pledges().length).toEqual(1)
    expect(model.pledges()[0].isApproved()).toBeFalsy()
  })

  it('should set url to supporter full name', () => {
    expect(model.pledges()[0].fullName).toEqual('first name last name')
  })

  it('should set pledge description', () => {
    expect(model.pledges()[0].description()).toEqual('pledge description')
  })

  it('should set mail to link', () => {
    expect(model.pledges()[0].mailToLink).toEqual('mailto:test@test.com')
  })

  it('should format creation date', () => {
    expect(model.pledges()[0].creationDate).toEqual('11/04/16')
  })

  it('should set pledge approval status', () => {
    expect(model.pledges()[0].isApproved()).toBeFalsy()
  })

  it('should show user then that is loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })

  it('should set btn--primary class for currently disapproved', () => {
    expect(model.pledges()[0].approvedButtonClass()).toEqual('btn btn--primary')
    expect(model.pledges()[0].approvedButtonLabel()).toEqual('Approve Pledge')
  })

  it('should set btn--primary class for currently featured', () => {
    expect(model.pledges()[0].featuredButtonClass()).toEqual('btn btn--indifferent')
    expect(model.pledges()[0].featuredButtonLabel()).toEqual('Unmark as Featured')
  })

  describe('Toggle Show All', () => {
    beforeEach(() => {
      model.toggleShowAll()
    })

    it('should set show all button label to only disapproved', () => {
      expect(model.showAllButtonLabel()).toEqual('View awaiting approval')
    })

    it('should show all pledges', () => {
      expect(model.pledges().length).toEqual(3)
      expect(model.pledges()[2].isApproved()).toBeFalsy()
      expect(model.pledges()[0].isApproved()).toBeTruthy()
      expect(model.showAll()).toBeTruthy()
    })

    it('should set btn--warning class for currently approved', () => {
      expect(model.pledges()[0].approvedButtonClass()).toEqual('btn btn--warning')
      expect(model.pledges()[0].approvedButtonLabel()).toEqual('Disapprove Pledge')
    })

    it('should set btn--indifferent class for currently featured', () => {
      expect(model.pledges()[2].featuredButtonClass()).toEqual('btn btn--indifferent')
      expect(model.pledges()[2].featuredButtonLabel()).toEqual('Unmark as Featured')
    })

    describe('And Toggle Back', () => {
      beforeEach(() => {
        model.toggleShowAll()
      })

      it('should show only disapproved pledges', () => {
        expect(model.pledges().length).toEqual(1)
        expect(model.pledges()[0].isApproved()).toBeFalsy()
        expect(model.showAll()).toBeFalsy()
      })
    })
  })

  describe('- Filter by Category', () => {
    beforeEach(() => {
      model.selectedCategory('I represent a business')
    })

    it('- Should filter pledges by selected Category', () => {
      expect(model.pledges().length).toEqual(2)
    })
  })

  describe('- Filter by Category - and back', () => {
    beforeEach(() => {
      model.selectedCategory('I represent a business')
      model.selectedCategory(undefined)
    })

    it('- Should show all pledges', () => {
      expect(model.pledges().length).toEqual(1)
    })
  })

  describe('Toggle Approval', () => {
    var ajaxPutStub
    beforeEach(() => {
      var getPutPromise = () => {
        return {
          then: function (success, error) {
            success({
              'status': 'ok'
            })
          }
        }
      }
      ajaxPutStub = sinon.stub(ajax, 'put')
        .withArgs(endpoints.charterPledges + '/' + model.pledges()[0].id + '/approval', { isApproved: true })
        .returns(getPutPromise())
      browser.loading.reset()
      browser.loaded.reset()

      model.pledges()[0].toggleApproval()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should show browser is loading', () => {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })

    it('should put new approval status to api', () => {
      expect(ajaxPutStub.calledOnce).toBeTruthy()
    })

    it('should set new approval status of pledge', () => {
      expect(model.allPledges()[0].isApproved()).toBeTruthy()
    })

    it('should show browser is loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxPutStub)).toBeTruthy()
    })

    it('should hide the newly approved pledge as we are only viewing disapproved', () => {
      expect(model.pledges().length).toEqual(0)
    })
  })

  describe('Toggle Flagged as Featured', () => {
    var ajaxPutStub
    beforeEach(() => {
      var getPutPromise = {
        then: function (success, error) {
          success({
            'status': 'ok'
          })
        }
      }
      ajaxPutStub = sinon.stub(ajax, 'put')
        .withArgs(endpoints.charterPledges + '/' + model.pledges()[0].id + '/featured', { isFeatured: false })
        .returns(getPutPromise)
      browser.loading.reset()
      browser.loaded.reset()

      model.pledges()[0].toggleFeatured()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should show browser is loading', () => {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })

    it('should put new featured status to api', () => {
      expect(ajaxPutStub.calledOnce).toBeTruthy()
    })

    it('should set new featured status of pledge', () => {
      expect(model.pledges()[0].isFeatured()).toBeFalsy()
    })

    it('should show browser is loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxPutStub)).toBeTruthy()
    })
  })
})

var pledgeData = () => {
  return [{
    'firstName': 'first name',
    'lastName': 'last name',
    'email': 'test@test.com',
    'organisation': 'organisation',
    'isOptedIn': true,
    'proposedPledge': {
      'description': 'pledge description',
      'isApproved': false,
      'isFeatured': true
    },
    'id': '570b84af3535ff1a8459a142',
    'creationDate': '2016-04-11T11:04:15.1810000Z',
    'supporterCategory': 'I represent a business'
  }, {
    'firstName': 'first name',
    'lastName': 'last name',
    'email': 'test1@test.com',
    'organisation': 'organisation',
    'isOptedIn': true,
    'proposedPledge': {
      'description': 'pledge description',
      'isApproved': true,
      'isFeatured': false
    },
    'id': '570b84d73535ff1a8459a143',
    'creationDate': '2016-04-11T11:04:55.8600000Z',
    'supporterCategory': 'I represent a business'
  }, {
    'firstName': 'first name',
    'lastName': 'last name',
    'email': 'test1@test.com',
    'organisation': 'organisation',
    'isOptedIn': true,
    'proposedPledge': {
      'description': 'pledge description',
      'isApproved': true,
      'isFeatured': false
    },
    'id': '570b84d73535ff1a8459a144',
    'creationDate': '2016-06-11T11:04:55.8600000Z',
    'supporterCategory': 'I have experienced homelessness'
  }]
}
