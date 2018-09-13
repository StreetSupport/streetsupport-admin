/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const jsRoot = '../../../src/js/'
const ajax = require(`${jsRoot}ajax`)
const validation = require(`${jsRoot}validation`)

describe('Accommodation - Add - No City', () => {
  const Model = require(`${jsRoot}models/users/create-city-admin`)
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

    sut = new Model()
    sut.init()

    sut.formFields().email('test@email.com')
    sut.formFields().locationIds([])

    sut.save()
  })

  afterEach(() => {
    ajax.post.restore()
    validation.showErrors.restore()
  })

  it('- should not post form data to api', () => {
    expect(ajaxPostStub.called).toBeFalsy()
  })

  it('- should show errors', () => {
    expect(validationStub.calledOnce).toBeTruthy()
  })
})
