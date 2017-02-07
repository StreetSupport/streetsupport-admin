const jsRoot = '../../'
const ajax = require(`${jsRoot}ajax`)
const endpoints = require(`${jsRoot}api-endpoints`)
const browser = require(`${jsRoot}browser`)

function Lister () {
  const self = this

  self.init = () => {
    browser.loading()
    ajax.get(endpoints.temporaryAccommodation)
  }
}

module.exports = Lister
