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
const Model = require(`../../../../src/js/models/accommodation/reviews/add`)
import { testData } from '../testData'

describe('Accommodation Listing - Add', () => {
  let sut = null
  let browserLoadingStub = null
  let browserLoadedStub = null
  let ajaxPostStub = null

  beforeEach(() => {
    sinon.stub(querystring, 'parameter').withArgs('id').returns(testData.id)

    sinon
      .stub(ajax, 'get')
      .withArgs(`${endpoints.prefix(testData.links.self)}`)
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

    expect(sut.newItem().formFields().hasCentralHeating()).toEqual(0)
    expect(sut.newItem().formFields().hasHotWater()).toEqual(0)
    expect(sut.newItem().formFields().hasElectricity()).toEqual(0)
    expect(sut.newItem().formFields().hasToilet()).toEqual(0)
    expect(sut.newItem().formFields().hasShowerBath()).toEqual(0)
    expect(sut.newItem().formFields().noisyRating()).toEqual(0)

    expect(sut.newItem().formFields().feelingOfSecurityRating()).toEqual(0)
    expect(sut.newItem().formFields().hasLockOnRoom()).toEqual(false)
    expect(sut.newItem().formFields().hasLockOnFrontDoor()).toEqual(false)

    expect(sut.newItem().formFields().foodRating()).toEqual(0)
    expect(sut.newItem().formFields().cleanlinessRating()).toEqual(0)
    expect(sut.newItem().formFields().roomConditionRating()).toEqual(0)

    expect(sut.newItem().formFields().staffFriendlinessRating()).toEqual(0)
    expect(sut.newItem().formFields().staffSupportivenessRating()).toEqual(0)
    expect(sut.newItem().formFields().staffDealingWithProblemsRating()).toEqual(0)
    expect(sut.newItem().formFields().staffTimelinessWithIssuesRating()).toEqual(0)
    expect(sut.newItem().formFields().overallRating()).toEqual(0)
  })

  describe('- add new', () => {
    beforeEach(() => {
      browser.loading.reset()
      browser.loaded.reset()

      sut.newItem().formFields().hasCentralHeating(2)
      sut.newItem().formFields().hasHotWater(2)
      sut.newItem().formFields().hasElectricity(2)
      sut.newItem().formFields().hasToilet(2)
      sut.newItem().formFields().hasShowerBath(2)

      sut.newItem().formFields().noisyRating(2)
      sut.newItem().formFields().feelingOfSecurityRating(2)
      sut.newItem().formFields().hasLockOnRoom(true)
      sut.newItem().formFields().hasLockOnFrontDoor(true)

      sut.newItem().formFields().foodRating(3)
      sut.newItem().formFields().cleanlinessRating(2)
      sut.newItem().formFields().roomConditionRating(2)

      sut.newItem().formFields().staffFriendlinessRating(3)
      sut.newItem().formFields().staffSupportivenessRating(4)
      sut.newItem().formFields().staffDealingWithProblemsRating(5)
      sut.newItem().formFields().staffTimelinessWithIssuesRating(3)
      sut.newItem().formFields().overallRating(3)

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
        HasToilet: 2,
        HasShowerBath: 2,
        FoodRating: 3,
        FeelingOfSecurityRating: 2,
        HasLockOnRoom: true,
        HasLockOnFrontDoor: true,
        NoisyRating: 2,
        CleanlinessRating: 2,
        RoomConditionRating: 2,
        StaffFriendlinessRating: 3,
        StaffSupportivenessRating: 4,
        StaffDealingWithProblemsRating: 5,
        StaffTimelinessWithIssuesRating: 3,
        OverallRating: 3
      }
      const postCalledAsExpected = ajaxPostStub
        .withArgs(endpoint, payload)
        .calledAfter(browserLoadingStub)
      expect(postCalledAsExpected).toBeTruthy()
    })

    it('- should show user it has loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxPostStub)).toBeTruthy()
    })

    it('- should set reviewIsCreated to true', () => {
      expect(sut.reviewIsCreated()).toBeTruthy()
    })

    describe('- add personal feedback', () => {
      let ajaxPatchStub = null

      beforeEach(() => {
        browserLoadingStub.reset()
        browserLoadedStub.reset()

        ajaxPatchStub = sinon
          .stub(ajax, 'patch')
          .returns({
            then: function (success, error) {
              success({
                'statusCode': 200
              })
            }
          })

        sut.personalFeedback().formFields().canBeDisplayedPublically(true)
        sut.personalFeedback().formFields().reviewerName('reviewer name')
        sut.personalFeedback().formFields().reviewerContactDetails('reviewer contact details')
        sut.personalFeedback().formFields().body('review body')

        sut.personalFeedback().update()
      })

      afterEach(() => {
        ajax.patch.restore()
      })

      it('- should patch to review', () => {
        const endpoint = `${endpoints.temporaryAccommodation}/${testData.id}/reviews/new-review-id`
        const payload = {
          CanBeDisplayedPublically: true,
          ReviewerName: 'reviewer name',
          ReviewerContactDetails: 'reviewer contact details',
          Body: 'review body'
        }
        const calledAsExpected = ajaxPatchStub
          .withArgs(endpoint, payload)
          .calledAfter(browserLoadingStub)

        expect(calledAsExpected).toBeTruthy()
      })

      it('- should show user it is loaded', () => {
        expect(browserLoadedStub.calledAfter(ajaxPatchStub)).toBeTruthy()
      })

      it('- should set personal feedback set to true', () => {
        expect(sut.personalFeedbackIsSent()).toBeTruthy()
      })

      it('- should set updated message', () => {
        expect(sut.message()).toEqual('Thank you for your feedback!')
      })
    })
  })
})
