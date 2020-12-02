/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminurls = require('../../src/js/admin-urls')
var browser = require('../../src/js/browser')
var getUrlParameter = require('../../src/js/get-url-parameter')
const moment = require('moment')

describe('Add individual Need', () => {
  var Model = require('../../src/js/models/service-provider-needs/AddServiceProviderNeed')
  var model
  let ajaxGetStub = null

  beforeEach(() => {
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(getUrlParameter, 'parameter')
    .withArgs('providerId').returns('coffee4craig')

    let getAddressesResolution = {
      then: function (success, error) {
        success({
          'statusCode': 200,
          'data': coffee4CraigAddresses()
        })
      }
    }
    ajaxGetStub = sinon.stub(ajax, 'get')
    ajaxGetStub.withArgs(endpoints.getServiceProviders + '/coffee4craig/addresses')
      .returns(getAddressesResolution)

    model = new Model()
  })

  afterEach(() => {
    browser.loading.restore()
    browser.loaded.restore()
    getUrlParameter.parameter.restore()
    ajax.get.restore()
  })

  it('should set an empty description', () => {
    expect(model.need().description()).toEqual('')
  })

  it('should set serviceProviderId to that given in querystring', () => {
    expect(model.need().serviceProviderId).toEqual('coffee4craig')
  })

  it('should set need types available', () => {
    expect(model.need().availableTypes()[0]).toEqual('money')
    expect(model.need().availableTypes()[1]).toEqual('time')
    expect(model.need().availableTypes()[2]).toEqual('items')
  })

  it('should initially set isPeopleOrThings to false', () => {
    expect(model.need().isPeopleOrThings()).toBeFalsy()
  })

  it('should initially set isMoney to false', () => {
    expect(model.need().isMoney()).toBeFalsy()
  })

  it('should set postcode to organisation\'s first address postcode', () => {
    expect(model.need().postcode()).toEqual('M6 8AQ')
  })

  describe('selecting Time', () => {
    beforeEach(() => {
      model.need().type('time')
    })

    it('should set isPeopleOrThings to true', () => {
      expect(model.need().isPeopleOrThings()).toBeTruthy()
    })
  })

  describe('selecting Items', () => {
    beforeEach(() => {
      model.need().type('items')
    })

    it('should set isPeopleOrThings to true', () => {
      expect(model.need().isPeopleOrThings()).toBeTruthy()
    })
  })

  describe('update description', () => {
    beforeEach(() => {
      model.need().description('new description')
    })
  })

  describe('selecting Items', () => {
    beforeEach(() => {
      model.need().type('items')
    })

    it('should set isPeopleOrThings to true', () => {
      expect(model.need().isPeopleOrThings()).toBeTruthy()
    })
  })

  describe('Save', () => {
    var browserStub
    var ajaxStub

    beforeEach(() => {
      let fakeResolved = {
        then: (success, _) => {
          success({
            'statusCode': 201,
            'data': {}
          })
        }
      }
      browserStub = sinon.stub(browser, 'redirect')
      ajaxStub = sinon.stub(ajax, 'post').returns(fakeResolved)

      model.need().description('new description')
      model.need().type('type')
      model.need().reason('reason')
      model.need().moreInfoUrl('http://moreinfo.com')
      model.need().postcode('postcode')
      model.need().instructions('instructions')
      model.need().email('test@test.com')
      model.need().donationAmountInPounds(123.45)
      model.need().donationUrl('http://donatehere.com')
      model.need().keywords(' keywordA, keywordB ,keywordC ')
      model.need().customMessage('custom message')
      model.need().clientGroups = []
      model.need().startDate(moment('2020-11-25').format('YYYY-MM-DD'))
      model.need().endDate(moment('2020-11-27').format('YYYY-MM-DD'))

      model.need().save()
    })

    afterEach(() => {
      ajax.post.restore()
      browser.redirect.restore()
    })

    it('should post need to api', () => {
      var endpoint = endpoints.getServiceProviders + '/coffee4craig/needs'
      var payload = {
        'Description': 'new description',
        'Type': 'type',
        'Reason': 'reason',
        'MoreInfoUrl': 'http://moreinfo.com',
        'Postcode': 'postcode',
        'Instructions': 'instructions',
        'Email': 'test@test.com',
        'DonationAmountInPounds': 123.45,
        'DonationUrl': 'http://donatehere.com',
        'Keywords': [ 'keywordA', 'keywordB', 'keywordC' ],
        'CustomMessage': 'custom message',
        'ClientGroupKeys': [],
        'NeededDate': new Date('2020-11-25'),
        'EndDate': new Date('2020-11-27')
      }
      var postAsExpected = ajaxStub.withArgs(endpoint, payload).calledOnce
      expect(postAsExpected).toBeTruthy()
    })

    it('should redirect to service provider', () => {
      var redirect = adminurls.serviceProviders + '?key=coffee4craig'
      expect(browserStub.withArgs(redirect).calledOnce).toBeTruthy()
    })
  })
})

function coffee4CraigAddresses () {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'addresses': [{
      'key': '1234',
      'street': '7-11 Lancaster Rd',
      'street1': null,
      'street2': null,
      'street3': null,
      'city': 'Salford',
      'postcode': 'M6 8AQ'
    },
    {
      'key': '5678',
      'street': 'Manchester Picadilly',
      'street1': null,
      'street2': null,
      'street3': null,
      'city': null,
      'postcode': 'M1 1AF'
    }]
  }
}
