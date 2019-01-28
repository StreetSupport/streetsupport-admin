/*
global describe, beforeAll, afterAll, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
const auth = require('../../src/js/auth')
var adminUrls = require('../../src/js/admin-urls')
var browser = require('../../src/js/browser')
var Model = require('../../src/js/models/volunteers/ListVolunteersModel')

describe('List Volunteers', () => {
  var model
  var ajaxGetStub
  var browserLoadingStub
  var browserLoadedStub

  beforeAll(() => {
    var getVolunteersPromise = () => {
      return {
        then: function (success, error) {
          success({
            'status': 'ok',
            'data': volunteerData()
          })
        }
      }
    }

    ajaxGetStub = sinon.stub(ajax, 'get')
      .returns(getVolunteersPromise())
    sinon.stub(auth, 'getLocationsForUser').returns([])
    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterAll(() => {
    ajax.get.restore()
    auth.getLocationsForUser.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should notify user it is loading', () => {
    expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('should get volunteers from api', () => {
    expect(ajaxGetStub.calledOnce).toBeTruthy()
  })

  it('should set volunteers', () => {
    expect(model.items().length).toEqual(4)
  })

  it('should set url to contact volunteer', () => {
    expect(model.items()[2].contactUrl).toEqual(adminUrls.contactVolunteer + '?id=570542130a4f951fb8abe4b9')
  })

  it('should set url to share volunteer', () => {
    expect(model.items()[2].shareUrl).toEqual(adminUrls.shareVolunteer + '?id=570542130a4f951fb8abe4b9')
  })

  it('should format creationDate', () => {
    expect(model.items()[2].creationDate).toEqual('06/04/16')
  })

  it('should show user then that is loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })
})

var volunteerData = () => {
  return {
    total: 12,
    items: [{
      'id': '56f2867701ad122cd0eb5b2f',
      'person': {
        'firstName': 'Vince',
        'lastName': 'Lee',
        'telephone': '01234567890',
        'email': 'vince.lee@polyhatsoftware.co.uk',
        'city': 'manchester',
        'postcode': 'postcode'
      },
      'skillsAndExperience': {
        'categories': ['a', 'b'],
        'description': 'the interwebz. beating people up, '
      },
      'availability': {
        'description': 'all day, everyday'
      },
      'resources': {
        'description': 'i have a big car'
      },
      'creationDate': '2016-03-23T12:05:11.0420000Z'
    }, {
      'id': '571dd1fcd021fb2890259127',
      'person': {
        'firstName': 'Vincent',
        'lastName': 'Lee',
        'telephone': '',
        'email': 'vslee888+ncc@gmail.com',
        'city': 'leeds',
        'postcode': 'postcode'
      },
      'skillsAndExperience': {
        'categories': ['a', 'b'],
        'description': 's'
      },
      'availability': {
        'description': 'a'
      },
      'resources': {
        'description': 'r'
      },
      'creationDate': '2016-04-25T08:14:52.7170000Z'
    }, {
      'id': '570542130a4f951fb8abe4b9',
      'person': {
        'firstName': 'Vince',
        'lastName': 'Lee',
        'telephone': '',
        'email': 'vslee888+060416@gmail.com',
        'city': null,
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
      'creationDate': '2016-04-06T17:06:27.1830000Z'
    }, {
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
    }]
  }
}
