/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
let ajax = require('../../src/js/ajax')
let browser = require('../../src/js/browser')
let getUrlParameter = require('../../src/js/get-url-parameter')

describe('Cancel Edit Service Provider Contact Details', () => {
  var Model = require('../../src/js/models/service-providers/ServiceProviderDetails')
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
    sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')
    sinon.stub(browser, 'loaded')
    sinon.stub(browser, 'loading')

    model = new Model()
    model.editContactDetails()

    model.serviceProvider().telephone('new telephone')
    model.serviceProvider().email('new email')
    model.serviceProvider().website('new website')
    model.serviceProvider().facebook('new facebook')
    model.serviceProvider().twitter('new twitter')

    model.cancelEditContactDetails()
  })

  afterEach(() => {
    ajax.get.restore()
    getUrlParameter.parameter.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should reset isEditingContactDetails to false', () => {
    expect(model.isEditingContactDetails()).toBeFalsy()
  })

  it('should restore description to its previous value', () => {
    expect(model.serviceProvider().telephone()).toEqual('initial telephone')
    expect(model.serviceProvider().email()).toEqual('initial email')
    expect(model.serviceProvider().website()).toEqual('initial website')
    expect(model.serviceProvider().facebook()).toEqual('initial facebook')
    expect(model.serviceProvider().twitter()).toEqual('initial twitter')
  })
})

function coffee4Craig () {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'email': 'initial email',
    'telephone': 'initial telephone',
    'website': 'initial website',
    'facebook': 'initial facebook',
    'twitter': 'initial twitter',
    'addresses': [],
    'groupedServices': [],
    'providedServices': []
  }
}
