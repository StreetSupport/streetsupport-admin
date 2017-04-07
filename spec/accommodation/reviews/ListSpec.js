/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const ajax = require(`../../../src/js/ajax`)
const endpoints = require(`../../../src/js/api-endpoints`)
const browser = require(`../../../src/js/browser`)
const cookies = require(`../../../src/js/cookies`)
const querystring = require(`../../../src/js/get-url-parameter`)
const Model = require(`../../../src/js/models/accommodation/reviews/list`)
import { testData } from './testData'

describe('Accommodation Listing', () => {
  let sut = null
  let browserLoadingStub = null
  let browserLoadedStub = null
  let ajaxGetStub = null

  const headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }

  beforeEach(() => {
    sinon.stub(querystring, 'parameter').withArgs('id').returns(testData.id)

    ajaxGetStub = sinon.stub(ajax, 'get')
    ajaxGetStub
      .withArgs(`${endpoints.prefix(testData.links.self)}?expand=reviews`, headers)
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': testData
          })
        }
      })

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    sinon.stub(cookies, 'get').returns('stored-session-token')

    browser.loading.reset()
    browser.loaded.reset()

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

  it('- should show user it is loading', () => {
    expect(browserLoadingStub.calledBefore(ajaxGetStub)).toBeTruthy()
  })

  it('- should show user it has loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })

  it('- should set review\'s creation date', () => {
    expect(sut.items()[0].formFields().documentCreationDateReadOnly()).toEqual('2017-02-17')
  })

  it('- should set accom\'s address', () => {
    expect(sut.address()).toEqual('test 1, manchester, M3 4BD')
  })
})
