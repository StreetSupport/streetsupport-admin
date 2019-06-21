/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const jsRoot = '../../../src/js/'
const ajax = require(`${jsRoot}ajax`)
const auth = require(`${jsRoot}auth`)
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
      .returns({
        then: function (success, _) {
          success({
            data: {
              items: userData
            }
          })
        }
      })
    sinon.stub(auth, 'isCityAdmin').returns(false)
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    sinon.stub(browser, 'pushHistory')
    sinon.stub(browser, 'search')

    sut = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    auth.isCityAdmin.restore()
    browser.loading.restore()
    browser.loaded.restore()
    browser.pushHistory.restore()
    browser.search.restore()
  })

  it('- should list users', () => {
    expect(sut.items().length).toEqual(2)
  })

  describe('- remove access', () => {
    let ajaxDelete = null

    beforeEach(() => {
      ajaxDelete = sinon.stub(ajax, 'delete')
      ajaxDelete.returns({
        then: function (success, _) {
          success({})
        }
      })

      browserLoadingStub.reset()
      browserLoadedStub.reset()

      sut.items()[0].removeAccess()
    })

    afterEach(() => {
      ajax.delete.restore()
    })

    it('- should show browser is loading', () => {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })

    it('- should send delete request', () => {
      const endpoint = ajaxDelete.getCalls()[0].args[0]
      expect(endpoint).toEqual(`${endpoints.users}/58ef63a5254ac6229c3d08f5`)
    })

    it('- should remove user from listing', () => {
      expect(sut.items().filter((u) => u.id() === userData[0].id).length).toEqual(0)
    })

    it('- should show browser is loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxDelete)).toBeTruthy()
    })
  })
})
