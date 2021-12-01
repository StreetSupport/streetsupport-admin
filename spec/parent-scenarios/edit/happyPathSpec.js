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

describe('Parent Scenario - Edit', () => {
  var Model = require('../../../src/js/models/parent-scenarios/edit')
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
         .returns(parentScenario.id)

    const getResolution = {
      then: function (success, error) {
        success({
          'statusCode': 201,
          'data': parentScenario
        })
      }
    }
    ajaxGetStub = sinon.stub(ajax, 'get')
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
    ajaxPutStub = sinon.stub(ajax, 'put')
    ajaxPutStub.returns(putResolution)

    model = new Model()
  })

  afterEach(() => {
    auth.isCityAdmin.restore()
    browser.loading.restore()
    browser.loaded.restore()
    browser.redirect.restore()
    querystring.parameter.restore()
    ajax.get.restore()
    ajax.put.restore()
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
      expect(endpoint.substring(0, endpoint.lastIndexOf('?'))).toEqual(`${endpoints.parentScenarios}/${parentScenario.id}`)
      expect(ajaxGetStub.calledAfter(browserLoadingStub)).toBeTruthy()
    })

    it('should init model', () => {
      expect(model.name()).toEqual(parentScenario.name)
      expect(model.body()).toEqual(parentScenario.body)
      expect(model.sortPosition()).toEqual(parentScenario.sortPosition)
      expect(model.tags()).toEqual(parentScenario.tags.join(','))
    })

    describe('- save', () => {
      beforeEach(() => {
        model.name('updated name')
        model.save()
      })

      it('should put to api parent-scenarios endpoint', () => {
        const endpoint = ajaxPutStub.getCalls()[0].args[0]
        expect(endpoint).toEqual(`${endpoints.parentScenarios}/${parentScenario.id}`)
        expect(ajaxPutStub.calledAfter(browserLoadingStub)).toBeTruthy()
      })

      it('should post payload', () => {
        const payload = ajaxPutStub.getCalls()[0].args[1]
        const expected = {
          name: 'updated name',
          body: parentScenario.body,
          tags: parentScenario.tags,
          sortPosition: parentScenario.sortPosition
        }
        expect(payload).toEqual(expected)
      })

      it('should show loaded', () => {
        expect(browserLoadedStub.calledAfter(ajaxPutStub)).toBeTruthy()
      })
    })
  })
})

var parentScenario = {
  'name': 'Test parent scenario',
  'body': 'Test',
  'sortPosition': 999,
  'tags': ['test'],
  'id': '5f858e140532b82be4b0b8b2'
}
