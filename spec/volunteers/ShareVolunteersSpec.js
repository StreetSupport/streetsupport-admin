/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')
var getUrlParam = require('../../src/js/get-url-parameter')
var Model = require('../../src/js/models/volunteers/ShareVolunteerModel')

describe('Share Volunteer', () => {
  var model
  var ajaxPostStub
  var ajaxGetStub
  var browserLoadingStub
  var browserLoadedStub

  beforeEach(() => {
    ajaxPostStub = sinon.stub(ajax, 'post')
      .returns({
        then: function (success, error) {
          success({
            'status': 'created'
          })
        }
      })

    ajaxGetStub = sinon.stub(ajax, 'get')

    ajaxGetStub.withArgs(endpoints.volunteers + '/56d0362c928556085cc569b3')
      .returns({
        then: function (success, error) {
          success({
            'status': 'ok',
            'data': vol
          })
        }
      })

    ajaxGetStub.withArgs(endpoints.getPublishedServiceProviders + '/manchester')
      .returns({
        then: function (success, error) {
          success({
            'status': 'ok',
            'data': orgs
          })
        }
      })

    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    sinon.stub(getUrlParam, 'parameter').withArgs('id').returns('56d0362c928556085cc569b3')

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(() => {
    ajax.post.restore()
    ajax.get.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
    getUrlParam.parameter.restore()
  })

  it('- should populate orgs', () => {
    expect(model.organisations().length).toEqual(2)
  })

  describe('- submit', () => {
    beforeEach(() => {
      browserLoadingStub.reset()
      browserLoadedStub.reset()

      model.selectedOrgId({
        'id': 'coffee4craig',
        'name': 'Coffee4Craig'
      })
      model.submit()
    })

    it('should notify user it is loading', () => {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })

    it('should post to api', () => {
      var endpoint = endpoints.volunteers + '/56d0362c928556085cc569b3/share'
      var headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      var payload = {
        'OrgId': 'coffee4craig'
      }
      var posted = ajaxPostStub.withArgs(endpoint, headers, payload).calledOnce
      expect(posted).toBeTruthy()
    })

    it('should notify user it has loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxPostStub)).toBeTruthy()
    })

    it('should set isFormSubmitSuccessful to true', () => {
      expect(model.isFormSubmitSuccessful()).toBeTruthy()
    })
  })
})

var vol = {
  'id': '56d0362c928556085cc569b3',
  'person': {
    'firstName': 'Vince',
    'lastName': 'Lee',
    'telephone': '',
    'email': 'vslee888+060416@gmail.com',
    'city': 'manchester',
    'postcode': 'M1 2JB'
  },
  'skillsAndExperience': {
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

var orgs = [
  {
    'key': 'audacious-a-teams',
    'name': 'Audacious A-Teams'
  },
  {
    'key': 'coffee4craig',
    'name': 'Coffee4Craig'
  }
]
