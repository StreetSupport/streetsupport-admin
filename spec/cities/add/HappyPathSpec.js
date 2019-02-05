/* global beforeAll, afterAll, describe, it, expect */

import { stub } from 'sinon'

import ajax, { post } from '../../../src/js/ajax'
import browser, { loading, loaded } from '../../../src/js/browser'
import { cities } from '../../../src/js/api-endpoints'
import Model from '../../../src/js/models/cities/AddModel'

describe('Cities - add', () => {
  let sut,
      ajaxPostStub,
      browserLoadingStub,
      browserLoadedStub

  beforeAll(() => {
    ajaxPostStub = stub(ajax, 'post')
      .returns({
        then: function (success, error) {
          success({
            'status': 'created',
            'statusCode': 200
          })
        }
      })

    browserLoadingStub = stub(browser, 'loading')
    browserLoadedStub = stub(browser, 'loaded')

    sut = new Model()
  })

  afterAll(() => {
    browser.loading.restore()
    browser.loaded.restore()
    post.restore()
  })

  it('- should set form submitted to false', () => {
    expect(sut.formSubmitted()).toBeFalsy()
  })

  it('- should set was successful to false', () => {
    expect(sut.wasSuccessful()).toBeFalsy()
  })

  describe(('- submit'), () => {
    beforeAll(() => {
      sut.cityName('city name')
      sut.postcode('postcode')
  
      sut.submit()
    })
  
    it('- should show user it is loading', () => {
      expect(browserLoadingStub.calledOnce).toBeTruthy()
    })
  
    it('- should set form submitted to true', () => {
      expect(sut.formSubmitted()).toBeTruthy()
    })

    it('- should post to endpoint', () => {
      const args = ajaxPostStub.getCalls()[0].args
      expect(args[0]).toEqual(cities)
    })

    it('- should post data', () => {
      const args = ajaxPostStub.getCalls()[0].args
      const payload = {
        Name: 'city name',
        PostcodeOfCentre: 'postcode'
      }
      expect(args[1]).toEqual(payload)
    })
  
    it('- should set submission successful to true', () => {
      expect(sut.wasSuccessful()).toBeTruthy()
    })
  
    it('- should show user it has loaded', () => {
      expect(browserLoadedStub.calledAfter(ajaxPostStub)).toBeTruthy()
    })
  })
})
