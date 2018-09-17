/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const jsRoot = '../../../src/js/'
const ajax = require(`${jsRoot}ajax`)
const endpoints = require(`${jsRoot}api-endpoints`)
const browser = require(`${jsRoot}browser`)

const userData = [
  { 'id': '58ef63a5254ac6229c3d08f5', 'userName': 'superadmin', 'email': 'superadmin@ssn.com', 'claims': ['SuperAdmin'], 'isVerified': true, 'verificationExpiryDate': '0001-01-01T00:00:00.0000000Z', 'associatedAreaId': '' },
  { 'id': '5b30df1146e3db1c60867e61', 'userName': '74f0cf79-0de7-4c03-bc39-34787757faf0', 'email': 'vince+dev-mcradmin@streetsupport.net', 'claims': ['CityAdminFor:manchester', 'CityAdmin'], 'isVerified': false, 'verificationExpiryDate': '0001-01-01T00:00:00.0000000Z', 'associatedAreaId': '' }
]


describe('Users - listing', () => {
  const Model = require(`${jsRoot}models/users/Users`)
  let sut = null
  let browserLoadingStub = null
  let browserLoadedStub = null

  beforeEach(() => {
    sinon.stub(ajax, 'get')
      .withArgs(endpoints.users)
      .returns({
        then: function (success,) {
          success({
            data: userData
          })
        }
      })

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    sut = new Model()
    sut.init()
  })

  afterEach(() => {
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('- should list users', () => {
    expect(sut.users().length).toEqual(2)
  })

  describe('- remove access', () => {
    let ajaxDelete = null

    beforeEach(() => {
      ajaxDelete = sinon.stub(ajax, 'delete')
      ajaxDelete.returns({
        then: function (success,) {
          success({})
        }
      })

      browserLoadingStub.reset()
      browserLoadedStub.reset()

      sut.users()[0].removeAccess()
    })

    afterEach(() => {
      ajax.delete.restore()
    })

    it('- should show browser is loading', () => {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })

    it('- should send delete request', () => {
      const deleteRequestCalledAsExpected = ajaxDelete.withArgs(`${endpoints.users}/${userData[0].id}`).calledAfter(browserLoadingStub);
      expect(deleteRequestCalledAsExpected).toBeTruthy()
    })

    it('- should remove user from listing', () => {
      expect(sut.users().filter((u) => u.id() === userData[0].id).length).toEqual(0)
    })

    it('- should show browser is loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxDelete)).toBeTruthy()
    })
  })
})