/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const jsRoot = '../../../src/js/'
const ajax = require(`${jsRoot}ajax`)
const endpoints = require(`${jsRoot}api-endpoints`)
const browser = require(`${jsRoot}browser`)
const querystring = require(`${jsRoot}get-url-parameter`)

import { categories } from '../../../src/data/generated/accommodation-categories'
import { supportTypes } from '../../../src/data/generated/support-types'
const auth = require(`${jsRoot}auth`)

describe('Accommodation - Add - org admin - no addresses', () => {
  const Model = require(`${jsRoot}models/accommodation/add`)
  let sut = null
  let ajaxGetStub = null
  let browserLoadingStub = null
  let browserLoadedStub = null

  beforeEach(() => {
    ajaxGetStub = sinon.stub(ajax, 'get')
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 201,
            'data': providerData
          })
        }
      })

    sinon.stub(auth, 'providerAdminFor').returns('')
    sinon.stub(auth, 'isSuperAdmin').returns(true)
    sinon.stub(auth, 'getLocationsForUser').returns([])
    sinon.stub(querystring, 'parameter')

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    sut = new Model()
    sut.init()
    sut.formFields().addressLine1('')
  })

  afterEach(() => {
    ajax.get.restore()
    auth.providerAdminFor.restore()
    auth.getLocationsForUser.restore()
    auth.isSuperAdmin.restore()
    browser.loading.restore()
    browser.loaded.restore()
    querystring.parameter.restore()
    browserLoadingStub.restore()
    browserLoadedStub.restore()
  })

  it('- it should set list of accom types', () => {
    expect(sut.accommodationTypes().length).toEqual(categories.length)
  })

  it('- should set a list of support types', () => {
    expect(sut.supportTypes().length).toEqual(supportTypes.length)
  })

  it('- should not get service providers immediately', () => {
    expect(ajaxGetStub.called).toBeFalsy()
  })

  describe('- change location', () => {
    beforeEach(() => {
      sut.formFields().locationId('manchester')
    })

    it('- should get service providers', () => {
      const endpoint = ajaxGetStub.getCalls()[0].args[0]
      expect(endpoint).toEqual(`${endpoints.getServiceProvidersv3}?location=manchester`)
    })

    it('- should set service providers', () => {
      expect(sut.serviceProviders().length).toEqual(providerData.items.length)
    })

    it('- should decode provider names', () => {
      expect(sut.serviceProviders()[0].name).toEqual('Provider A\'s House')
    })

    it('should populate addresses', () => {
      expect(sut.addresses().length).toEqual(0)
    })

    it('- should set hasAddresses', () => {
      expect(sut.hasAddresses()).toBeFalsy()
    })

    it('address street should start empty', () => {
      expect(sut.formFields().addressLine1()).toEqual('')
    })
  })
})

const providerData = { items: [
  { key: 'provider-a', name: 'Provider A&#39;s House', addresses: [] },
  { key: 'provider-b', name: 'Provider B', addresses: [] },
  { key: 'provider-c', name: 'Provider C', addresses: [] },
  { key: 'provider-d', name: 'Provider D', addresses: [] },
  { key: 'provider-e', name: 'Provider E', addresses: [] },
  { key: 'provider-f', name: 'Provider F', addresses: [] }
]}
