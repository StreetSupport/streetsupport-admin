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
const Model = require(`../../../../src/js/models/accommodation/reviews/details`)

import { testData } from '../testData'
const reviewUnderTest = testData.embedded.reviews[0]

describe('Accommodation Listing - Details', () => {
  let sut = null

  beforeEach(() => {
    const queryStringStub = sinon.stub(querystring, 'parameter')
    queryStringStub.withArgs('accom-id').returns(testData.id)
    queryStringStub.withArgs('id').returns(reviewUnderTest.id)

    sinon
      .stub(ajax, 'get')
      .withArgs(`${endpoints.prefix(testData.links.self)}/reviews/${reviewUnderTest.id}`)
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': reviewUnderTest
          })
        }
      })

    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(cookies, 'get').returns('stored-session-token')

    sut = new Model()
    sut.init()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
    cookies.get.restore()
    querystring.parameter.restore()
  })

  it('should set review date', () => {
    expect(sut.review().idReadOnly()).toEqual(reviewUnderTest.id)
  })

  it('should set range values', () => {
    expect(sut.review().hasCentralHeating()).toEqual(reviewUnderTest.hasCentralHeating)
  })

  it('should set feedback name', () => {
    expect(sut.feedback().reviewerName()).toEqual('reviewer name')
  })
})
