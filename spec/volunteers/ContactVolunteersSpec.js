var sinon = require('sinon')
var ajax =      require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminUrls = require('../../src/js/admin-urls')
var browser =   require('../../src/js/browser')
var cookies =   require('../../src/js/cookies')
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

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    model = new Model()
    model.message('this is my message')
    model.submit()
  })

  afterEach(function () {
    ajax.post.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should notify user it is loading' ,function () {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('should post to api', function () {
    var posted = ajaxPostStub.withArgs(
      endpoints.contactVolunteer,
      headers,
      {
        'Message': 'this is my message'
      }
    ).calledOnce

    expect(posted).toBeTruthy()
  })
})
