var sinon = require('sinon')
var ajax =      require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminUrls = require('../../src/js/admin-urls')
var browser =   require('../../src/js/browser')
var cookies =   require('../../src/js/cookies')
var Model = require('../../src/js/models/volunteers/ContactVolunteerModel')

describe('Contact Volunteer - No message', () => {
  var model
  var headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }
  var ajaxPostStub
  var browserLoadingStub
  var browserLoadedStub

  beforeEach(() => {
    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

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

  it('should keep isFormSubmitSuccessful as false' ,() => {
    expect(model.isFormSubmitSuccessful()).toBeFalsy()
  })
})
