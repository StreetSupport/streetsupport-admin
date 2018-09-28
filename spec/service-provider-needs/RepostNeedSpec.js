/*
global describe, beforeEach, afterEach, it, expect
*/
import moment from 'moment'
import sinon from 'sinon'

import Need from '../../src/js/models/Need'
import ajax from '../../src/js/ajax'
import browser from '../../src/js/browser'
import endpoints from '../../src/js/api-endpoints'
import querystring from '../../src/js/get-url-parameter'

describe('Need - Reposting', () => {
  beforeEach(() => {
    sinon.stub(ajax, 'get').returns({
      then: (success, _) => {
        success({
          'status': 200,
          'data': {
            helpOffers: 3
          }
        })
      }
    })
  })

  afterEach(() => {
    ajax.get.restore()
  })

  describe('Need - neededDate is within current week', () => {
    let sut = null

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
      'customMessage': 'custom message',
      'neededDate': moment().toISOString()
    }

    beforeEach(() => {
      sut = new Need(needData)
    })

    it('should set canRepost to false', () => {
      expect(sut.canRepost()).toBeFalsy()
    })
  })

  describe('Need - neededDate is older than a week', () => {
    let sut = null

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
      'customMessage': 'custom message',
      'neededDate': moment().add(-8, 'day').toISOString()
    }

    beforeEach(() => {
      sut = new Need(needData)
    })

    it('should set canRepost to true', () => {
      expect(sut.canRepost()).toBeTruthy()
    })
  })

  describe('Need - reposting', () => {
    let sut = null
    let browserLoadingStub = null
    let browserLoadedStub = null
    let ajaxPutStub = null

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
      'customMessage': 'custom message',
      'neededDate': moment().add(8, 'day').toISOString()
    }

    const fakePutResolution = {
      then: function (success, error) {
        success({
          'statusCode': 200
        })
      }
    }

    beforeEach(() => {
      browserLoadingStub = sinon.stub(browser, 'loading')
      browserLoadedStub = sinon.stub(browser, 'loaded')

      ajaxPutStub = sinon.stub(ajax, 'put')
        .returns(fakePutResolution)

      sinon.stub(querystring, 'parameter')
        .withArgs('id')
        .returns(needData.id)

      sut = new Need(needData)
      sut.repostNeed()
    })

    afterEach(() => {
      ajax.put.restore()
      browser.loading.restore()
      browser.loaded.restore()
      querystring.parameter.restore()
    })

    it('should notify user it is loading', () => {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })

    it('should put to api', () => {
      expect(ajaxPutStub.calledAfter(browserLoadingStub)).toBeTruthy()
      const putArgs = ajax.put.getCall(0).args
      expect(putArgs[0]).toEqual(endpoints.getServiceProviders + '/albert-kennedy-trust/needs/56d8784092855610f88d492a/neededDate')
      expect(moment(putArgs[1].NeededDate).diff(moment(), 'days')).toEqual(0)
    })

    it('should notify user it has loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxPutStub)).toBeTruthy()
    })

    it('should update neededDate', () => {
      expect(sut.neededDateReadOnly().diff(moment(), 'days')).toEqual(0)
    })
  })
})
