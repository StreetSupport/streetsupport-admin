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

import { cities } from '../../../src/data/generated/supported-cities'

describe('Accommodation Listing', () => {
  let sut = null
  let browserLoadingStub = null
  let browserLoadedStub = null
  let ajaxGetStub = null

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
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    sut = new Model()
    sut.init()
  })

  afterEach(() => {
    ajax.get.restore()
    auth.canSeeReviews.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('- should show user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('- should get accom listing', () => {
    expect(ajaxGetStub.withArgs(endpoints.temporaryAccommodation).calledAfter(browserLoadingStub)).toBeTruthy()
  })

  it('- should get cities', () => {
    expect(sut.cities().length).toEqual(cities.length)
  })

  it('- should show user it has loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })

  it('- should populate accommodation entries', () => {
    expect(sut.entries().length).toEqual(3)
  })

  it('- should set edit url', () => {
    expect(sut.entries()[0].editUrl).toEqual(`${adminUrls.temporaryAccommodation}/edit?id=${accomData.items[0].id}`)
  })

  it('- should set add reviews url', () => {
    expect(sut.entries()[0].addReviewsUrl).toEqual(`${adminUrls.temporaryAccommodation}/reviews/add?id=${accomData.items[0].id}`)
  })

  it('- should set reviews listing url', () => {
    expect(sut.entries()[0].reviewsListingUrl).toEqual(`${adminUrls.temporaryAccommodation}/reviews?id=${accomData.items[0].id}`)
  })

  it('- should display load more button', () => {
    expect(sut.canLoadMore()).toBeTruthy()
  })

  describe('- Load more', () => {
    beforeEach(() => {
      const endpoint = `${endpoints.temporaryAccommodation}?index=4`
      ajaxGetStub
        .withArgs(endpoint)
        .returns({
          then: function (success, error) {
            success({
              'statusCode': 200,
              'data': accomData2
            })
          }
        })

      ajaxGetStub.reset()
      browserLoadingStub.reset()
      browserLoadedStub.reset()

      sut.loadNext()
    })

    it('- should hide load more button', () => {
      expect(sut.canLoadMore()).toBeFalsy()
    })

    it('- should add the new items to the entries', () => {
      expect(sut.entries().length).toEqual(4)
    })
  })

  describe('- by city', () => {
    beforeEach(() => {
      browserLoadingStub.reset()
      browserLoadedStub.reset()

      const endpoint = `${endpoints.temporaryAccommodation}?cityId=manchester`
      ajaxGetStub
        .withArgs(endpoint)
        .returns({
          then: function (success, error) {
            success({
              'statusCode': 200,
              'data': mancAccomData
            })
          }
        })

      sut.selectedCityFilter('manchester')
    })

    it('- should show user it is loading', () => {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })

    it('- should replace current accommodation list', () => {
      expect(sut.entries().length).toEqual(mancAccomData.items.length)
    })

    it('- should show user it has loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
    })

    it('- should reload all accommodation when reset to \'All\'', () => {
      sut.selectedCityFilter(null)
      expect(sut.entries().length).toEqual(accomData.items.length)
    })
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
      'longitude': 0
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
      'longitude': 0
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

const accomData2 = {
  'links': {
    'next': null,
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
      'longitude': 0
    }
  ],
  'total': 1
}

const mancAccomData = {
  'links': {
    'next': null,
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
      'longitude': 0
    },
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
      'longitude': 0
    }
  ],
  'total': 2
}
