/* global describe, beforeEach, it, expect */

const Update = require('../../src/js/models/impact-updates/Update')

describe('Impact Update', () => {
  let sut = null

  beforeEach(() => {
    sut = new Update()
  })

  it('- should set displayDate to today', () => {
    const today = new Date()
    const expected = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`
    expect(sut.displayDate()).toEqual(expected)
  })
})
