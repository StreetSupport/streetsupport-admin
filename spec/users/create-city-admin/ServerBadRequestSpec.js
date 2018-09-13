/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const jsRoot = '../../../src/js/'
const ajax = require(`${jsRoot}ajax`)
const browser = require(`${jsRoot}browser`)
const validation = require(`${jsRoot}validation`)

describe('Accommodation - add - server returns bad request', () => {
  const Model = require(`${jsRoot}models/users/create-city-admin`)
  let sut = null
  let browserLoadingStub = null
  let browserLoadedStub = null

  beforeEach(() => {
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    sinon.stub(browser, 'scrollTo')

    sut = new Model()
    sut.init()
  })

  afterEach(() => {
    browser.loading.restore()
    browser.loaded.restore()
    browser.scrollTo.restore()
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
              'statusCode': 400,
              'data': {
                messages: [
                  'error 1',
                  'error 2'
                ]
              }
            })
          }
        })

      sut.formFields().email('test@email.com')
      sut.formFields().locationIds(['manchester', 'bury'])

      sut.save()
    })

    afterEach(() => {
      ajax.post.restore()
      validation.showErrors.restore()
    })

    it('- should show user it is loading', () => {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })

    it('- should show user it has loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxPostStub)).toBeTruthy()
    })

    it('- should not hide form', () => {
      expect(sut.formSubmitted()).toBeFalsy()
      expect(sut.formSubmissionNotSuccessful()).toBeTruthy()
    })

    it('- should not show success message', () => {
      expect(sut.formSubmissionSuccessful()).toBeFalsy()
    })

    it('- should show errors', () => {
      expect(sut.errors().length).toEqual(2)
      expect(sut.errors()[1]).toEqual('error 2')
    })
  })
})
