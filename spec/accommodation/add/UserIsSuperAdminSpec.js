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
const validation = require(`${jsRoot}validation`)

import { categories } from '../../../src/data/generated/accommodation-categories'
import { supportTypes } from '../../../src/data/generated/support-types'
const auth = require(`${jsRoot}auth`)

describe('Accommodation - Add - super admin', () => {
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
  })

  afterEach(() => {
    ajax.get.restore()
    auth.providerAdminFor.restore()
    auth.getLocationsForUser.restore()
    auth.isSuperAdmin.restore()
    browser.loading.restore()
    browser.loaded.restore()
    querystring.parameter.restore()
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
  })

  describe('- submit', () => {
    let ajaxPostStub = null

    beforeEach(() => {
      browserLoadingStub.reset()
      browserLoadedStub.reset()
      sinon.stub(validation, 'showErrors')

      ajaxPostStub = sinon.stub(ajax, 'post')
        .returns({
          then: function (success, error) {
            success({
              'statusCode': 201,
              'data': 'newId'
            })
          }
        })

      sut.formFields().name('name')
      sut.formFields().contactName('contact name')
      sut.formFields().synopsis('synopsis')
      sut.formFields().description('description')
      sut.formFields().isOpenAccess(true)
      sut.formFields().accommodationType('accommodation type')
      sut.formFields().supportOffered(['support a', 'support b'])
      sut.formFields().email('test@email.com')
      sut.formFields().telephone('telephone')
      sut.formFields().addressLine1('address line 1')
      sut.formFields().addressLine2('address line 2')
      sut.formFields().addressLine3('address line 3')
      sut.formFields().city('manchester')
      sut.formFields().postcode('postcode')
      sut.formFields().locationId('manchester')
      sut.formFields().serviceProviderId('coffee4craig')

      sut.save()
    })

    afterEach(() => {
      ajax.post.restore()
      validation.showErrors.restore()
    })

    it('- should show user it is loading', () => {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })

    it('- should post form data to api', () => {
      const endpoint = endpoints.temporaryAccommodation
      const payload = {
        'Name': 'name',
        'ContactName': 'contact name',
        'Synopsis': 'synopsis',
        'Description': 'description',
        'IsOpenAccess': true,
        'AccommodationType': 'accommodation type',
        'SupportOffered': ['support a', 'support b'],
        'ServiceProviderId': 'coffee4craig',
        'Email': 'test@email.com',
        'Telephone': 'telephone',
        'AddressLine1': 'address line 1',
        'AddressLine2': 'address line 2',
        'AddressLine3': 'address line 3',
        'City': 'manchester',
        'Postcode': 'postcode',
        'LocationId': 'manchester',
        'AddressIsPubliclyHidden': false
      }
      const calledAsExpected = ajaxPostStub
        .withArgs(endpoint, payload)
        .calledAfter(browserLoadingStub)
      expect(calledAsExpected).toBeTruthy()
    })

    it('- should show user it has loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxPostStub)).toBeTruthy()
    })

    it('- should hide form', () => {
      expect(sut.formSubmitted()).toBeTruthy()
    })

    it('- should show success message', () => {
      expect(sut.formSubmissionSuccessful()).toBeTruthy()
    })

    describe('- add new', () => {
      beforeEach(() => {
        sut.reset()
      })

      it('- should reset the form', () => {
        Object.keys(sut.formFields())
          .forEach((k) => {
            expect(sut.formFields()[k]()).toEqual(null, {k, value: sut.formFields()[k]()})
          })
      })

      it('- should show form', () => {
        expect(sut.formSubmitted()).toBeFalsy()
      })

      it('- hide messages', () => {
        expect(sut.formSubmissionSuccessful()).toBeFalsy()
        expect(sut.formSubmissionNotSuccessful()).toBeFalsy()
      })
    })
  })
})

const providerData = { items: [
  { key: 'provider-a', name: 'Provider A&#39;s House' },
  { key: 'provider-b', name: 'Provider B' },
  { key: 'provider-c', name: 'Provider C' },
  { key: 'provider-d', name: 'Provider D' },
  { key: 'provider-e', name: 'Provider E' },
  { key: 'provider-f', name: 'Provider F' }
]}
