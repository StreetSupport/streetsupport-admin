var sinon = require('sinon'),
  ajax = require('basic-ajax'),
  endpoints = require('../../src/js/api-endpoints'),
  adminurls = require('../../src/js/admin-urls'),
  browser = require('../../src/js/browser'),
  cookies = require('../../src/js/cookies'),
  getUrlParameter = require('../../src/js/get-url-parameter')

describe('Service Editing', function() {
  var Model = require('../../src/js/models/Service'),
    model

  beforeEach(function() {
    model = new Model(getData())

    model.edit()
  })

  it('should set isEditing to true', function() {
    expect(model.isEditing).toBeTruthy()
  })

  describe('Cancel', function() {
    beforeEach(function() {
      model.info('new info')
      model.tags('new tags')
      model.openingTimes()[1].startTime('20:00')
      model.openingTimes()[1].endTime('22:00')
      model.openingTimes()[1].day('Wednesday')
      model.cancelEdit()
    })

    it('should set isEditing to false', function() {
      expect(model.isEditing()).toBeFalsy()
    })

    it('should set reset fields', function() {
      expect(model.name).toEqual('Meals')
      expect(model.info()).toEqual('Breakfast')
      expect(model.tags()).toEqual('some tags')
      expect(model.openingTimes()[1].startTime()).toEqual('09:00')
      expect(model.openingTimes()[1].endTime()).toEqual('10:00')
      expect(model.openingTimes()[1].day()).toEqual('Tuesday')
    })
  })

  describe('Save', function() {
    var stubbedApi,
      stubbedCookies,
      stubbedUrlParams

    beforeEach(function() {
      function fakeResolved(value) {
        return {
          then: function(success, error) {
            success({
              'status': 200,
              'json': getData()
            })
          }
        }
      }

      stubbedApi = sinon.stub(ajax, 'put').returns(fakeResolved())
      stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
      stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

      model.info('new info')
      model.tags('new tags')
      model.openingTimes()[1].startTime('20:00')
      model.openingTimes()[1].endTime('22:00')
      model.openingTimes()[1].day('Wednesday')

      model.save()
    })

    afterEach(function() {
      ajax.put.restore()
      cookies.get.restore()
      getUrlParameter.parameter.restore()
    })

    it('should put service details to api with session token', function() {
      var endpoint = endpoints.getServiceProviders + '/coffee4craig/services/569d2b468705432268b65c75'
      var headers = {
        'content-type': 'application/json',
        'session-token': 'stored-session-token'
      }
      var payload = JSON.stringify({
        'Info': 'new info',
        'Tags': 'new tags',
        'OpeningTimes': [{
          'startTime': '09:00',
          'endTime': '10:00',
          'day': 'Monday'
        },
        {
          'startTime': '20:00',
          'endTime': '22:00',
          'day': 'Wednesday'
        }]
      })
      var apiCalledWithExpectedArgs = stubbedApi.withArgs(endpoint, headers, payload).calledOnce
      expect(apiCalledWithExpectedArgs).toBeTruthy()
    })

    it('should set isEditing to false', function() {
      expect(model.isEditing()).toBeFalsy()
    })

    describe('Edit again and Cancel', function() {
      beforeEach(function() {
        model.edit()
        model.info('different info')
        model.cancelEdit()
      })

      it('should set isEditing to false', function() {
        expect(model.isEditing()).toBeFalsy()
      })

      it('should set reset fields', function() {
        expect(model.info()).toEqual('Breakfast')
      })
    })
  })

  // describe('Save Fail', function() {
  //   var stubbedApi,
  //     stubbedCookies,
  //     stubbedUrlParams

  //   beforeEach(function() {
  //     function fakeResolved(value) {
  //       return {
  //         then: function(success, error) {
  //           error({
  //             'status': 400,
  //             'response': JSON.stringify({
  //               'messages': ['returned error message 1', 'returned error message 2']
  //             })
  //           })
  //         }
  //       }
  //     }

  //     stubbedApi = sinon.stub(ajax, 'put').returns(fakeResolved())
  //     stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
  //     stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

  //     model.street1('new street1')

  //     model.save()
  //   })

  //   afterEach(function() {
  //     ajax.put.restore()
  //     cookies.get.restore()
  //     getUrlParameter.parameter.restore()
  //   })

  //   it('should set message as joined error messages', function() {
  //     expect(model.message()).toEqual('returned error message 1<br />returned error message 2')
  //   })

  //   it('should keep isEditing as true', function() {
  //     expect(model.isEditing()).toBeTruthy()
  //   })
  // })
})

function getData() {
  return {
    'key': '569d2b468705432268b65c75',
    'name': 'Meals',
    'info': 'Breakfast',
    'openingTimes': [{
      'startTime': '09:00',
      'endTime': '10:00',
      'day': 'Monday'
    }, {
      'startTime': '09:00',
      'endTime': '10:00',
      'day': 'Tuesday'
    }],
    'address': {
      'key': '7a6ff0f3-5b04-4bd9-b088-954e473358f5',
      'street': 'Booth Centre',
      'street1': null,
      'street2': 'Edward Holt House',
      'street3': 'Pimblett Street',
      'city': 'Manchester',
      'postcode': 'M3 1FU',
      'openingTimes': null
    },
    'tags': 'some tags'
  }
}
