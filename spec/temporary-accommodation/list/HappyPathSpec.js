/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const adminUrls = require(`../../../src/js/admin-urls`)
const ajax = require(`../../../src/js/ajax`)
const endpoints = require(`../../../src/js/api-endpoints`)
const browser = require(`../../../src/js/browser`)
const cookies = require(`../../../src/js/cookies`)
const Model = require(`../../../src/js/models/temporary-accommodation/list`)

describe('Temporary Accommodation Listing', () => {
  let sut = null
  let browserLoadingStub = null
  let browserLoadedStub = null
  let ajaxGetStub = null

  beforeEach(() => {
    const headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }
    ajaxGetStub = sinon
      .stub(ajax, 'get')
      .withArgs(endpoints.temporaryAccommodation, headers)
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': accomData
          })
        }
      })
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    sinon.stub(cookies, 'get').returns('stored-session-token')

    sut = new Model()
    sut.init()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
    cookies.get.restore()
  })

  it('- should show user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('- should get accom listing', () => {
    const headers = {
      'content-type': 'application/json',
      'session-token': 'stored-session-token'
    }
    expect(ajaxGetStub.withArgs(endpoints.temporaryAccommodation, headers).calledAfter(browserLoadingStub)).toBeTruthy()
  })

  it('- should show user it has loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })

  it('- should populate accommodation entries', () => {
    expect(sut.entries().length).toEqual(3)
  })

  it('- should set edit url', () => {
    expect(sut.entries()[0].editUrl).toEqual(`${adminUrls.temporaryAccommodation}/edit?id=${accomData.embedded.items[0].id}`)
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
})

const accomData = { 'links': { 'next': '/v1/temporary-accommodation?index=4', 'prev': null, 'self': '/v1/temporary-accommodation?index=0' }, 'embedded': { 'items': [{ 'id': '589a08ad6a38c32e883f26dg', 'name': 'test 1', 'additionalInfo': 'info', 'email': 'test@test.com', 'telephone': '234728934', 'street1': '1', 'city': 'city', 'postcode': 'm1 3fy', 'latitude': 0, 'longitude': 0 }, { 'id': '589a08ad6a38c32e883f26dh', 'name': 'test 2', 'additionalInfo': 'info', 'email': 'test@test.com', 'telephone': '234728934', 'street1': '1', 'city': 'city', 'postcode': 'm1 3fy', 'latitude': 0, 'longitude': 0 }, { 'id': '589a08ad6a38c32e883f26di', 'name': 'test 3', 'additionalInfo': 'info', 'email': 'test@test.com', 'telephone': '234728934', 'street1': '1', 'city': 'city', 'postcode': 'm1 3fy', 'latitude': 0, 'longitude': 0 }] }, 'total': 4 }

const accomData2 = { 'links': { 'next': null, 'prev': null, 'self': '/v1/temporary-accommodation?index=0' }, 'embedded': { 'items': [{ 'id': '589a08ad6a38c32e883f26dg', 'name': 'test 1', 'additionalInfo': 'info', 'email': 'test@test.com', 'telephone': '234728934', 'street1': '1', 'city': 'city', 'postcode': 'm1 3fy', 'latitude': 0, 'longitude': 0 }] }, 'total': 4 }
