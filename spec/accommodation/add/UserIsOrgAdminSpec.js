/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const jsRoot = '../../../src/js/'
const ajax = require(`${jsRoot}ajax`)
const endpoints = require(`${jsRoot}api-endpoints`)
const browser = require(`${jsRoot}browser`)
const cookies = require(`${jsRoot}cookies`)
const validation = require(`${jsRoot}validation`)

import { categories } from '../../../src/data/generated/service-categories'
import { supportTypes } from '../../../src/data/generated/support-types'
const auth = require(`${jsRoot}auth`)

describe('Accommodation - Add - org admin', () => {
  const Model = require(`${jsRoot}models/accommodation/add`)
  let sut = null
  let browserLoadingStub = null
  let browserLoadedStub = null

  beforeEach(() => {
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    sinon.stub(auth, 'providerAdminFor')
      .returns('the-users-service-provider-id')

    sut = new Model()
    sut.init()
  })

  afterEach(() => {
    browser.loading.restore()
    browser.loaded.restore()
    auth.providerAdminFor.restore()
  })

  it('- it should set list of accom types', () => {
    expect(sut.accommodationTypes().length).toEqual(categories.find((sc) => sc.key === 'accom').subCategories.length)
  })

  it('- should set a list of support types', () => {
    expect(sut.supportTypes().length).toEqual(supportTypes.length)
  })

  describe('- submit', () => {
    let ajaxPostStub = null

    beforeEach(() => {
      browserLoadingStub.reset()
      browserLoadedStub.reset()
      sinon.stub(validation, 'showErrors')

      sinon.stub(cookies, 'get').withArgs('session-token').returns('stored-session-token')

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

      sut.save()
    })

    afterEach(() => {
      ajax.post.restore()
      cookies.get.restore()
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
        'ServiceProviderId': 'the-users-service-provider-id',
        'Email': 'test@email.com',
        'Telephone': 'telephone',
        'AddressLine1': 'address line 1',
        'AddressLine2': 'address line 2',
        'AddressLine3': 'address line 3',
        'City': 'manchester',
        'Postcode': 'postcode'
      }
      const headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      const calledAsExpected = ajaxPostStub
        .withArgs(endpoint, headers, payload)
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
        const formFieldKeys = Object.keys(sut.formFields())
        formFieldKeys
          .forEach((k) => {
            expect(sut.formFields()[k]()).toEqual(null)
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
