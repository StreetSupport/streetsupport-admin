/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

import sinon from 'sinon'
import ajax from '../../src/js/ajax'
import endpoints from '../../src/js/api-endpoints'
import browser from '../../src/js/browser'
import getUrlParameter from '../../src/js/get-url-parameter'

import Model from '../../src/js/models/service-provider-needs/EditCategories'

describe('Editing Service Provider Need Categories', () => {
  let model = null
  let ajaxGetStub = null
  let browserLoadingStub = null
  let browserLoadedStub = null

  beforeEach(() => {
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    ajaxGetStub = sinon
      .stub(ajax, 'get')
    ajaxGetStub
      .withArgs(endpoints.needCategories)
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': catData
          })
        }
      })
    ajaxGetStub
      .withArgs(endpoints.getServiceProviders + '/albert-kennedy-trust')
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': providerData
          })
        }
      })
    sinon
      .stub(getUrlParameter, 'parameter')
      .withArgs('providerId')
      .returns('albert-kennedy-trust')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    getUrlParameter.parameter.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('- Should notify user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
    expect(browserLoadingStub.calledBefore(ajaxGetStub)).toBeTruthy()
  })

  it('- Should list categories', () => {
    expect(model.categories().length).toEqual(10)
  })

  it('- Should notify user it is loaded', () => {
    expect(browserLoadedStub.calledAfter(browserLoadingStub)).toBeTruthy()
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })

  it('- Should set ticked categories', () => {
    expect(model.categories().filter((c) => !c.isChecked).length).toEqual(8)
    expect(model.categories().filter((c) => c.key === 'food-and-drink')).toBeTruthy()
    expect(model.categories().filter((c) => c.key === 'services')).toBeTruthy()
  })
})

const catData = [
  {
    'key': 'food-and-drink',
    'value': 'Food and Drink'
  },
  {
    'key': 'toiletries',
    'value': 'Toiletries'
  },
  {
    'key': 'clothes',
    'value': 'Clothes'
  },
  {
    'key': 'materials-for-activities',
    'value': 'Materials for Activities'
  },
  {
    'key': 'services',
    'value': 'Services (printing etc)'
  },
  {
    'key': 'furniture',
    'value': 'Furniture'
  },
  {
    'key': 'bedding',
    'value': 'Bedding'
  },
  {
    'key': 'cleaning-materials',
    'value': 'Cleaning Materials'
  },
  {
    'key': 'kitchenware',
    'value': 'Kitchenware'
  },
  {
    'key': 'electrical-items',
    'value': 'Electrical Items'
  }
]

const providerData = {
  'key': 'albert-kennedy-trust',
  'needCategories': ['food-and-drink', 'services']
}
