/*
global describe, beforeEach, afterEach, it, expect
*/

'use strict'

const sinon = require('sinon')

const ajax = require(`../../../../src/js/ajax`)
const endpoints = require(`../../../../src/js/api-endpoints`)
const browser = require(`../../../../src/js/browser`)
const cookies = require(`../../../../src/js/cookies`)
const querystring = require(`../../../../src/js/get-url-parameter`)
const Model = require(`../../../../src/js/models/accommodation/reviews/app`)
import { testData } from '../testData'

describe('Accommodation Listing - Add', () => {
  let sut = null
  let browserLoadingStub = null
  let browserLoadedStub = null
  let ajaxPostStub = null

  const headers = {
    'content-type': 'application/json',
    'session-token': 'stored-session-token'
  }

  beforeEach(() => {
    sinon.stub(querystring, 'parameter').withArgs('id').returns(testData.id)

    sinon
      .stub(ajax, 'get')
      .withArgs(`${endpoints.prefix(testData.links.self)}?expand=reviews`, headers)
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 200,
            'data': testData
          })
        }
      })

    ajaxPostStub = sinon
      .stub(ajax, 'post')
      .returns({
        then: function (success, error) {
          success({
            'statusCode': 201,
            'data': {
              id: 'new-review-id'
            }
          })
        }
      })

    browserLoadingStub = sinon.stub(browser, 'loading')
    browserLoadedStub = sinon.stub(browser, 'loaded')
    sinon.stub(cookies, 'get').returns('stored-session-token')

    sut = new Model()
    sut.init()
  })

  afterEach(() => {
    ajax.get.restore()
    ajax.post.restore()
    browser.loading.restore()
    browser.loaded.restore()
    cookies.get.restore()
    querystring.parameter.restore()
  })

  it(' - should set defaults', () => {
    expect(sut.newItem().formFields().idReadOnly()).toEqual(null)
    expect(sut.newItem().formFields().hasCentralHeating()).toEqual('0')
    expect(sut.newItem().formFields().hasHotWater()).toEqual('0')
    expect(sut.newItem().formFields().hasElectricity()).toEqual('0')
    expect(sut.newItem().formFields().hasLockOnRoom()).toEqual(false)
    expect(sut.newItem().formFields().hasLockOnFrontDoor()).toEqual(false)
    expect(sut.newItem().formFields().hasAggressiveTenants()).toEqual(false)
    expect(sut.newItem().formFields().hasExcessiveNoise()).toEqual(false)
    expect(sut.newItem().formFields().foodRating()).toEqual('1')
    expect(sut.newItem().formFields().cleanlinessRating()).toEqual('1')
    expect(sut.newItem().formFields().staffHelpfulnessRating()).toEqual('1')
    expect(sut.newItem().formFields().staffSupportivenessRating()).toEqual('1')
    expect(sut.newItem().formFields().staffDealingWithProblemsRating()).toEqual('1')
    expect(sut.newItem().formFields().staffTimelinessWithIssuesRating()).toEqual('1')
    expect(sut.newItem().formFields().canBeDisplayedPublically()).toEqual(false)
  })

  describe('- add new', () => {
    beforeEach(() => {
      browser.loading.reset()
      browser.loaded.reset()

      sut.newItem().formFields().hasCentralHeating(2)
      sut.newItem().formFields().hasHotWater(2)
      sut.newItem().formFields().hasElectricity(2)
      sut.newItem().formFields().hasLockOnRoom(true)
      sut.newItem().formFields().hasLockOnFrontDoor(true)
      sut.newItem().formFields().hasAggressiveTenants(true)
      sut.newItem().formFields().hasExcessiveNoise(true)
      sut.newItem().formFields().foodRating(3)
      sut.newItem().formFields().cleanlinessRating(2)
      sut.newItem().formFields().staffHelpfulnessRating(3)
      sut.newItem().formFields().staffSupportivenessRating(4)
      sut.newItem().formFields().staffDealingWithProblemsRating(5)
      sut.newItem().formFields().staffTimelinessWithIssuesRating(3)
      sut.newItem().formFields().canBeDisplayedPublically(true)
      sut.newItem().formFields().reviewerName('reviewer name')
      sut.newItem().formFields().reviewerContactDetails('reviewer contact details')
      sut.newItem().formFields().body('review body')

      sut.newItem().save()
    })

    it('- should show user it is loading', () => {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })

    it('- should post new review data', () => {
      const endpoint = `${endpoints.temporaryAccommodation}/${testData.id}/reviews`
      const payload = {
        HasCentralHeating: 2,
        HasHotWater: 2,
        HasElectricity: 2,
        FoodRating: 3,
        HasLockOnRoom: true,
        HasLockOnFrontDoor: true,
        HasAggressiveTenants: true,
        HasExcessiveNoise: true,
        CleanlinessRating: 2,
        StaffHelpfulnessRating: 3,
        StaffSupportivenessRating: 4,
        StaffDealingWithProblemsRating: 5,
        StaffTimelinessWithIssuesRating: 3,
        CanBeDisplayedPublically: true,
        ReviewerName: 'reviewer name',
        ReviewerContactDetails: 'reviewer contact details',
        Body: 'review body'
      }
      const postCalledAsExpected = ajaxPostStub
        .withArgs(endpoint, headers, payload)
        .calledAfter(browserLoadingStub)
      expect(postCalledAsExpected).toBeTruthy()
    })

    it('- should show user it has loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxPostStub)).toBeTruthy()
    })

    it('- should reset new item form', () => {
      expect(sut.newItem().formFields().idReadOnly()).toEqual(null)
      expect(sut.newItem().formFields().hasCentralHeating()).toEqual('0')
      expect(sut.newItem().formFields().hasHotWater()).toEqual('0')
      expect(sut.newItem().formFields().hasElectricity()).toEqual('0')
      expect(sut.newItem().formFields().hasLockOnRoom()).toEqual(false)
      expect(sut.newItem().formFields().hasLockOnFrontDoor()).toEqual(false)
      expect(sut.newItem().formFields().hasAggressiveTenants()).toEqual(false)
      expect(sut.newItem().formFields().hasExcessiveNoise()).toEqual(false)
      expect(sut.newItem().formFields().foodRating()).toEqual('1')
      expect(sut.newItem().formFields().cleanlinessRating()).toEqual('1')
      expect(sut.newItem().formFields().staffHelpfulnessRating()).toEqual('1')
      expect(sut.newItem().formFields().staffSupportivenessRating()).toEqual('1')
      expect(sut.newItem().formFields().staffDealingWithProblemsRating()).toEqual('1')
      expect(sut.newItem().formFields().staffTimelinessWithIssuesRating()).toEqual('1')
      expect(sut.newItem().formFields().canBeDisplayedPublically()).toEqual(false)
      expect(sut.newItem().formFields().reviewerName()).toEqual('')
      expect(sut.newItem().formFields().reviewerContactDetails()).toEqual('')
      expect(sut.newItem().formFields().body()).toEqual('')
    })

    it('- should add new item to top of collection', () => {
      expect(sut.items().length).toEqual(3)
      expect(sut.items()[0].formFields().idReadOnly()).toEqual('new-review-id')
    })

    it('- should retain Accommodation id', () => {
      expect(sut.items()[0].formFields().temporaryAccommodationIdReadOnly()).toEqual(testData.id)
    })
  })
})
