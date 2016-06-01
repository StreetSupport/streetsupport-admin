/*
global describe, beforeEach, it, expect
*/

'use strict'

describe('Add Opening Time', () => {
  const Model = require('../../src/js/models/Address')
  let model = null

  beforeEach(() => {
    model = new Model(getAddressData())

    model.edit()
    model.newOpeningTime()
  })

  it('should add a new openingTimes', () => {
    expect(model.openingTimes().length).toEqual(3)
  })

  describe('Then cancel', () => {
    beforeEach(() => {
      model.cancel()
    })

    it('should reset openingTimes', () => {
      expect(model.openingTimes().length).toEqual(2)
    })
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
