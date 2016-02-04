var redirect = function (url) {
  window.location = url
}

var dataLoaded = function () {
  var dynamicElements = document.getElementsByClassName('awaiting-data')
  _.forEach(dynamicElements, function(element) {
    element.className = element.className.replace( /(?:^|\s)awaiting-data(?!\S)/g , '' )
  })
}

module.exports = {
  redirect: redirect,
  dataLoaded: dataLoaded
}
