/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var browser = require('../../src/js/browser')
var Model = require('../../src/js/models/volunteers/ContactVolunteerModel')
var getUrlParam = require('../../src/js/get-url-parameter')

describe('Contact Offer of item - No message', () => {
  var model
  var ajaxPostStub

  beforeEach(() => {
    sinon.stub(browser, 'loading')
    sinon.stub(browser, 'loaded')
    sinon.stub(getUrlParam, 'parameter').withArgs('id').returns('56d0362c928556085cc569b3')

    ajaxPostStub = sinon.stub(ajax, 'post')
    sinon.stub(ajax, 'get')
      .returns({
        then: function (success, error) {
          success({
            'status': 'ok',
            'data': vol
          })
        }
      })

    model = new Model()
    model.submit()
  })

  afterEach(() => {
    getUrlParam.parameter.restore()
    ajax.post.restore()
    ajax.get.restore()
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
