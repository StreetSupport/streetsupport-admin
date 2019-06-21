/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const ajax = require('../../src/js/ajax')
const auth = require('../../src/js/auth')
const browser = require('../../src/js/browser')
const data = require('./serviceProviderData')

describe('Service Providers - search - from querystring', () => {
  const Model = require('../../src/js/models/service-providers/listing')
  let sut,
    stubbedApi

  beforeEach(() => {
    const fakeResolved = {
      then: function (success, error) {
        success({
          'status': 200,
          'data': {
            items: data,
            total: 123
          }
        })
      }
    }

    stubbedApi = sinon.stub(ajax, 'get')
    stubbedApi.returns(fakeResolved)
    sinon.stub(auth, 'getLocationsForUser').returns([])
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(browser, 'pushHistory')
    sinon.stub(browser, 'search').returns('?pageSize=10&index=5&name=street&isVerified=true&isPublished=true&foo=bar')

    sut = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    auth.getLocationsForUser.restore()
    browser.loading.restore()
    browser.loaded.restore()
    browser.pushHistory.restore()
    browser.search.restore()
  })

  it('- should request with expected filters', () => {
    var expected = {
      pageSize: '10',
      index: '5',
      isVerified: 'true',
      isPublished: 'true',
      name: 'street'
    }
    var actual = {}
    stubbedApi.firstCall.args[0]
      .split('?')[1]
      .split('&')
      .forEach((kv) => {
        const [key, value] = kv.split('=')
        actual[key] = value
      })
    expect(actual).toEqual(expected)
  })

  it('- should set the appropriate filters', () => {
    expect(sut.nameToFilterOn()).toEqual('street')
    expect(sut.filterOnIsVerified()).toBeTruthy()
    expect(sut.filterOnIsPublished()).toBeTruthy()
  })

  it('- should set the pagination', () => {
    // expect(sut.pagination.pageSize).toEqual(12)
    expect(sut.pagination.index).toEqual(5)
  })
})
