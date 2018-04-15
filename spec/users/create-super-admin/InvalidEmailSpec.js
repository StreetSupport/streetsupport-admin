/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const jsRoot = '../../../src/js/'
const ajax = require(`${jsRoot}ajax`)
const cookies = require(`${jsRoot}cookies`)
const validation = require(`${jsRoot}validation`)

describe('Users - Create Super Admin - Invalid Email', () => {
  const Model = require(`${jsRoot}models/users/create-super-admin`)
  let sut = null
  let ajaxPostStub = null
  let validationStub = null

  beforeEach(() => {
    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

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

    sut = new Model()
    sut.init()

    sut.formFields().email('email')

    sut.save()
  })

  afterEach(() => {
    ajax.post.restore()
    cookies.get.restore()
    validation.showErrors.restore()
  })

  it('- should not post form data to api', () => {
    expect(ajaxPostStub.called).toBeFalsy()
  })

  it('- should show errors', () => {
    expect(validationStub.calledOnce).toBeTruthy()
  })
})
