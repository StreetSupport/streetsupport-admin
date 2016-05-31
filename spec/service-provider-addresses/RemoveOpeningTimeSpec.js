var sinon = require('sinon'),
    ajax =      require('basic-ajax'),
    ko =      require('knockout'),
    endpoints = require('../../src/js/api-endpoints'),
    adminurls = require('../../src/js/admin-urls'),
    browser =   require('../../src/js/browser'),
    cookies =   require('../../src/js/cookies')

describe('Remove Opening Time', () => {
  var Model = require('../../src/js/models/Address'),
  model

  beforeEach(() => {
    model = new Model(getAddressData())

    model.edit()
    model.removeOpeningTime({
      'startTime': ko.observable('10:00'),
      'endTime': ko.observable('16:30'),
      'day': ko.observable('Monday')
    })
  })

  it('should remove passed openingTimes', () => {
    expect(model.openingTimes().length).toEqual(1)
    expect(model.openingTimes()[0].day()).toEqual('Tuesday')
    expect(model.openingTimes()[0].startTime()).toEqual('10:00')
    expect(model.openingTimes()[0].endTime()).toEqual('16:30')
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
    }]
  }
}
