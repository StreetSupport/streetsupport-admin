/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const ajax = require('../../src/js/ajax')
const endpoints = require('../../src/js/api-endpoints')
const browser = require('../../src/js/browser')
const getUrlParameter = require('../../src/js/get-url-parameter')

describe('Edit Service Provider Donation Details', () => {
  const Model = require('../../src/js/models/service-providers/ServiceProviderDetails')
  let model = null

  beforeEach(() => {
    let fakeResolved = {
      then: (success, _) => {
        success({
          'statusCode': 200,
          'data': coffee4Craig()
        })
      }
    }

    sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(browser, 'scrollTo')

    model = new Model()

    model.editDonationDetails()
  })

  afterEach(() => {
    ajax.get.restore()
    getUrlParameter.parameter.restore()
    browser.loaded.restore()
    browser.loading.restore()
    browser.scrollTo.restore()
  })

  it('should set isEditingDonationDetails to true', () => {
    expect(model.isEditingDonationDetails).toBeTruthy()
  })

  it('should htmlencode donation description', () => {
    expect(model.serviceProvider().donationDescription()).toEqual('Every Donation to AKT delivers help where it\'s most needed.')
  })

  describe('Save', () => {
    var stubbedPutApi

    beforeEach(() => {
      let fakeResolved = {
        then: (success, _) => {
          success({
            'statusCode': 200,
            'data': {}
          })
        }
      }

      stubbedPutApi = sinon.stub(ajax, 'put').returns(fakeResolved)

      model.serviceProvider().donationUrl('http://donate-here.com')
      model.serviceProvider().donationDescription('donation description')

      model.serviceProvider().itemsDonationUrl('http://item-donate-here.com')
      model.serviceProvider().itemsDonationDescription('item donation description')

      model.saveDonationDetails()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should put service provider Donation details to api with session token', () => {
      var endpoint = endpoints.getServiceProviders + '/coffee4craig/donation-information'
      var payload = {
        'DonationUrl': 'http://donate-here.com',
        'DonationDescription': 'donation description',
        'ItemsDonationUrl': 'http://item-donate-here.com',
        'ItemsDonationDescription': 'item donation description'
      }
      var apiCalledWithExpectedArgs = stubbedPutApi.withArgs(endpoint, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should set isEditingDonationDetails to false', () => {
      expect(model.isEditingDonationDetails()).toBeFalsy()
    })
  })

  describe('Invalid submission', () => {
    beforeEach(() => {
      const fakeResolved = {
        then: (result, _) => {
          result({
            'statusCode': 400,
            'response': JSON.stringify({
              'messages': ['returned error message 1', 'returned error message 2']
            })
          })
        }
      }

      sinon.stub(ajax, 'put').returns(fakeResolved)

      model.serviceProvider().description('new description')

      model.saveDonationDetails()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should set message as joined error messages', () => {
      expect(model.errors()[1]).toEqual('returned error message 2')
    })

    it('should keep isEditingDonationDetails as true', () => {
      expect(model.isEditingDonationDetails()).toBeTruthy()
    })
  })

  describe('Invalid submission then valid submission', () => {
    beforeEach(() => {
      let fakeResolved = {
        then: (success, _) => {
          success({
            'statusCode': 200,
            'data': {}
          })
        }
      }

      sinon.stub(ajax, 'put').returns(fakeResolved)

      model.errors(['error a', 'error b'])
      model.serviceProvider().description('new description')
      model.serviceProvider().shortDescription('new short description')

      model.saveDonationDetails()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should clear errors', () => {
      expect(model.hasErrors()).toBeFalsy()
    })
  })
})

function coffee4Craig () {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'description': 'initial description',
    'addresses': [],
    'groupedServices': [],
    'providedServices': [],
    'tags': ['tag-a', 'tag-c', 'tag-d'],
    'needCategories': ['cat a', 'cat b'],
    'donationDescription': 'Every Donation to AKT delivers help where it&#39;s most needed.'
  }
}
