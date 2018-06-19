/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const jsRoot = '../../../src/js/'
const ajax = require(`${jsRoot}ajax`)
const auth = require(`${jsRoot}auth`)
const validation = require(`${jsRoot}validation`)

describe('Accommodation - Add - No Address Line 1', () => {
  const Model = require(`${jsRoot}models/accommodation/add`)
  let sut = null
  let ajaxPostStub = null
  let validationStub = null

  beforeEach(() => {
    validationStub = sinon.stub(validation, 'showErrors')

    ajaxPostStub = sinon.stub(ajax, 'post')
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 201,
            'data': 'newId'
          })
        }
      })
    sinon.stub(auth, 'providerAdminFor')
    sinon.stub(auth, 'isSuperAdmin')

    sut = new Model()
    sut.init()

    sut.formFields().description('description')
    sut.formFields().email('test@email.com')
    sut.formFields().telephone('telephone')
    sut.formFields().addressLine2('address line 2')
    sut.formFields().addressLine3('address line 3')
    sut.formFields().city('manchester')
    sut.formFields().postcode('postcode')

    sut.save()
  })

  afterEach(() => {
    ajax.post.restore()
    auth.providerAdminFor.restore()
    auth.isSuperAdmin.restore()
    validation.showErrors.restore()
  })

  it('- should not post form data to api', () => {
    expect(ajaxPostStub.called).toBeFalsy()
  })

  it('- should show errors', () => {
    expect(validationStub.calledOnce).toBeTruthy()
  })
})
