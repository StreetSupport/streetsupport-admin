/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')
var Model = require('../../src/js/models/volunteers/ContactVolunteerModel')

describe('Contact Volunteer - No message', () => {
  var model
  var ajaxPostStub

  beforeEach(() => {
    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')

    ajaxPostStub = sinon.stub(ajax, 'post')

    model = new Model()
    model.submit()
  })

  afterEach(() => {
    ajax.post.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should not post to api', () => {
    expect(ajaxPostStub.notCalled).toBeTruthy()
  })

  it('should keep isFormSubmitSuccessful as false', () => {
    expect(model.isFormSubmitSuccessful()).toBeFalsy()
  })
})
