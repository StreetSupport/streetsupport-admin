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

describe('Editing Service Provider Need', () => {
  var Model = require('../../src/js/models/service-provider-needs/EditServiceProviderNeed')
  var model
  var browserStub
  var browserRedirectStub
  var ajaxGetStub

  beforeEach(() => {
    browserStub = sinon.stub(browser, 'loading')
    browserStub = sinon.stub(browser, 'loaded')
    browserRedirectStub = sinon.stub(browser, 'redirect')

    function fakeGetResolution (value) {
      return {
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': value
          })
        }
      }
    }
    ajaxGetStub = sinon.stub(ajax, 'get')
    ajaxGetStub
      .withArgs(`${endpoints.serviceProviderNeeds}/${needData.id}`)
      .returns(fakeGetResolution(needData))
    ajaxGetStub
      .withArgs(`${endpoints.serviceProviderNeeds}/${needData.id}/offers-to-help`)
      .returns(fakeGetResolution(needResponses))

    var urlParamsStub = sinon.stub(getUrlParameter, 'parameter')
    urlParamsStub.withArgs('providerId').returns('albert-kennedy-trust')
    urlParamsStub.withArgs('needId').returns(needData.id)
    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
    getUrlParameter.parameter.restore()
    browser.redirect.restore()
  })

  it('should set editNeedUrl', () => {
    expect(model.need().editNeedUrl).toEqual(adminurls.serviceProviderNeedsEdit + '?providerId=albert-kennedy-trust&needId=56d8784092855610f88d492a')
  })

  it('should set need id', () => {
    expect(model.need().id()).toEqual('56d8784092855610f88d492a')
  })

  it('should set need service provider id', () => {
    expect(model.need().serviceProviderId).toEqual('albert-kennedy-trust')
  })

  it('should set decoded need description', () => {
    expect(model.need().description()).toEqual('men\'s shoes & socks')
  })

  it('should set need type', () => {
    expect(model.need().type()).toEqual('Money')
  })

  it('should set need reason', () => {
    expect(model.need().reason()).toEqual('we need \'em')
  })

  it('should set need moreInfoUrl', () => {
    expect(model.need().moreInfoUrl()).toEqual('http://www.wang.com')
  })

  it('should set need postcode', () => {
    expect(model.need().postcode()).toEqual('m1 3ly')
  })

  it('should set need instructions', () => {
    expect(model.need().instructions()).toEqual('instructions')
  })

  it('should set need email', () => {
    expect(model.need().email()).toEqual('email')
  })

  it('should set need donationAmountInPounds', () => {
    expect(model.need().donationAmountInPounds()).toEqual(1)
  })

  it('should set need donationUrl', () => {
    expect(model.need().donationUrl()).toEqual('http://www.donationUrl.com')
  })

  it('should set need keywords', () => {
    expect(model.need().keywords()).toEqual('keywordA, keywordB, keywordC')
  })

  it('should tell browser dataLoaded', () => {
    expect(browserStub.calledOnce).toBeTruthy()
  })

  describe('save', () => {
    var ajaxPutStub

    beforeEach(() => {
      function fakePutResolution (value) {
        return {
          then: function (success, error) {
            success({
              'statusCode': 200
            })
          }
        }
      }
      ajaxPutStub = sinon.stub(ajax, 'put').withArgs(
        endpoints.getServiceProviders + '/albert-kennedy-trust/needs/56d8784092855610f88d492a',
        {
          'Description': 'men\'s shoes & socks',
          'Type': 'Money',
          'Reason': 'we need \'em',
          'MoreInfoUrl': 'http://www.wang.com',
          'Postcode': 'm1 3ly',
          'Instructions': 'instructions',
          'Email': 'email',
          'DonationAmountInPounds': 1,
          'DonationUrl': 'http://www.donationUrl.com',
          'Keywords': ['keywordA', 'keywordB', 'keywordC'],
          'CustomMessage': 'custom message'
        }
      ).returns(fakePutResolution())

      model.need().save()
    })

    afterEach(() => {
      ajax.put.restore()
    })

    it('should put to api', () => {
      expect(ajaxPutStub.calledOnce).toBeTruthy()
    })

    it('should redirect back to service provider', () => {
      var redirect = adminurls.serviceProviders + '?key=albert-kennedy-trust'
      expect(browserRedirectStub.withArgs(redirect).calledOnce).toBeTruthy()
    })
  })
})

const needData = {
  'id': '56d8784092855610f88d492a',
  'description': 'men&#39;s shoes &amp; socks',
  'serviceProviderId': 'albert-kennedy-trust',
  'type': 'Money',
  'reason': 'we need &#39;em',
  'moreInfoUrl': 'http://www.wang.com',
  'postcode': 'm1 3ly',
  'instructions': 'instructions',
  'email': 'email',
  'donationAmountInPounds': 1,
  'donationUrl': 'http://www.donationUrl.com',
  'keywords': ['keywordA', 'keywordB', 'keywordC'],
  'customMessage': 'custom message'
}

const needResponses = {
  helpOffers: 3
}
