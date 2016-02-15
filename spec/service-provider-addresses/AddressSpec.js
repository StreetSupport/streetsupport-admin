var sinon = require('sinon'),
  ajax = require('basic-ajax'),
  endpoints = require('../../src/js/api-endpoints'),
  adminurls = require('../../src/js/admin-urls'),
  browser = require('../../src/js/browser'),
  cookies = require('../../src/js/cookies'),
  getUrlParameter = require('../../src/js/get-url-parameter')

describe('Address', function() {
  var Model = require('../../src/js/models/Address'),
    model

  beforeEach(function() {
    model = new Model(getAddressData())
  })

  it('should format addresses', function() {
    expect(model.formatted).toEqual('5 Oak Street, Manchester, M4 5JD')
  })

  it('should set link to edit each address', function() {
    expect(model.editAddressUrl).toEqual('edit-service-provider-address.html?providerId=coffee4craig&addressId=1234')
  })

  it('should set link to add an address', function() {
    expect(model.addAddressUrl).toEqual('add-service-provider-address.html?providerId=coffee4craig')
  })

  it('should set link to delete an address', function() {
    expect(model.deleteAddressUrl).toEqual('delete-service-provider-address.html?providerId=coffee4craig&addressId=1234')
  })

  describe('Editing', function() {
    beforeEach(function() {
      model.edit()
    })

    it('should set isEditing to true', function() {
      expect(model.isEditing).toBeTruthy()
    })

    describe('Cancel', function() {
      beforeEach(function() {
        model.street1('new street1')
        model.street2('new street2')
        model.street3('new street3')
        model.street4('new street4')
        model.city('new city')
        model.postcode('new postcode')
        model.openingTimes()[1].startTime('20:00')
        model.openingTimes()[1].endTime('22:00')
        model.openingTimes()[1].day('Wednesday')
        model.cancel()
      })

      it('should set isEditing to false', function() {
        expect(model.isEditing()).toBeFalsy()
      })

      it('should set reset fields', function() {
        expect(model.street1()).toEqual('5 Oak Street')
        expect(model.street2()).toEqual('')
        expect(model.street3()).toEqual(null)
        expect(model.street4()).toEqual(null)
        expect(model.city()).toEqual('Manchester')
        expect(model.postcode()).toEqual('M4 5JD')
        expect(model.openingTimes()[1].startTime()).toEqual('10:00')
        expect(model.openingTimes()[1].endTime()).toEqual('16:30')
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
                'json': getAddressData()
              })
            }
          }
        }

        stubbedApi = sinon.stub(ajax, 'put').returns(fakeResolved())
        stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
        stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

        model.street1('new street1')
        model.street2('new street2')
        model.street3('new street3')
        model.street4('new street4')
        model.city('new city')
        model.postcode('new postcode')
        model.openingTimes()[0].startTime('12:00')
        model.openingTimes()[0].endTime('16:30')
        model.openingTimes()[0].day('Monday')
        model.openingTimes()[1].startTime('12:00')
        model.openingTimes()[1].endTime('15:30')
        model.openingTimes()[1].day('Tuesday')

        model.save()
      })

      afterEach(function() {
        ajax.put.restore()
        cookies.get.restore()
        getUrlParameter.parameter.restore()
      })

      it('should put address details to api with session token', function() {
        var endpoint = endpoints.getServiceProviders + '/coffee4craig/addresses/1234'
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
          'OpeningTimes': [{
            'startTime': '12:00',
            'endTime': '16:30',
            'day': 'Monday'
          }, {
            'startTime': '12:00',
            'endTime': '15:30',
            'day': 'Tuesday'
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
          model.street1('another new street1')
          model.cancel()
        })

        it('should set isEditing to false', function() {
          expect(model.isEditing()).toBeFalsy()
        })

        it('should set reset fields', function() {
          expect(model.street1()).toEqual('new street1')
        })
      })
    })

    describe('Save Fail', function() {
      var stubbedApi,
        stubbedCookies,
        stubbedUrlParams

      beforeEach(function() {
        function fakeResolved(value) {
          return {
            then: function(success, error) {
              error({
                'status': 400,
                'response': JSON.stringify({
                  'messages': ['returned error message 1', 'returned error message 2']
                })
              })
            }
          }
        }

        stubbedApi = sinon.stub(ajax, 'put').returns(fakeResolved())
        stubbedCookies = sinon.stub(cookies, 'get').returns('stored-session-token')
        stubbedUrlParams = sinon.stub(getUrlParameter, 'parameter').returns('coffee4craig')

        model.street1('new street1')

        model.save()
      })

      afterEach(function() {
        ajax.put.restore()
        cookies.get.restore()
        getUrlParameter.parameter.restore()
      })

      it('should set message as joined error messages', function() {
        expect(model.errors()[0]).toEqual('returned error message 1')
        expect(model.errors()[1]).toEqual('returned error message 2')
      })

      it('should keep isEditing as true', function() {
        expect(model.isEditing()).toBeTruthy()
      })
    })
  })
})


function getAddressData() {
  return {
    'serviceProviderId': 'coffee4craig',
    'key': 1234,
    'street': '5 Oak Street',
    'street1': '',
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
    }]
  }
}
