/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const ajax = require('../../src/js/ajax')
const browser = require('../../src/js/browser')
const cookies = require('../../src/js/cookies')
const getUrlParameter = require('../../src/js/get-url-parameter')

describe('Cancel Edit Service Provider General Details', () => {
  const Model = require('../../src/js/models/ServiceProvider')
  let model = null

  beforeEach(() => {
    let fakeResolved = {
      then: (success, _) => {
        success({
          'status': 200,
          'data': coffee4Craig()
        })
      }
    }

    sinon.stub(ajax, 'get').returns(fakeResolved)
    sinon.stub(cookies, 'get').returns('stored-session-token')
    sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    model = new Model()
    model.editGeneralDetails()

    model.serviceProvider().description('some new description')

    model.cancelEditGeneralDetails()
  })

  afterEach(() => {
    ajax.get.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should reset isEditingGeneralDetails to false', () => {
    expect(model.isEditingGeneralDetails()).toBeFalsy()
  })

  it('should restore description to its previous value', () => {
    expect(model.serviceProvider().description()).toEqual('initial description')
  })
})

const coffee4Craig = () => {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'description': 'initial description',
    'addresses': [],
    'providedServices': []
  }
}
