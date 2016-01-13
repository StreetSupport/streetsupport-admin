var sinon = require('sinon'),
    ajax =      require('basic-ajax'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('../../src/js/cookies'),
    getUrlParameter = require('../../src/js/get-url-parameter')

describe ('Address Editing', function () {
  var Model = require('../../src/js/models/Address'),
  model,
  stubbedApi,
  stubbedCookies,
  stubbedUrlParams

  beforeEach (function () {
    function fakeResolved (value) {
      return {
        then: function (success, error) {
          success({
            'status': 200,
            'json': addresses()
          })
        }
      }
    }

    stubbedApi = sinon.stub(ajax, 'get').returns(fakeResolved ())
    stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
    stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

    model = new Model(getAddressData())

    model.edit()
  })

  afterEach (function () {
    ajax.get.restore()
    cookies.get.restore()
    getUrlParameter.parameter.restore()
  })

  it ('should set isEditing to true', function () {
    expect(model.isEditing).toBeTruthy()
  })

  describe('Cancel', function () {
    beforeEach (function () {
      model.cancel()
    })

    it('should set isEditing to false', function () {
      expect(model.isEditing()).toBeFalsy()
    })
  })
})

function getAddressData() {
  return {
    'key': 1,
    'street': '5 Oak Street',
    'street1': null,
    'street2': null,
    'street3': null,
    'city': 'Manchester',
    'postcode': 'M4 5JD',
    'openingTimes': [{
      'startTime': '10:00',
      'endTime': '16:30',
      'day': 'Monday'
    }, {
      'startTime': '10:00',
      'endTime': '16:30',
      'day': 'Tuesday'
    }, {
      'startTime': '10:00',
      'endTime': '16:30',
      'day': 'Wednesday'
    }, {
      'startTime': '10:00',
      'endTime': '16:30',
      'day': 'Thursday'
    }, {
      'startTime': '10:00',
      'endTime': '16:30',
      'day': 'Friday'
    }]
  }
}
