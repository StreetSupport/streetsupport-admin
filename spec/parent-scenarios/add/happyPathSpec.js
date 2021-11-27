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
  var Model = require('../../../src/js/models/parent-scenarios/add')
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
    ajaxPostStub = sinon.stub(ajax, 'post')
    ajaxPostStub.returns(postResolution)

    model = new Model()
  })

  afterEach(() => {
    ajax.post.restore()
    auth.isCityAdmin.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('- should set tags to empty string', () => {
    expect(model.tags()).not.toBeNull()
  })

  describe('- save', () => {
    beforeEach(() => {
      model.name('name')
      model.body('body')
      model.tags('tag-a , tag-b, tag-c ')
      model.sortPosition(123)
      model.save()
    })

    it('should post to api parent-scenarios endpoint', () => {
      const endpoint = ajaxPostStub.getCalls()[0].args[0]
      expect(endpoint).toEqual(endpoints.parentScenarios)
      expect(ajaxPostStub.calledAfter(browserLoadingStub)).toBeTruthy()
    })

    it('should post payload', () => {
      const payload = ajaxPostStub.getCalls()[0].args[1]
      const expected = {
        name: 'name',
        body: 'body',
        tags: ['tag-a', 'tag-b', 'tag-c'],
        sortPosition: 123
      }
      expect(payload).toEqual(expected)
    })

    it('should show item has been created', () => {
      expect(model.itemCreated()).toBeTruthy()
    })

    it('should show loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxPostStub)).toBeTruthy()
    })
  })
})
