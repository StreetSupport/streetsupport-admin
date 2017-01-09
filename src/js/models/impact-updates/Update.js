let ko = require('knockout')
let ajax = require('../../ajax')
let BaseViewModel = require('../BaseViewModel')
let browser = require('../../browser')
let cookies = require('../../cookies')
var marked = require('marked')

function Update (listener, data = { content: '', displayDate: '01/01/2017' }) {
  var self = this

  self.listener = listener

  const [day, month, year] = data.displayDate.split('/')

  self.id = ko.observable(data.id)
  self.updateContent = ko.observable(marked(data.content))
  self.displayDateDay = ko.observable(day)
  self.displayDateMonth = ko.observable(month)
  self.displayDateYear = ko.observable(year)
  self.displayDate = ko.observable(data.displayDate)
  self.cityId = ko.observable(data.cityId)

  self.clear = () => {
    self.updateContent('')
    self.displayDateDay('01')
    self.displayDateMonth('01')
    self.displayDateYear('2017')
    self.cityId('')
  }

  self.deleteUpdate = () => {
    const endpoint = self.endpointBuilder.impactUpdates(self.id()).build()
    const headers = self.headers(cookies.get('session-token'))
    browser.loading()
    ajax
      .delete(endpoint, headers)
      .then((result) => {
        browser.loaded()
        if (result.statusCode === 200) {
          listener.updateDeleted()
        } else {
          self.handleError(result.data)
        }
      }, () => {
        self.handleServerError()
      })
  }

  self.save = () => {
    const endpoint = self.endpointBuilder.impactUpdates().build()
    const headers = self.headers(cookies.get('session-token'))
    const data = {
      DisplayDate: new Date(self.displayDateYear(), self.displayDateMonth() - 1, self.displayDateDay()),
      Content: self.updateContent(),
      CityId: self.cityId()
    }
    browser.loading()
    ajax
      .post(endpoint, headers, data)
      .then((result) => {
        if (result.statusCode === 201) {
          browser.loaded()
          listener.updateCreated()
          self.clear()
        } else {
          self.handleError(result.data)
        }
      }, () => {
        self.handleServerError()
      })
  }
}

Update.prototype = new BaseViewModel()

module.exports = Update
