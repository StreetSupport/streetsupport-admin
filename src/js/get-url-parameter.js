/* global location */

const getUrlParameter = function (name) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  const results = regex.exec(location.search)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

function getParameterByName (name) {
  const match = RegExp('[#&]' + name + '=([^&]*)').exec(location.hash)
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
}

module.exports = {
  parameter: getUrlParameter,
  hashParameter: getParameterByName
}
