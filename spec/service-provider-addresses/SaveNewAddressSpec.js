var sinon =           require('sinon')
var ajax =            require('basic-ajax')
var endpoints =       require('../../src/js/api-endpoints')
var cookies =         require('../../src/js/cookies')
var getUrlParameter = require('../../src/js/get-url-parameter')

describe('Save new Address', function () {
  var Model = require('../../src/js/models/Address'),
  model

  beforeEach (function () {
    model = new Model({
      'tempKey': 'some temp key',
      'openingTimes': []
    })

    model.edit()
  })

  describe('Save', function () {
    var stubbedApi,
        stubbedCookies,
        stubbedUrlParams

    beforeEach(function () {
      function fakeResolved(value) {
        return {
          then: function (success, error) {
            success({
              'status': 200,
              'json': {
                'key': 230680
              }
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'post').returns(fakeResolved ())
      stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
      stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

      model.street1('new street1')
      model.street2('new street2')
      model.street3('new street3')
      model.street4('new street4')
      model.city('new city')
      model.postcode('new postcode')
      model.newOpeningTime()
      model.openingTimes()[0].startTime('12:00')
      model.openingTimes()[0].endTime('16:30')
      model.openingTimes()[0].day('Monday')
      model.newOpeningTime()
      model.openingTimes()[1].startTime('12:00')
      model.openingTimes()[1].endTime('15:30')
      model.openingTimes()[1].day('Tuesday')

      model.save()
    })

    afterEach(function () {
      ajax.post.restore()
      cookies.get.restore()
      getUrlParameter.parameter.restore()
    })

    it('should post address details to api create endpoint with session token', function () {
      var endpoint = endpoints.serviceProviderAddresses + '/coffee4craig/create'
      var headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      var payload = JSON.stringify({
        'Street': 'new street1',
        'Street1': 'new street2',
        'Street2': 'new street3',
        'Street3': 'new street4',
        'City': 'new city',
        'Postcode': 'new postcode',
        'OpeningTimes': [
          {
            'startTime': '12:00',
            'endTime': '16:30',
            'day': 'Monday'
          }, {
            'startTime': '12:00',
            'endTime': '15:30',
            'day': 'Tuesday'
          }
        ]
      })
      var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should set returned key', function() {
      expect(model.key()).toEqual(230680)
    })

    it('should set isEditing to false', function() {
      expect(model.isEditing()).toBeFalsy()
    })

    describe('Edit again and Cancel', function () {
      beforeEach (function () {
        model.edit()
        model.street1('another new street1')
        model.cancel()
      })

      it('should set isEditing to false', function () {
        expect(model.isEditing()).toBeFalsy()
      })

      it('should set reset fields', function () {
        expect(model.street1()).toEqual('new street1')
      })
    })
  })
})
