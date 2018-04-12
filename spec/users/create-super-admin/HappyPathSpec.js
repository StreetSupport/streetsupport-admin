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

describe('Users - Create Super Admin', () => {
  const Model = require(`${jsRoot}models/users/create-super-admin`)
  const headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }
  let sut = null
  let browserLoadingStub = null
  let browserLoadedStub = null

  beforeEach(() => {
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    sinon.stub(cookies, 'get').withArgs('session-token').returns('stored-session-token')

    sut = new Model()
    sut.init()
  })

  afterEach(() => {
    browser.loading.restore()
    browser.loaded.restore()
    cookies.get.restore()
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

      sut.formFields().email('test@email.com')

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
      const endpoint = endpoints.unverifiedSuperAdmins
      const payload = {
        'Email': 'test@email.com'
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
