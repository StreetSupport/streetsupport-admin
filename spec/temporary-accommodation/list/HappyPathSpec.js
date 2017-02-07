/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const jsRoot = '../../../src/js/'
const ajax = require(`${jsRoot}ajax`)
const endpoints = require(`${jsRoot}api-endpoints`)
const browser = require(`${jsRoot}browser`)

describe('Temporary Accommodation Listing', () => {
  const Model = require(`${jsRoot}models/temporary-accommodation/list`)
  let sut = null
  let browserLoadingStub = null
  let ajaxGetStub = null

  beforeEach(() => {
    ajaxGetStub = sinon
      .stub(ajax, 'get')
      .withArgs(endpoints.temporaryAccommodation)
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': {
              embedded: {
                items: [
                  {
                    'key': 'albert-kennedy-trust',
                    'name': 'Albert Kennedy Trust',
                    'isPublished': true
                  },
                  {
                    'key': 'coffee4craig',
                    'name': 'Coffee4Craig',
                    'isPublished': false
                  }
                ]
              }
            }
          })
        }
      })
    browserLoadingStub = sinon.stub(browser, 'loading')

    sut = new Model()
    sut.init()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
  })

  it('- should show user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('- should get accom listing', () => {
    expect(ajaxGetStub.calledAfter(browserLoadingStub)).toBeTruthy()
  })
})
