/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const jsRoot = '../../../src/js/'
const ajax = require(`${jsRoot}ajax`)
const browser = require(`${jsRoot}browser`)
const cookies = require(`${jsRoot}cookies`)
const validation = require(`${jsRoot}validation`)
const auth = require(`${jsRoot}auth`)

describe('Accommodation - add - server returns bad request', () => {
  const Model = require(`${jsRoot}models/accommodation/add`)
  let sut = null
  let browserLoadingStub = null
  let browserLoadedStub = null

  beforeEach(() => {
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    sinon.stub(browser, 'scrollTo')
    sinon.stub(auth, 'providerAdminFor').returns('')
    sinon.stub(auth, 'isSuperAdmin').returns(false)

    sut = new Model()
    sut.init()
  })

  afterEach(() => {
    auth.providerAdminFor.restore()
    auth.isSuperAdmin.restore()
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

      sinon.stub(cookies, 'get').withArgs('session-token').returns('stored-session-token')

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

      sut.formFields().name('name')
      sut.formFields().contactName('contact name')
      sut.formFields().description('description')
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
