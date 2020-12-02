/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const adminUrls = require(`../../../src/js/admin-urls`)
const ajax = require(`../../../src/js/ajax`)
const auth = require(`../../../src/js/auth`)
const endpoints = require(`../../../src/js/api-endpoints`)
const browser = require(`../../../src/js/browser`)
const Model = require(`../../../src/js/models/accommodation/list`)
const querystring = require('../../../src/js/get-url-parameter')

import { cities } from '../../../src/data/generated/supported-cities'

describe('Accommodation Listing', () => {
  let sut = null
  let browserLoadingStub = null
  let browserLoadedStub = null
  let ajaxGetStub = null
  let authGetLocationsForUserStub = null

  beforeEach(() => {
    ajaxGetStub = sinon
      .stub(ajax, 'get')
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': accomData
          })
        }
      })
    sinon.stub(auth, 'canSeeReviews')
    sinon.stub(auth, 'isCityAdmin')
    sinon.stub(auth, 'isSuperAdmin')
    authGetLocationsForUserStub = sinon.stub(auth, 'getLocationsForUser').returns(cities)
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    sinon.stub(browser, 'pushHistory')
    sinon.stub(browser, 'search')
    sinon.stub(querystring, 'parameter')

    sut = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    auth.canSeeReviews.restore()
    auth.isCityAdmin.restore()
    auth.isSuperAdmin.restore()
    auth.getLocationsForUser.restore()
    browser.loading.restore()
    browser.loaded.restore()
    browser.pushHistory.restore()
    browser.search.restore()
    querystring.parameter.restore()
  })

  it('- should show user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('- should get accom listing', () => {
    const expected = `${endpoints.temporaryAccommodation}?pageSize=10&index=0`
    expect(ajaxGetStub.calledAfter(browserLoadingStub)).toBeTruthy()
    expect(ajaxGetStub.getCalls()[0].args[0].slice(0, ajaxGetStub.getCalls()[0].args[0].indexOf('&unique'))).toEqual(expected)
  })

  it('- should get cities', () => {
    expect(authGetLocationsForUserStub.getCalls()[0].args[0]).toEqual(undefined)
    expect(sut.cities().length).toEqual(cities.length)
  })

  it('- should show user it has loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })

  it('- should populate accommodation entries', () => {
    expect(sut.items().length).toEqual(3)
  })

  it('- should set edit url', () => {
    expect(sut.items()[0].editUrl).toEqual(`${adminUrls.temporaryAccommodation}/edit?id=${accomData.items[0].id}`)
  })

  it('- should set add reviews url', () => {
    expect(sut.items()[0].addReviewsUrl).toEqual(`${adminUrls.temporaryAccommodation}/reviews/add?id=${accomData.items[0].id}`)
  })

  it('- should set reviews listing url', () => {
    expect(sut.items()[0].reviewsListingUrl).toEqual(`${adminUrls.temporaryAccommodation}/reviews?id=${accomData.items[0].id}`)
  })

  it('- should set can add provider admin if service provider id not set', () => {
    expect(sut.items()[0].canAddProviderAdmin).toBeTruthy()
  })

  it('- should set cannot add provider admin if service provider id is set', () => {
    expect(sut.items()[1].canAddProviderAdmin).toBeFalsy()
  })
})

const accomData = {
  'links': {
    'next': '/v1/accommodation?index=4',
    'prev': null,
    'self': '/v1/accommodation?index=0'
  },
  'items': [
    {
      'id': '589a08ad6a38c32e883f26dg',
      'name': 'test1',
      'additionalInfo': 'info',
      'email': 'test@test.com',
      'telephone': '234728934',
      'street1': '1',
      'city': 'city',
      'postcode': 'm13fy',
      'latitude': 0,
      'longitude': 0,
      'serviceProviderId': null
    },
    {
      'id': '589a08ad6a38c32e883f26dh',
      'name': 'test2',
      'additionalInfo': 'info',
      'email': 'test@test.com',
      'telephone': '234728934',
      'street1': '1',
      'city': 'city',
      'postcode': 'm13fy',
      'latitude': 0,
      'longitude': 0,
      'serviceProviderId': 'service-provider-id'
    },
    {
      'id': '589a08ad6a38c32e883f26di',
      'name': 'test3',
      'additionalInfo': 'info',
      'email': 'test@test.com',
      'telephone': '234728934',
      'street1': '1',
      'city': 'city',
      'postcode': 'm13fy',
      'latitude': 0,
      'longitude': 0
    }
  ],
  'total': 4
}
