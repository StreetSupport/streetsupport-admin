import { observable } from 'knockout'

import { post } from '../../ajax'
import { loading, loaded } from '../../browser'
import api from '../../api-endpoints'
import BaseViewModel from '../BaseViewModel'

const Model = function () {
  const self = this
  self.cityName = observable('')
  self.postcode = observable('')
  self.formSubmitted = observable(false)
  self.wasSuccessful = observable(false)

  self.submit = function () {
    loading()
    self.formSubmitted(true)

    const payload = {
      Name: self.cityName(),
      PostcodeOfCentre: self.postcode()
    }
    post(api.cities, payload)
      .then((result) => {
        loaded()

        if (result.statusCode === 201) {
          self.wasSuccessful(true)
        } else {
          self.formSubmitted(false)
          self.handleError(result)
        }
      }, (error) => {
        self.handleError(error)
      })
  }
}

Model.prototype = new BaseViewModel()

module.exports = Model
