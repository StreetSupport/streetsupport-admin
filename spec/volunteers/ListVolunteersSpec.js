/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

var sinon = require('sinon')
var ajax = require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminUrls = require('../../src/js/admin-urls')
var browser = require('../../src/js/browser')
var cookies = require('../../src/js/cookies')
var Model = require('../../src/js/models/volunteers/ListVolunteersModel')

describe('List Volunteers', () => {
  var model
  var ajaxGetStub
  var browserLoadingStub
  var browserLoadedStub

  beforeEach(() => {
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
      .withArgs(endpoints.volunteers)
      .returns(getVolunteersPromise())

    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(() => {
    ajax.get.restore()
    cookies.get.restore()
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
    expect(model.volunteers().length).toEqual(4)
  })

  it('should order by creationDate', () => {
    expect(model.volunteers()[0].id).toEqual('571dd1fcd021fb2890259127')
    expect(model.volunteers()[1].id).toEqual('570542130a4f951fb8abe4b9')
    expect(model.volunteers()[2].id).toEqual('56f2867701ad122cd0eb5b2f')
  })

  it('should set url to contact volunteer', () => {
    expect(model.volunteers()[1].contactUrl).toEqual(adminUrls.contactVolunteer + '?id=570542130a4f951fb8abe4b9')
  })

  it('should set url to share volunteer', () => {
    expect(model.volunteers()[1].shareUrl).toEqual(adminUrls.shareVolunteer + '?id=570542130a4f951fb8abe4b9')
  })

  it('should format creationDate', () => {
    expect(model.volunteers()[1].creationDate).toEqual('06/04/16')
  })

  it('should show user then that is loaded', () => {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })

  it('should set available cities', () => {
    expect(model.availableCities().length).toEqual(2)
  })

  describe('- filter by city', () => {
    beforeEach(() => {
      model.cityFilter('manchester')
      model.filterByCity()
    })

    it('- should filter to volunteers with selected city', () => {
      expect(model.volunteers().length).toEqual(1)
      expect(model.volunteers()[0].person.email).toEqual('vince.lee@polyhatsoftware.co.uk')
    })
  })

  describe('- view all', () => {
    beforeEach(() => {
      model.cityFilter()
    })

    it('- should show all volunteers', () => {
      expect(model.volunteers().length).toEqual(4)
    })
  })
})

var volunteerData = () => {
  return [{
    'id': '56f2867701ad122cd0eb5b2f',
    'person': {
      'firstName': 'Vince',
      'lastName': 'Lee',
      'telephone': '01234567890',
      'email': 'vince.lee@polyhatsoftware.co.uk',
      'city': 'manchester',
      'postcode': 'M3 4BD'
    },
    'skillsAndExperience': {
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
      'postcode': 'M3 4BD'
    },
    'skillsAndExperience': {
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
