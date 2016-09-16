/*
global describe, beforeEach, it, expect
*/

'use strict'

let ko = require('knockout')

describe('Duplicate Opening Time', () => {
  let Model = require('../../src/js/models/Address')
  let model = null

  beforeEach(() => {
    model = new Model(getAddressData())

    model.edit()
    model.duplicateOpeningTime({
      'startTime': ko.observable('10:00'),
      'endTime': ko.observable('16:30'),
      'day': ko.observable('Monday')
    })
  })

  it('- should duplicate passed openingTimes', () => {
    expect(model.openingTimes().length).toEqual(3)
    expect(model.openingTimes()[2].day()).toEqual('Monday')
    expect(model.openingTimes()[2].startTime()).toEqual('10:00')
    expect(model.openingTimes()[2].endTime()).toEqual('16:30')
  })
})

function getAddressData () {
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
