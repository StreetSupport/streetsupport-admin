var sinon = require('sinon')
var ajax =      require('../../src/js/ajax')
var endpoints = require('../../src/js/api-endpoints')
var adminUrls = require('../../src/js/admin-urls')
var browser =   require('../../src/js/browser')
var cookies =   require('../../src/js/cookies')
var Model = require('../../src/js/models/volunteers/ListVolunteersModel')

describe('List Volunteers', function () {
  var model
  var headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }
  var ajaxGetStub
  var browserLoadingStub
  var browserLoadedStub

  beforeEach(function () {
    var getVolunteersPromise = function () {
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
      .withArgs(endpoints.volunteers, headers)
      .returns(getVolunteersPromise())

    sinon.stub(cookies, 'get')
      .withArgs('session-token')
      .returns('stored-session-token')

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')

    model = new Model()
  })

  afterEach(function () {
    ajax.get.restore()
    cookies.get.restore()
    browser.loading.restore()
    browser.loaded.restore()
  })

  it('should notify user it is loading' ,function () {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
  })

  it('should get volunteers from api', function () {
    expect(ajaxGetStub.calledOnce).toBeTruthy()
  })

  it('should set volunteers', function () {
    expect(model.volunteers().length).toEqual(3)
  })

  it('should set url to contact volunteer', function () {
    expect(model.volunteers()[1].contactUrl).toEqual(adminUrls.contactVolunteer + '?id=56d845e59285563428569851')
  })

  it('should show user then that is loaded', function () {
    expect(browserLoadedStub.calledAfter(ajaxGetStub)).toBeTruthy()
  })
})

var volunteerData = function () {
  return [{
    'person': {
      'firstName': 'Vince',
      'lastName': 'Lee',
      'telephone': '',
      'email': 'vslee888+ncc@gmail.com',
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
    'id': '56d0362c928556085cc569b3',
    'documentCreationDate': '0001-01-01T00:00:00.0000000Z',
    'documentModifiedDate': '0001-01-01T00:00:00.0000000Z'
  }, {
    'person': {
      'firstName': 'Vince',
      'lastName': 'Lee',
      'telephone': '07944780742',
      'email': 'support@streetsupport.net',
      'postcode': 'M3 4BD'
    },
    'skillsAndExperience': {
      'description': 's'
    },
    'availability': {
      'description': 'ar'
    },
    'resources': {
      'description': 'r'
    },
    'id': '56d845e59285563428569851',
    'documentCreationDate': '0001-01-01T00:00:00.0000000Z',
    'documentModifiedDate': '0001-01-01T00:00:00.0000000Z'
  }, {
    'person': {
      'firstName': 'Vince',
      'lastName': 'Lee',
      'telephone': '07944780742',
      'email': 'support@streetsupport.net',
      'postcode': 'M3 4BD'
    },
    'skillsAndExperience': {
      'description': 's'
    },
    'availability': {
      'description': 'ar'
    },
    'resources': {
      'description': 'r'
    },
    'id': '56d845ef9285563428569852',
    'documentCreationDate': '0001-01-01T00:00:00.0000000Z',
    'documentModifiedDate': '0001-01-01T00:00:00.0000000Z'
  }]
}
