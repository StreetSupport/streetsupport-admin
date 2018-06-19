/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var getUrlParameter = require('../../src/js/get-url-parameter')

describe('Delete individual Need', () => {
  var Model = require('../../src/js/models/Need')
  var model
  var ajaxStub

  beforeEach(() => {
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(getUrlParameter, 'parameter').withArgs('key').returns('coffee4craig')
    model = new Model({
      id: 'abcde',
      description: 'description'
    })
    let fakeResolved = {
      then: (success, _) => {
        success({
          'status': 200,
          'data': {}
        })
      }
    }
    ajaxStub = sinon.stub(ajax, 'delete').returns(fakeResolved)

    model.deleteNeed()
  })

  afterEach(() => {
    browser.loading.restore()
    browser.loaded.restore()
    getUrlParameter.parameter.restore()
    ajax.delete.restore()
  })

  it('should delete need to api', () => {
    var endpoint = endpoints.getServiceProviders + '/coffee4craig/needs/abcde'
    var postAsExpected = ajaxStub.withArgs(endpoint).calledOnce
    expect(postAsExpected).toBeTruthy()
  })
})
