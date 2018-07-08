/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')
const ajax = require('../../src/js/ajax')
const browser = require('../../src/js/browser')
const getUrlParameter = require('../../src/js/get-url-parameter')
const spTags = require('../../src/js/serviceProviderTags')

describe('Cancel Edit Service Provider General Details', () => {
  const Model = require('../../src/js/models/service-providers/ServiceProviderDetails')
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
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(spTags, 'all').returns([
      { id: 'tag-a', name: 'Tag A' },
      { id: 'tag-b', name: 'Tag B' },
      { id: 'tag-c', name: 'Tag C' },
      { id: 'tag-d', name: 'Tag D' },
      { id: 'tag-e', name: 'Tag E' }
    ])

    model = new Model()
    model.editGeneralDetails()

    model.serviceProvider().name('some new name')
    model.serviceProvider().shortDescription('some new short description')
    model.serviceProvider().description('some new description')
    model.serviceProvider().tags()[0].isSelected(false)

    model.cancelEditGeneralDetails()
  })

  afterEach(() => {
    ajax.get.restore()
    getUrlParameter.parameter.restore()
    browser.loading.restore()
    browser.loaded.restore()
    spTags.all.restore()
  })

  it('should reset isEditingGeneralDetails to false', () => {
    expect(model.isEditingGeneralDetails()).toBeFalsy()
  })

  it('should restore name to its previous value', () => {
    expect(model.serviceProvider().name()).toEqual('Coffee 4 Craig')
  })

  it('should restore short description to its previous value', () => {
    expect(model.serviceProvider().shortDescription()).toEqual('initial short description')
  })

  it('should restore description to its previous value', () => {
    expect(model.serviceProvider().description()).toEqual('initial description')
  })

  it('should restore tags to previous values', () => {
    expect(model.serviceProvider().tags()[0].isSelected()).toBeTruthy()
    expect(model.serviceProvider().tags()[1].isSelected()).toBeFalsy()
    expect(model.serviceProvider().tags()[2].isSelected()).toBeTruthy()
    expect(model.serviceProvider().tags()[3].isSelected()).toBeTruthy()
    expect(model.serviceProvider().tags()[4].isSelected()).toBeFalsy()
  })

  it('should restore donation url to its previous value', () => {
    expect(model.serviceProvider().donationUrl()).toEqual('http://initial-donation.com')
  })

  it('should restore donation description to its previous value', () => {
    expect(model.serviceProvider().donationDescription()).toEqual('initial donation description')
  })
})

const coffee4Craig = () => {
  return {
    'key': 'coffee4craig',
    'name': 'Coffee 4 Craig',
    'shortDescription': 'initial short description',
    'description': 'initial description',
    'donationUrl': 'http://initial-donation.com',
    'donationDescription': 'initial donation description',
    'addresses': [],
    'groupedServices': [],
    'providedServices': [],
    'tags': ['tag-a', 'tag-c', 'tag-d']
  }
}
