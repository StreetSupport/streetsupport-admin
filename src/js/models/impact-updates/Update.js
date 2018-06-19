let ko = require('knockout')
let ajax = require('../../ajax')
let BaseViewModel = require('../BaseViewModel')
let browser = require('../../browser')
let cookies = require('../../cookies')
var htmlencode = require('htmlencode')
var marked = require('marked')

const today = new Date()
const defaultDisplayDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`

function Update (listener, cityId, data = { content: '', displayDate: defaultDisplayDate }) {
  var self = this

  self.listener = listener

  const [day, month, year] = data.displayDate.split('/')

  self.id = ko.observable(data.id)
  self.updateContent = ko.observable(htmlencode.htmlDecode(data.content))
  self.updateContentForDisplay = ko.computed(() => {
    return marked(self.updateContent())
  }, self)
  self.displayDateDay = ko.observable(day)
  self.displayDateMonth = ko.observable(month)
  self.displayDateYear = ko.observable(year)
  self.displayDate = ko.observable(data.displayDate)
  self.cityId = ko.observable(cityId || data.cityId)
  self.isEditing = ko.observable(false)

  self.clear = () => {
    self.updateContent('')
    self.displayDateDay('01')
    self.displayDateMonth('01')
    self.displayDateYear('2017')
    self.cityId('')
  }

  self.deleteUpdate = () => {
    const endpoint = self.endpointBuilder.impactUpdates(self.id()).build()
    browser.loading()
    ajax
      .delete(endpoint)
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

  self.enableEditing = () => {
    self.isEditing(true)
  }

  self.cancelEditing = () => {
    self.isEditing(false)
  }

  self.update = () => {
    const endpoint = self.endpointBuilder.impactUpdates(self.id()).build()
    const data = {
      DisplayDate: new Date(self.displayDateYear(), self.displayDateMonth() - 1, self.displayDateDay()),
      Content: self.updateContent(),
      CityId: self.cityId()
    }
    browser.loading()
    ajax
      .put(endpoint, data)
      .then((result) => {
        browser.loaded()
        if (result.statusCode === 200) {
          self.isEditing(false)
          listener.updateAmended()
          self.clear()
        } else {
          self.handleError(result)
        }
      }, () => {
        self.handleServerError()
      })
  }

  self.save = () => {
    const endpoint = self.endpointBuilder.impactUpdates().build()
    const data = {
      DisplayDate: new Date(self.displayDateYear(), self.displayDateMonth() - 1, self.displayDateDay()),
      Content: self.updateContent(),
      CityId: self.cityId()
    }
    browser.loading()
    ajax
      .post(endpoint, data)
      .then((result) => {
        browser.loaded()
        if (result.statusCode === 201) {
          listener.updateCreated()
          self.clear()
        } else {
          self.handleError(result)
        }
      }, () => {
        self.handleServerError()
      })
  }
}

Update.prototype = new BaseViewModel()

module.exports = Update
