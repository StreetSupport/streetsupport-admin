/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var getUrlParam = require('../../src/js/get-url-parameter')
var Model = require('../../src/js/models/volunteers/ContactVolunteerModel')

describe('Contact Offer of ', () => {
  var model
  var ajaxPostStub
  var browserLoadingStub
  var browserLoadedStub

  beforeEach(() => {
    var postContactVolunteerPromise = () => {
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
    sinon.stub(ajax, 'get')
      .returns({
        then: function (success, error) {
          success({
            'status': 'ok',
            'data': vol
          })
        }
      })

    sinon.stub(getUrlParam, 'parameter').withArgs('id').returns('56d0362c928556085cc569b3')

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    model = new Model()
    model.formModel().message('this is my message')
    model.submit()
  })

  afterEach(() => {
    ajax.post.restore()
    ajax.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
    getUrlParam.parameter.restore()
  })

  it('should notify user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('should post to api', () => {
    var endpoint = endpoints.volunteers + '/56d0362c928556085cc569b3/contact-requests'
    var payload = {
      'Message': 'this is my message',
      'ShouldSendEmail': true
    }
    var posted = ajaxPostStub.withArgs(endpoint, payload).calledOnce
    expect(posted).toBeTruthy()
  })

  it('should notify user it has loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxPostStub)).toBeTruthy()
  })

  it('should set isFormSubmitSuccessful to true', () => {
    expect(model.isFormSubmitSuccessful()).toBeTruthy()
  })
})

var vol = {
  'id': '970542130a4f951fb8abe4b9',
  'person': {
    'firstName': 'Vince',
    'lastName': 'Lee',
    'telephone': '',
    'email': 'vslee888+060416@gmail.com',
    'city': '',
    'postcode': 'M1 2JB'
  },
  'skillsAndExperience': {
    'categories': ['a', 'b'],
    'description': '&lt;script&gt;alert(&#39;xss!&#39;);&lt;/script&gt;'
  },
  'availability': {
    'description': '&quot;%3cscript%3ealert(document.cookie)%3c/script%3e'
  },
  'resources': {
    'description': '&lt;scr&lt;script&gt;ipt&gt;alert(document.cookie)&lt;/script&gt;'
  },
  'creationDate': '2015-04-06T17:06:27.1830000Z'
}
