/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const ajax = require('../../../src/js/ajax')
const auth = require('../../../src/js/auth')
const endpoints = require('../../../src/js/api-endpoints')
const browser = require('../../../src/js/browser')

describe('Content Page - Add', () => {
  var Model = require('../../../src/js/models/content-pages/add')
  var model
  let ajaxPostStub,
    browserLoadingStub,
    browserLoadedStub

  beforeEach(() => {
    sinon.stub(auth, 'isCityAdmin').returns(false)
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    const postResolution = {
      then: function (success, error) {
        success({
          'statusCode': 201,
          'data': {
            id: 12345
          }
        })
      }
    }
    ajaxPostStub = sinon.stub(ajax, 'postFile')
    ajaxPostStub.returns(postResolution)

    global.window.document = { 'querySelector': () => {
      return { 
        'addEventListener': () => {}
      }
    }}

    model = new Model()
  })

  afterEach(() => {
    ajax.postFile.restore()
    auth.isCityAdmin.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('- should set tags to empty array', () => {
    expect(model.tags()).toEqual([])
  })

  // TODO: We should find out how to mock Blob because we get an error: ReferenceError: Blob is not defined
  // describe('- save', () => {
  //   beforeEach(() => {
  //     model.title('title')
  //     model.type('advice')
  //     model.body('body')
  //     model.tags('tag-a , tag-b, tag-c ')
  //     model.sortPosition(123)
  //     model.parentScenarioId('5f69bf51a27c1c3b84fe6001')
  //     model.files = []
  //     model.save()
  //   })

  //   it('should post to api content-pages endpoint', () => {
  //     const endpoint = ajaxPostStub.getCalls()[0].args[0]
  //     expect(endpoint).toEqual(endpoints.contentPages)
  //     expect(ajaxPostStub.calledAfter(browserLoadingStub)).toBeTruthy()
  //   })

  //   it('should show item has been created', () => {
  //     expect(model.itemCreated()).toBeTruthy()
  //   })

  //   it('should show loaded', () => {
  //     expect(browserLoadedStub.calledAfter(ajaxPostStub)).toBeTruthy()
  //   })
  // })
})
