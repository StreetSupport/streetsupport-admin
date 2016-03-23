var sinon = require('sinon')
var ajax =      require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminUrls = require('../../src/js/admin-urls')
var browser =   require('../../src/js/browser')
var cookies =   require('../../src/js/cookies')
var getUrlParam = require('../../src/js/get-url-parameter')
var Model = require('../../src/js/models/volunteers/ContactVolunteerModel')

describe('Contact Volunteer', function () {
  var model
  var headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }
  var ajaxPostStub
  var browserLoadingStub
  var browserLoadedStub

  beforeEach(function () {
    var postContactVolunteerPromise = function () {
      return {
        then: function (success, error) {
          success({
            'status': 'created'
          })
        }
      }
    }

    ajaxPostStub = sinon.stub(ajax, 'post')
      .returns(postContactVolunteerPromise())

    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    sinon.stub(getUrlParam, 'parameter').withArgs('id').returns('56d0362c928556085cc569b3')

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    model = new Model()
    model.formModel().message('this is my message')
    model.submit()
  })

  afterEach(function () {
    ajax.post.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
    getUrlParam.parameter.restore()
  })

  it('should notify user it is loading' ,function () {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('should post to api', function () {
    var posted = ajaxPostStub.withArgs(
      endpoints.contactVolunteer,
      headers,
      {
        'Message': 'this is my message',
        'VolunteerId': '56d0362c928556085cc569b3'
      }
    ).calledOnce

    expect(posted).toBeTruthy()
  })

  it('should notify user it has loaded' ,function () {
    expect(browserLoadedStub.calledAfter(ajaxPostStub)).toBeTruthy()
  })

  it('should set isFormSubmitSuccessful to true' ,function () {
    expect(model.isFormSubmitSuccessful()).toBeTruthy()
  })
})
