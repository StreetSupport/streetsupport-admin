/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const ajax = require('../../../src/js/ajax')
const auth = require('../../../src/js/auth')
const endpoints = require('../../../src/js/api-endpoints')
const browser = require('../../../src/js/browser')
const querystring = require(`../../../src/js/get-url-parameter`)

describe('Content Page - Edit', () => {
  var Model = require('../../../src/js/models/content-pages/edit')
  var model
  let ajaxGetStub,
    ajaxPutStub,
    browserLoadingStub,
    browserLoadedStub

  beforeEach(() => {
    sinon.stub(auth, 'isCityAdmin').returns(false)
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    sinon.stub(browser, 'redirect')

    sinon.stub(querystring, 'parameter')
         .withArgs('id')
         .returns(content.id)

    const getParentScenariosResolution = {
      then: function (success, error) {
        success({
          'statusCode': 201,
          'data': parentScenarios
        })
      }
    }

    const getResolution = {
      then: function (success, error) {
        success({
          'statusCode': 201,
          'data': content
        })
      }
    }
    ajaxGetStub = sinon.stub(ajax, 'get')
    ajaxGetStub.onCall(0).returns(getParentScenariosResolution)
    ajaxGetStub.returns(getResolution)

    const putResolution = {
      then: function (success, error) {
        success({
          'statusCode': 200,
          'data': {
            id: 12345
          }
        })
      }
    }
    ajaxPutStub = sinon.stub(ajax, 'putFile')
    ajaxPutStub.returns(putResolution)

    global.window.document = { 'querySelector': () => {
      return {
        'addEventListener': () => {}
      }
    }}

    model = new Model()
  })

  afterEach(() => {
    auth.isCityAdmin.restore()
    browser.loading.restore()
    browser.loaded.restore()
    browser.redirect.restore()
    querystring.parameter.restore()
    ajax.get.restore()
    ajax.putFile.restore()
  })

  it('- should set tags to empty string', () => {
    expect(model.tags()).not.toBeNull()
  })

  describe('- get', () => {
    beforeEach(() => {
      model.init()
    })

    it('should get from api parent-scenarios endpoint', () => {
      const endpoint = ajaxGetStub.getCalls()[0].args[0]
      expect(endpoint).toEqual(endpoints.parentScenarios)
      expect(ajaxGetStub.calledAfter(browserLoadingStub)).toBeTruthy()
    })

    it('should init parent scenarios', () => {
      expect(model.parentScenarios().length).toEqual(parentScenarios.length)
      expect(model.parentScenarios()[0].name).toEqual(parentScenarios[0].name)
    })

    it('should get from api content-pages endpoint', () => {
      const endpoint = ajaxGetStub.getCalls()[1].args[0]
      expect(endpoint.substring(0, endpoint.lastIndexOf('?'))).toEqual(`${endpoints.contentPages}/${content.id}`)
      expect(ajaxGetStub.calledAfter(browserLoadingStub)).toBeTruthy()
    })

    it('should init model', () => {
      expect(model.title()).toEqual(content.title)
      expect(model.body()).toEqual(content.body)
      expect(model.sortPosition()).toEqual(content.sortPosition)
      expect(model.parentScenarioId()).toEqual(content.parentScenarioId)
      expect(model.type()).toEqual(content.type)
      expect(model.tags()).toEqual(content.tags.join(','))
      expect(model.files()).toEqual(content.files)
    })

    it('should init parent scenarios', () => {
      expect(model.parentScenarios().length).toEqual(parentScenarios.length)
      expect(model.parentScenarios()[0].name).toEqual(parentScenarios[0].name)
    })

    // TODO: We should find out how to mock Blob because we get an error: ReferenceError: Blob is not defined
    // describe('- save', () => {
    //   beforeEach(() => {
    //     model.title('updated title')
    //     model.save()
    //   })

    //   it('should put to api content-pages endpoint', () => {
    //     const endpoint = ajaxPutStub.getCalls()[0].args[0]
    //     expect(endpoint).toEqual(`${endpoints.contentPages}/${content.id}`)
    //     expect(ajaxPutStub.calledAfter(browserLoadingStub)).toBeTruthy()
    //   })

    //   it('should put payload', () => {
    //     const payload = ajaxPutStub.getCalls()[0].args[1]
    //     const expected = {
    //       title: 'updated title',
    //       type: content.type,
    //       body: content.body,
    //       tags: content.tags,
    //       sortPosition: content.sortPosition,
    //       parentScenarioId: content.parentScenarioId,
    //       model.files: content.files
    //     }
    //     expect(payload).toEqual(expected)
    //   })

    //   it('should show loaded', () => {
    //     expect(browserLoadedStub.calledAfter(ajaxPutStub)).toBeTruthy()
    //   })
    // })
  })
})

var content = {
  'title': 'Test advice',
  'type': 'advice',
  'body': 'Test',
  'sortPosition': 999,
  'tags': ['test'],
  'parentScenarioId': '5f69bf51a27c1c3b84fe6448',
  'id': '5f858e140532b82be4b0b8b2',
  'files': [{'fileId': '5f69bf51a27c1c3b84fe6555', 'fileName': 'test.pdf'}]
}

var parentScenarios = [
  {
    'name': 'Parent scenario 1',
    'body': 'body',
    'sortPosition': 1000,
    'tags': ['families'],
    'id': '5f69bf51a27c1c3b84fe6447'
  }
]
