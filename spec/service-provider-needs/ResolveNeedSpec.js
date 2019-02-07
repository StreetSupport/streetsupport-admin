/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var getUrlParameter = require('../../src/js/get-url-parameter')

describe('Resolve Need', () => {
  const Model = require('../../src/js/models/Need')
  let model
  let ajaxStub

  beforeEach(() => {
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(getUrlParameter, 'parameter').withArgs('key').returns('coffee4craig')
    let fakeResolved = {
      then: (success, _) => {
        success({
          'status': 200,
          'data': {
            helpOffers: []
          }
        })
      }
    }
    ajaxStub = sinon.stub(ajax, 'patch').returns(fakeResolved)
    sinon.stub(ajax, 'get').returns(fakeResolved)

    model = new Model({
      id: 'abcde',
      description: 'description',
      serviceProviderId: 'coffee4craig'
    })
    model.resolveNeed()
  })

  afterEach(() => {
    browser.loading.restore()
    browser.loaded.restore()
    getUrlParameter.parameter.restore()
    ajax.patch.restore()
    ajax.get.restore()
  })

  it('should patch to api', () => {
    const endpoint = endpoints.getServiceProviders + '/coffee4craig/needs/abcde/is-resolved'
    const patchedAsExpected = ajaxStub.withArgs(endpoint, { IsResolved: true }).calledOnce
    expect(patchedAsExpected).toBeTruthy()
  })
})
