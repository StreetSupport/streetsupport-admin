/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const ajax = require(`../../../../src/js/ajax`)
const endpoints = require(`../../../../src/js/api-endpoints`)
const browser = require(`../../../../src/js/browser`)
const cookies = require(`../../../../src/js/cookies`)
const querystring = require(`../../../../src/js/get-url-parameter`)
const Model = require(`../../../../src/js/models/temporary-accommodation/reviews/app`)

import { testData } from '../testData'

describe('Temporary Accommodation Listing - Delete', () => {
  let sut = null
  let browserLoadingStub = null
  let browserLoadedStub = null
  let ajaxDeleteStub = null

  const headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }

  beforeEach(() => {
    sinon.stub(querystring, 'parameter').withArgs('id').returns(testData.id)

    sinon
      .stub(ajax, 'get')
      .withArgs(`${endpoints.prefix(testData.links.self)}?expand=reviews`, headers)
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': testData
          })
        }
      })

    ajaxDeleteStub = sinon
      .stub(ajax, 'delete')
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200
          })
        }
      })

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    sinon.stub(cookies, 'get').returns('stored-session-token')

    sut = new Model()
    sut.init()

    browser.loading.reset()
    browser.loaded.reset()

    sut.items()[0].deleteItem()
  })

  afterEach(() => {
    ajax.get.restore()
    ajax.delete.restore()
    browser.loading.restore()
    browser.loaded.restore()
    cookies.get.restore()
    querystring.parameter.restore()
  })

  it('- should show user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('- should delete review', () => {
    const endpoint = `${endpoints.temporaryAccommodation}/${testData.id}/reviews/${testData.embedded.reviews[0].id}`
    const deleteCalledAsExpected = ajaxDeleteStub
      .withArgs(endpoint, headers)
      .calledAfter(browserLoadingStub)
    expect(deleteCalledAsExpected).toBeTruthy()
  })

  it('- should show user it has loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxDeleteStub)).toBeTruthy()
  })

  it('- should remove item from collection', () => {
    expect(sut.items().length).toEqual(1)
  })
})
